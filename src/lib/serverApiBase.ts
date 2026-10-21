/**
 * Server-side API base URL resolver.
 *
 * Browser code reads `NEXT_PUBLIC_API_URL` (the host-published URL, inlined at
 * build time). Server-side Next code (the middleware's `/auth/verify` call and
 * the DataSync calls middleware triggers) needs a URL reachable from inside the
 * server process, which under Docker is the internal service name — not the
 * browser's `localhost`. This resolver reads `INTERNAL_API_URL` at runtime and
 * falls back to `NEXT_PUBLIC_API_URL` when unset (bare-dev, where both resolve
 * to the same host).
 *
 * A single trailing slash is trimmed so callers can safely append paths such as
 * `/auth/verify`.
 */
export function getServerApiBaseUrl(): string {
  const base = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '';
  return base.replace(/\/$/, '');
}
