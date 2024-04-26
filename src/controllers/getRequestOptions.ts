export function getRequestOptions<T>(
  method: string = "GET",
  body?: T,
  contentType: string = "application/json",
  headers: Record<string, string> = {},
  cookie?: string
): RequestInit {
  const options: RequestInit = {
    method,
    headers: {
      ...(cookie && { Cookie: cookie }),
      ...headers,
      ...(contentType && { "Content-Type": contentType }),
    },
    body: body instanceof FormData ? body : body && JSON.stringify(body),
  };

  return options;
}
