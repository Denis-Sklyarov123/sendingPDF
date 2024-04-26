import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";

import { PathTypesPrfx } from "../types/enums/prefixes";
import type {
  FileContent,
  IEmailAttachment,
} from "../types/interfaces/fileContent";

const takeCsId = (fileName: string): number => {
  const csId = fileName.split(/[._]/)[1];

  return Number(csId);
};

const generateUniqString = (): string => {
  const currentDate = new Date();

  const { year, month, day, hours, minutes, seconds, milliseconds } = {
    year: currentDate.getFullYear(),
    month: (currentDate.getMonth() + 1).toString().padStart(2, "0"),
    day: currentDate.getDate().toString().padStart(2, "0"),
    hours: currentDate.getHours().toString().padStart(2, "0"),
    minutes: currentDate.getMinutes().toString().padStart(2, "0"),
    seconds: currentDate.getSeconds().toString().padStart(2, "0"),
    milliseconds: currentDate.getMilliseconds().toString().padStart(3, "0"),
  };

  return `${day}${month}${year}${hours}${minutes}${seconds}${milliseconds}`;
};

export const takeListPDF = (): FileContent[] => {
  try {
    console.log("getting list of PDF...");
    let result: FileContent[] = [];

    const mainFolders = {
      origin: "/home/progforce/workSpace/test123" as string,
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
    throw new Error(
      `Error getting list of PDF: ${err.message} at ${err.stack}`
    );
  }
};

export const groupByCsId = (list: FileContent[]): FileContent[][] => {
  console.log("grouping by CsId and Prefix...");

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
  console.log("making email attachments...");

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
