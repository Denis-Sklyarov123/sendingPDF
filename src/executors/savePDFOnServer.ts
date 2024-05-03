import axios from "axios";
import { ObjectId } from "mongodb";
import FormData from "form-data";
import dotenv from "dotenv";
import { logger } from "../utils/loggerConfig";

import { RequestPrfx } from "../types/enums/prefixes";
import type { FileContent } from "../types/interfaces/fileContent";

dotenv.config({
  path: "/home/progforce/workSpace/Projects/grainjs-projects/sendingPDF/.env",
});

export const savePDFOnServer = async (files: FileContent[]) => {
  for (const file of files) {
    try {
      const url = `${process.env.APP_URL}${
        RequestPrfx.upload
      }/bloodTest---[${new ObjectId(file.fileId)}]_${
        file.fileName
      }--md--${new ObjectId(file.attachmentId)}--md--Sharan.Attachment`;

      const formData = new FormData();

      formData.append("bloodTest", file.content, "bloodTest.pdf");

      const headers = Object.assign(
        {},
        axios.defaults.headers.common,
        formData.getHeaders()
      );
      logger.info("APP_URL", process.env.APP_URL);

      await axios({
        method: "post",
        url: url,
        data: formData,
        headers: headers,
      });
    } catch (err: any) {
      logger.error(
        `save PDF ${file.fileName} failed with error: ${err.message} at ${err.stack}`
      );
      throw new Error(
        `save PDF ${file.fileName} failed with error: ${err.message} at ${err.stack}`
      );
    }
  }
};
