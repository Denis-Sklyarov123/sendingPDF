import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { Response } from "node-fetch";
import { routes } from "../types/enums/router";
import { getRequestOptions } from "../controllers/getRequestOptions";
import { sendRequest } from "../utils/sendRequest";

import type { AuthInfo } from "../types/interfaces/fileContent";
import type { LoginData } from "../types/interfaces/loginData";

function takeCookie(response: Response): string {
  const cookiesHeader: string | null = response.headers.get("set-cookie");
  if (!cookiesHeader) return "";

  const endIndex: number = cookiesHeader.indexOf(";");
  const cookie: string = cookiesHeader.substring(
    0,
    endIndex !== -1 ? endIndex : undefined
  );
  return cookie;
}

// const loginData = {
//   login: ``,
//   password: ``,
// };

export async function login(loginData: LoginData): Promise<string> {
  const requestOptions: RequestInit = getRequestOptions(
    "POST",
    loginData,
    "application/json",
    {}
  );

  try {
    const response = await sendRequest(
      `${"http://localhost:3107"}/${routes.login}`,
      requestOptions
    );

    const cookies: string = takeCookie(response);

    const infoRequestOptions: RequestInit = getRequestOptions(
      "GET",
      undefined,
      undefined,
      undefined,
      cookies
    );

    const userInfoResponse = await sendRequest(
      `${"http://localhost:3107"}/${routes.login}/${
        routes.selectProfileDefault
      }`,
      infoRequestOptions
    );

    console.log("User information:", userInfoResponse);
    return cookies;
  } catch (error) {
    console.error(
      "An error occurred while executing the authorization request:",
      error
    );
    throw error;
  }
}

const loginData = {
  login: `admin`,
  password: `admin`,
};

export const loginAxios = async (): Promise<void> => {
  try {
    console.log("login process...");

    const url = "http://localhost:3107" + routes.login;

    const result = await axios.post<string, any, AuthInfo>(url, loginData);

    if (!result.headers["set-cookie"]) throw new Error("Unauthorized");

    axios.defaults.headers.common["Cookie"] = result.headers["set-cookie"];

    const selectProfileUrl =
      "http://localhost:3107" + result.data.replace("[redirect]", "");

    await axios.get(selectProfileUrl);
  } catch (err: any) {
    throw new Error(`Login failed with error: ${err.message} at ${err.stack}`);
  }
};
