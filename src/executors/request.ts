import axios from "axios";
import "dotenv/config";

import { RequestPrfx } from "../types/enums/prefixes";
import type { IRequestPost, RequestGet } from "../types/interfaces/request";
import type { IResponseGet, IResponsePost } from "../types/interfaces/response";

const execQuery = async <T, U>(data: T): Promise<U> => {
  const url = "http://localhost:3107" + RequestPrfx.direct;

  return await axios({
    method: "post",
    url,
    data: data,
  });
};

export const execGetQuery = async <T>(data: RequestGet): Promise<T> => {
  try {
    const response = await execQuery<RequestGet, IResponseGet>(data);
    const responseData = response.data[0];
    // console.log("data??????????????????", responseData);

    if (!Array.isArray(responseData.result))
      throw new Error(responseData.result.errors);

    console.log("execGetQuery success: ", true);

    return responseData.result as T;
  } catch (err: any) {
    throw new Error(
      `execGetQuery failed with error: ${err.message} at ${err.stack}`
    );
  }
};

export const execPostQuery = async (data: IRequestPost): Promise<void> => {
  try {
    const response = await execQuery<IRequestPost, IResponsePost>(data);
    const responseData = response.data[0];
    console.log("execPostQuery success: ", responseData.result.success);
  } catch (err: any) {
    throw new Error(
      `execPostQuery failed with error: ${err.message} at ${err.stack}`
    );
  }
};
