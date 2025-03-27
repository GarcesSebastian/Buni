import { Faculty } from "./Faculty"
import { Form } from "./Forms"

export interface TableEvent {
  name: string,
  key: string,
  isQR: boolean,
  isView: boolean
}

export interface Assists {
  [key: string]: string | number; 
}

export interface Event {
  id: number
  nombre: string
  organizador: string
  scenery: {
    value: string,
    data: Scenery
  }
  faculty: {
    value: string,
    data: Faculty
  }
  cupos: number
  fecha: string
  hora: string
  state: string
  formAssists: {
    value: string,
    data: Form
  }
  formInscriptions: {
    value: string,
    data: Form
  }
  assists?: Assists[]
  inscriptions?: Assists[]
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
  nombre: string;
  state: string;
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