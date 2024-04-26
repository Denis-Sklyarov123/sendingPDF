import axios from "axios";
import { ObjectId } from "mongodb";
import FormData from "form-data";
import dotenv from "dotenv";

import { RequestPrfx } from "../types/enums/prefixes";
import type { FileContent } from "../types/interfaces/fileContent";

dotenv.config();

export const savePDFOnServer = async (files: FileContent[]) => {
  for (const file of files) {
    try {
      const url = `http://localhost:3107${
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

      // console.log("file", file);
      // console.log("headers >>>>>>>>>>>>>>>>>>", headers);
      // console.log("formData ----------------->", formData);
      // console.log("url ======================>", url);

      await axios({
        method: "post",
        url: url,
        data: formData,
        headers: headers,
      });
    } catch (err: any) {
      throw new Error(
        `save PDF ${file.fileName} failed with error: ${err.message} at ${err.stack}`
      );
    }
  }
};
