import type { SharanResponse } from "../types/interfaces/loginData";

export async function sendRequest(
  url: string | URL | Request,
  options: FetchRequestInit
) {
  try {
    const response: SharanResponse = await fetch(url, options);
    if (response.ok) {
      return response;
    } else {
      console.log("response", response);
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending request:", error.message);
    }
    throw error;
  }
}
