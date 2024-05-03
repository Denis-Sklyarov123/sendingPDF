import axios from "axios";
import "dotenv/config";

import { RequestPrfx } from "../types/enums/prefixes";
import type { IRequestPost, RequestGet } from "../types/interfaces/request";
import type { IResponseGet, IResponsePost } from "../types/interfaces/response";
import { logger } from "../utils/loggerConfig";

const execQuery = async <T, U>(data: T): Promise<U> => {
  const url = process.env.APP_URL + RequestPrfx.direct;

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

    if (!Array.isArray(responseData.result))
      throw new Error(responseData.result.errors);

    logger.info("execGetQuery success: ", true);

    return responseData.result as T;
  } catch (err: any) {
    logger.error(
      `execPostQuery failed with error: ${err.message} at ${err.stack}`
    );
    throw new Error(
      `execGetQuery failed with error: ${err.message} at ${err.stack}`
    );
  }
};

export const execPostQuery = async (data: IRequestPost): Promise<void> => {
  try {
    const response = await execQuery<IRequestPost, IResponsePost>(data);
    const responseData = response.data[0];
    logger.info("execPostQuery success: ", responseData.result.success);
  } catch (err: any) {
    logger.error(
      `execPostQuery failed with error: ${err.message} at ${err.stack}`
    );
    throw new Error(
      `execPostQuery failed with error: ${err.message} at ${err.stack}`
    );
  }
};
