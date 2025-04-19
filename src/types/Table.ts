export interface GeneralStructureForm {
    [key: string]: {
      name: string;
      type: "text" | "number" | "date" | "time" | "select" | "email" | "password";
      required?: boolean;
      options?: { value: string; label: string; id?: number }[];
    } & (
      | {
          type: "select";
          options: { value: string; label: string; id?: number }[];
      }
      | {
          type: "text" | "number" | "date" | "time" | "password" | "email";
      }
    );
}