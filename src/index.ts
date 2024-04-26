import { login, loginAxios } from "./executors/login";
import {
  takeListPDF,
  groupByCsId,
  makeEmailAttachments,
} from "./executors/file";
import { savePDFOnServer as savePDFOnServer } from "./executors/savePDFOnServer";
import { execGetQuery, execPostQuery } from "./executors/request";

import type {
  FileContent,
  IEmailAttachment,
} from "./types/interfaces/fileContent";
import type { IRequestPost, RequestGet } from "./types/interfaces/request";
import {
  makeCreateAttachmentsQuery,
  makeGetClientServiceQuery,
} from "./executors/query";
import type { IClientService } from "./types/interfaces/responseData";
import { savePDFInDB } from "./executors/savePDFInDB";
import { password } from "bun";
import { sendEmail } from "./executors/sendEmail";

const main = async () => {
  console.log("starting...");

  try {
    await loginAxios();

    const fileList: FileContent[] = takeListPDF();
    if (!fileList.length) {
      throw new Error("files not found");
    }

    const groupedFileList: FileContent[][] = groupByCsId(fileList);
    console.log("files to attach:");

    for (const files of groupedFileList) {
      // console.log("files ! ! ! ! !", files);

      const patientId = "1000002"; // The value of the ID field of the required patient
      const queryGetPatientData: RequestGet =
        makeGetClientServiceQuery(patientId);
      const patientData = await execGetQuery<IClientService[]>(
        queryGetPatientData
      );
      const patient = patientData[0];

      // console.log("patient", patient);

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
    console.log("finished");
    process.exit(0);
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

main();
