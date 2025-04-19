export interface TableUser {
  name: string;
  key: string;
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
  };
  roles: {
    name: string;
    type: "select";
    required?: boolean;
    options: { value: string; label: string; id?: number }[];
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: {
    id: number;
    key: string;
  };
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: {
      [key: string]: boolean;
  };
  state: string;
}