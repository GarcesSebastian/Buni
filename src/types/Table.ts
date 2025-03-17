export interface GeneralStructureForm {
    [key: string]: {
      name: string;
      type: "text" | "number" | "date" | "time" | "selection";
      options: { value: string; label: string; id?: number }[];
    };
}