/**
 * Shared API envelope types.
 *
 * The backend returns `{ message, data }` on mutations, bare arrays/objects on reads,
 * and `data: true` booleans on some deletes. `Envelope<T>` models the mutation shape;
 * `unwrap` (in `@/lib/api/client`) normalizes an envelope back to its `data` payload.
 */
export type Envelope<T> = { message: string; data: T };

export interface ApiErrorBody {
  error?: string;
  message?: string;
  [key: string]: unknown;
}
