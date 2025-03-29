export interface TableUser {
  name: string;
  key: string;
}

export interface ConfigUser {
  key: string;
  value: string;
}

export interface ConfigFormUser {
  nombre: {
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
    type: "selection";
    required?: boolean;
    options: { value: string; label: string; id?: number }[];
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string;
  created_at: string;
}
