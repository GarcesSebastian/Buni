export interface GeneralStructureForm {
    [key: string]: {
      name: string;
      type: "text" | "number" | "date" | "time" | "selection" | "email" | "password";
      required?: boolean;
      options?: { value: string; label: string; id?: number }[];
    } & (
      | {
          type: "selection";
          options: { value: string; label: string; id?: number }[];
      }
      | {
          type: "text" | "number" | "date" | "time" | "password" | "email";
      }
    );
}