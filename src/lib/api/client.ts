import Cookies from "js-cookie";
import type { Envelope } from "@/types/api";
import { getServerApiBaseUrl } from "@/lib/serverApiBase";

export type { Envelope } from "@/types/api";

/**
 * Typed error thrown by {@link apiFetch} when `response.ok` is false.
 * `status` is the HTTP status; `body` is the parsed response body (if any).
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * The single typed REST client for the Buni frontend (design §5.1).
 *
 * - Resolves the API base URL from `NEXT_PUBLIC_API_URL` once.
 * - Injects the bearer header from the JS-readable `token` cookie (the primary
 *   cross-origin transport, §3.8) unless `auth: false` is passed.
 * - Sets `credentials: 'include'` so the additive HttpOnly `token_hs` cookie rides along.
 * - Checks `response.ok` and throws a typed {@link ApiError} otherwise.
 *
 * Callers choose the response type: bare body (`GET /events` -> `Event[]`) or an
 * envelope (mutations -> `Envelope<T>`, then {@link unwrap}).
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  // Browser keeps reading NEXT_PUBLIC_API_URL byte-for-byte; server-side callers
  // (e.g. middleware-triggered DataSync) use the runtime-resolved internal URL.
  const base =
    (typeof window === "undefined"
      ? getServerApiBaseUrl()
      : process.env.NEXT_PUBLIC_API_URL) ?? "";
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = Cookies.get("token"); // JS cookie stays primary (cross-origin, §3.8)
  if (init.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  const text = await res.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (parsed as { error?: string } | null)?.error ?? res.statusText;
    throw new ApiError(res.status, message, parsed);
  }

  return parsed as T;
}

/**
 * Normalizes a response that may be an {@link Envelope} back to its `data` payload.
 * Bare (non-envelope) responses pass through unchanged.
 */
export const unwrap = <T>(r: Envelope<T> | T): T =>
  r && typeof r === "object" && "data" in (r as object)
    ? (r as Envelope<T>).data
    : (r as T);
