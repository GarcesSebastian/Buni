export interface TableUser {
  name: string;
  key: string;
  isUser?: boolean;
}

export interface ConfigUser {
  key: string;
  value: string;
  filter?: boolean;
}

export interface ConfigFormUser {
  name: {
    name: string;
    type: "text";
    required?: boolean;
  };
  email: {
    name: string;
    type: "email";
    required?: boolean;
  };
  password: {
    name: string;
    type: "password";
    required?: boolean;
    noEdit?: boolean;
  };
  roles: {
    name: string;
    type: "select";
    required?: boolean;
    options: { value: string; label: string; id?: number }[];
  };
}

import type { Permissions } from "@/types/Permissions";

/**
 * Table/list-facing user (as rendered in the users table): the role is referenced
 * by `{ id, key }` so {@link TableGeneric} can resolve the role name from the data bag.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  roles: {
    id: string;
    key: string;
  };
  created_at: string;
}

/**
 * Canonical authenticated-session user (the shape returned by `/auth/verify` and stored
 * in `useAuth`). `permissions` is either a full {@link Permissions} map or the admin
 * sentinel `'***'`. Re-exported from `@/hooks/auth/useAuth` as `User` for existing imports.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permissions | "***";
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permissions;
  state: string;
}