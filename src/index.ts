import { loginAxios } from "./executors/login";
import {
  takeListPDF,
  groupByCsId,
  makeEmailAttachments,
} from "./executors/file";
import { savePDFOnServer as savePDFOnServer } from "./executors/savePDFOnServer";
import { execGetQuery, execPostQuery } from "./executors/request";
import { logger } from "./utils/loggerConfig";

import type {
  FileContent,
  IEmailAttachment,
} from "./types/interfaces/fileContent";
import type { IRequestPost, RequestGet } from "./types/interfaces/request";
import {
  makeCreateAttachmentsQuery,
  makeGetPatientQuery,
} from "./executors/query";
import type { IPatient } from "./types/interfaces/responseData";
import { sendEmail } from "./executors/sendEmail";

logger.info("process.args", process.argv); // bun index.ts ID The value of the ID field of the required patient

const main = async () => {
  logger.info("starting...");

  try {
    await loginAxios();

    const fileList: FileContent[] = takeListPDF();
    if (!fileList.length) {
      throw new Error("files not found");
    }

    const groupedFileList: FileContent[][] = groupByCsId(fileList);
    logger.info("files to attach:");

    for (const files of groupedFileList) {
      const patientId = process.argv[2];
      const queryGetPatientData: RequestGet = makeGetPatientQuery(patientId);
      const patientData = await execGetQuery<IPatient[]>(queryGetPatientData);
      const patient = patientData[0];

      const queryCreateAttachments: IRequestPost = makeCreateAttachmentsQuery(
        files,
        patient._id
      );

      await execPostQuery(queryCreateAttachments);

      await savePDFOnServer(files);

      const emailAttachments: IEmailAttachment[] = makeEmailAttachments(files);

      const file = files[0];

      const sendEmailParams = {
        patientId: patient._id,
        fileName: file.fileName,
        from: patient.emailFrom,
        host: patient.host,
        to: patient.emailTo,
        pass: patient.password,
        userName: patient.userName,
        port: patient.port,
        attachments: emailAttachments,
      };

      await sendEmail(sendEmailParams);
    }
    logger.info("finished");
    process.exit(0);
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};

main();
