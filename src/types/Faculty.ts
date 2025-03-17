export interface TableFaculty {
  name: string;
  key: string;
}

export interface Faculty {
  id: number;
  nombre: string;
  state: string;
}

export interface ConfigFaculty {
  key: string;
  value: string;
}

export interface ConfigFormFaculty {
  nombre: {
    name: string;
    type: string;
  };
  state: {
    name: string;
    type: string;
    options: { value: string; label: string }[];
  };
}
