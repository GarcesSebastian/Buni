export interface TableFaculty {
  name: string;
  key: string;
}

export interface Faculty {
  id: number;
  name: string;
  state: string;
}

export interface ConfigFaculty {
  key: string;
  value: string;
  filter?: boolean;
}

export interface ConfigFormFaculty {
  name: {
    name: string;
    type: string;
  };
  state: {
    name: string;
    type: string;
    options: { value: string; label: string }[];
  };
}
