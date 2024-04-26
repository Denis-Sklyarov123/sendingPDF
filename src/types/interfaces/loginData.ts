export interface LoginData {
  login: string;
  password: string;
}

export interface RequestOptions {
  method: string;
  headers: { [key: string]: string };
  body?: string;
  cookies?: string;
}

interface SharanSuccess extends Response {
  ok: true;
  url: string;
  status: number;
  statusText: string;
  headers: Headers;
  redirected: boolean;
  bodyUsed: boolean;
}

interface SharanFailure extends Response {
  ok: false;
  url: string;
  status: number;
  statusText: string;
  headers: Headers;
  redirected: boolean;
  bodyUsed: boolean;
}

export type SharanResponse = SharanSuccess | SharanFailure;
