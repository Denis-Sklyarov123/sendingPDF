import type { RequestParamMethod } from "./requestMethod";

interface IResponse {
  action: string;
  method: RequestParamMethod;
}

interface IGetResult {
  result: { [key: string]: any }[] | { errors: string; success: boolean };
}

export interface IResponseGet extends IResponse {
  data: IGetResult[];
}

interface IPostResult {
  result: {
    success: boolean;
  };
}

export interface IResponsePost extends IResponse {
  data: IPostResult[];
}
