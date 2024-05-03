import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import { takeCsId } from "../helpers/takeCsId";
import { generateUniqString } from "../helpers/generateUniqString";
import { logger } from "../utils/loggerConfig";

import { PathTypesPrfx } from "../types/enums/prefixes";
import type {
  FileContent,
  IEmailAttachment,
} from "../types/interfaces/fileContent";

dotenv.config({
  path: "/home/progforce/workSpace/Projects/grainjs-projects/sendingPDF/.env",
});

export const takeListPDF = (): FileContent[] => {
  try {
    logger.info("getting list of PDF...");
    let result: FileContent[] = [];

    const mainFolders = {
      origin: process.env.ORIGIN_FOLDER as string,
      prefixes: Object.keys(PathTypesPrfx) as Array<keyof typeof PathTypesPrfx>,
    };

    const dirPath = mainFolders.origin;
    const prefix = "test123";

    const files = fs.readdirSync(dirPath);

    files.forEach((fileName) => {
      if (path.extname(fileName) !== ".pdf") return;

      const content = fs.readFileSync(path.join(dirPath, fileName));
      const uniqString = generateUniqString();
      const uniqName = uniqString + "_" + prefix + "_" + fileName;

      const fileContent: FileContent = {
        attachmentId: new ObjectId().toString(),
        fileId: new ObjectId().toString(),
        content: content,
        fileName,
        uniqName,
        dirPath,
        prefix,
        csId: takeCsId(fileName),
      };

      result.push(fileContent);
    });

    return result;
  } catch (err: any) {
    logger.error(`Error getting list of PDF: ${err.message} at ${err.stack}`);
    throw new Error(
      `Error getting list of PDF: ${err.message} at ${err.stack}`
    );
  }
};

export const groupByCsId = (list: FileContent[]): FileContent[][] => {
  logger.info("grouping by CsId and Prefix...");

  const result: FileContent[][] = [];

  const csIds = list.map((item) => item.csId);

  const csIdsSet = new Set(csIds);

  csIdsSet.forEach((csId) => {
    const csIdList = list.filter((item) => item.csId === csId);

    result.push(csIdList);
  });

  return result;
};

export const makeEmailAttachments = (
  files: FileContent[]
): IEmailAttachment[] => {
  logger.info("making email attachments...");

  const result: IEmailAttachment[] = [];

  files.forEach((file) => {
    const attachment: IEmailAttachment = {
      filename: file.uniqName,
      content: file.content,
      contentType: "application/pdf",
    };
    result.push(attachment);
  });

  return result;
};
