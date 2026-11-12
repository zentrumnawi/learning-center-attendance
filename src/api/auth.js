import { httpJson } from "./http";

export function parseCsrfToken(data) {
  const token = data.csrfToken;
  if (token) {
    return token;
  }

  throw new Error("Unexpected CSRF response format");
}

export async function fetchCsrfToken() {
  const data = await httpJson("/api/auth/csrf/");
  return parseCsrfToken(data);
}
