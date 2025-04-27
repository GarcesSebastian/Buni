export interface TableEvent {
  name: string,
  key: string,
  isQR: boolean,
  isView: boolean
}

export interface Assists {
  [key: string]: string | number | Record<string, string | string[]>;
}

export interface Event {
  id: number
  nombre: string
  organizador: string
  scenery?: {
    id: number
    key: string
  }
  programs?: {
    id: number
    key: string
  }
  cupos: string | number
  availableCupos: string | number
  horarioInicio: string
  horarioFin: string
  state: string
  formAssists?: {
    id: number
    key: string
  }
  formInscriptions?: {
    id: number
    key: string
  }
  assists?: Assists[]
  inscriptions?: Assists[]
}

export interface ConfigEvent {
  key: string;
  value: string;
  filter?: boolean;
}

export interface ConfigEventForm {
  nombre: {
    name: string
    type: string
  }
  organizador: {
    name: string
    type: string
  }
  cupos: {
    name: string
    type: string
  }
  horarioInicio: {
    name: string
    type: string
  },
  horarioFin: {
    name: string
    type: string
  },
  programs: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[] | []
  }
  scenery: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[] | []
  }
  formAssists: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[] | []
  }
  formInscriptions: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[] | []
  }
  state: {
    name: string
    type: string
    options: { value: string, label: string }[]
  }
}

export interface TableScenery {
  name: string;
  key: string;
}

export interface Scenery {
  id: number;
  name: string;
  state: string;
}

export interface ConfigScenery {
  key: string;
  value: string;
  filter?: boolean;
}

export interface ConfigFormScenery {
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