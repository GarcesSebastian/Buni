export interface TableUser {
  name: string;
  key: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: string;
  password?: string;
  state: string;
}

export interface ConfigUser {
  key: string;
  value: string;
}

export interface ConfigFormUser {
  nombre: {
    name: string;
    type: string;
  };
  email: {
    name: string;
    type: string;
  };
  password: {
    name: string;
    type: string;
  };
  role: {
    name: string;
    type: string;
    options: { value: string; label: string }[];
  };
  state: {
    name: string;
    type: string;
    options: { value: string; label: string }[];
  };
}
