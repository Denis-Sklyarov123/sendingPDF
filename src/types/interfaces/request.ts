import type { RequestParamMethod } from "./requestMethod";

interface IRequest {
  action: string;
  method: RequestParamMethod;
  type: string;
}

export interface IQueryGet {
  model: string;
  conditions?: { [key: string]: unknown };
  fields?: string;
  ensure?: boolean;
  childRel?: Array<IQueryGet & { opposite: string }>;
}

export interface RequestGet extends IRequest {
  data: [
    {
      queryIn: IQueryGet;
    }
  ];
}

export interface IQueryPost {
  serverModel: string;
  action: string;
  objectId: string;
  changes: {
    key: string;
    to: unknown;
  }[];
  hasMany?: {}[];
  belongsTo?: {
    key: string;
    serverModel: string;
    from?: string;
    to: unknown;
  }[];
}

export interface IRequestPost extends IRequest {
  data: IQueryPost[][];
}
