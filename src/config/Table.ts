import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";

export interface GeneralStructureForm {
    [key: string]: {
      name: string;
      type: "text" | "number" | "date" | "time" | "selection";
      options: { value: string; label: string; id?: number }[];
    };
}

export type GeneralTable = Event | Faculty | Scenery