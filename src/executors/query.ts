import { getClientService } from "../queries/getQueries";
import { ObjectId } from "mongodb";

import type { FileContent } from "../types/interfaces/fileContent";
import type {
  RequestGet,
  IQueryGet,
  IRequestPost,
  IQueryPost,
} from "../types/interfaces/request";
import { RequestParamMethod } from "../types/interfaces/requestMethod";
import { PathTypesPrfx } from "../types/enums/prefixes";
import { createAttachments } from "../queries/postQueries";

const makeGetRequestBody = (query: IQueryGet): RequestGet => {
  return {
    action: "Modeleditor",
    method: RequestParamMethod.runQuery,
    type: "rpc",
    data: [
      {
        queryIn: query,
      },
    ],
  };
};

const makePostRequestBody = (query: IQueryPost[]): IRequestPost => {
  return {
    action: "Modeleditor",
    method: RequestParamMethod.DirectFormSubmit,
    type: "rpc",
    data: [query],
  };
};

export const makeCreateAttachmentsQuery = (
  files: FileContent[],
  cs_id: string
): IRequestPost => {
  const queries: IQueryPost[] = [];

  files.forEach((file) => {
    const fileName = `[${new ObjectId(file.fileId)}]_${file.fileName}`;

    const queryParams = {
      id: file.attachmentId,
      fileName: fileName,
      type: PathTypesPrfx[file.prefix],
      date: new Date(),
      cs_id,
    };

    const query = createAttachments(queryParams);
    queries.push(query);
  });

  return makePostRequestBody(queries);
};

export const makeGetPatientQuery = (csId: string): RequestGet => {
  const requestData: IQueryGet = getClientService(csId); // The value of the ID field of the required patient

  return makeGetRequestBody(requestData);
};
