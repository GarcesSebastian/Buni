export interface TablePrograms {
  name: string;
  key: string;
}

export interface Programs {
  id: number;
  name: string;
  state: string;
}

export interface ConfigPrograms {
  key: string;
  value: string;
  filter?: boolean;
}

export interface ConfigFormPrograms {
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
