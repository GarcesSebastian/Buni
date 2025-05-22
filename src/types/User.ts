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

export interface Role {
  id: string;
  name: string;
  permissions: Permissions;
  state: string;
}