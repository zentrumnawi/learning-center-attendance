let csrfTokenProvider = null;

export function setCsrfTokenProvider(provider) {
  csrfTokenProvider = provider;
}

function isUnsafeMethod(method) {
  return method !== "GET";
}

export class HttpError extends Error {
  constructor(message, opts) {
    super(message);
    this.name = "HttpError";
    this.status = opts.status;
    this.body = opts.body;
  }
}

async function parseJsonOrText(res) {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return await res.json().catch(() => null);
  }
  return await res.text().catch(() => null);
}

export async function httpJson(path, opts) {
  const headers = {
    Accept: "application/json",
    ...(opts?.headers ?? {}),
  };

  const method = opts?.method ?? "GET";

  if (isUnsafeMethod(method)) {
    const csrfToken = csrfTokenProvider?.() ?? null;
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  let body;
  if (opts?.body !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    body = JSON.stringify(opts.body);
  }

  let res;
  res = await fetch(path, {
    method,
    headers,
    body,
    signal: opts?.signal,
    credentials: "include",
    cache: opts?.cache,
  });

  const parsed = await parseJsonOrText(res);
  if (!res.ok) {
    const message = `HTTP ${res.status} ${res.statusText}`;
    throw new HttpError(message, { status: res.status, body: parsed });
  }

  return parsed;
}
