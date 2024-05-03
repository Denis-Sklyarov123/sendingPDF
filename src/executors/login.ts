import dotenv from "dotenv";
dotenv.config({
  path: "/home/progforce/workSpace/Projects/grainjs-projects/sendingPDF/.env",
});
import axios from "axios";
import { routes } from "../types/enums/router";
import { logger } from "../utils/loggerConfig";

import type { AuthInfo } from "../types/interfaces/fileContent";

const loginData = {
  login: `admin`,
  password: `admin`,
};

export const loginAxios = async (): Promise<void> => {
  try {
    logger.info("login process...");

    const url = process.env.APP_URL + routes.login;

    const result = await axios.post<string, any, AuthInfo>(url, loginData);

    if (!result.headers["set-cookie"]) throw new Error("Unauthorized");

    axios.defaults.headers.common["Cookie"] = result.headers["set-cookie"];

    const selectProfileUrl =
      process.env.APP_URL + result.data.replace("[redirect]", "");

    await axios.get(selectProfileUrl);
  } catch (err: any) {
    logger.error(`Login failed with error: ${err.message} at ${err.stack}`);
    throw new Error(`Login failed with error: ${err.message} at ${err.stack}`);
  }
};
