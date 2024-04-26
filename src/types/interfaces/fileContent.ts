import { PathTypesPrfx } from "../enums/prefixes";

export interface FileContent {
  attachmentId: string;
  fileId: string;
  content: Buffer;
  fileName: string;
  uniqName: string;
  dirPath: string;
  csId: number;
  prefix: keyof typeof PathTypesPrfx;
}

export interface AuthInfo {
  login: string;
  password: string;
}

export interface IEmailAttachment {
  filename: string;
  content: Buffer;
  contentType: "application/pdf";
}
