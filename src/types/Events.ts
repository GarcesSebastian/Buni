import { Form } from "./Forms"

export interface TableEvent {
  name: string,
  key: string,
  isQR: boolean
}

export interface Event {
  id: number
  nombre: string
  organizador: string
  scenerys: string
  faculties: string
  cupos: number
  fecha: string
  hora: string
  state: boolean
  form: {
    value: string,
    data: Form
  }
}

export interface ConfigEvent {
  key: string;
  value: string;
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
  hora: {
    name: string
    type: string
  }
  fecha: {
    name: string
    type: string
  }
  faculty: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[] | []
  }
  scenery: {
    name: string
    type: string
    options: { value: string, label: string, id: number }[] | []
  }
  form: {
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
  nombre: string;
  state: boolean;
}

export interface ConfigScenery {
  key: string;
  value: string;
}

export interface ConfigFormScenery {
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