let csrfTokenProvider = null;

export function setCsrfTokenProvider(provider) {
  csrfTokenProvider = provider;
}

function isUnsafeMethod(method) {
  return method !== "GET";
}

function readCsrfCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/);
  console.log("document.cookie", document.cookie);
  console.log("match", match);
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return value || null;
}

/*
 * Prefer the browser cookie over the store: admin login in another tab can
 * rotate csrftoken while the store still holds the startup value.
 */
function getCsrfToken() {
  return readCsrfCookie() || csrfTokenProvider?.() || null;
}

async function ensureCsrfToken() {
  const existing = getCsrfToken();
  if (existing) return existing;

  try {
    const res = await fetch("/api/auth/csrf/", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return getCsrfToken();

    const data = await res.json().catch(() => null);
    return readCsrfCookie() || data?.csrfToken || null;
  } catch {
    return getCsrfToken();
  }
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
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  let body;
  if (opts?.body !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(path, {
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
