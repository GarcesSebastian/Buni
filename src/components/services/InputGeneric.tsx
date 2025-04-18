import { InputPassword } from "@/components/ui/InputPassword"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { User } from "@/hooks/auth/useUserData";
import { useState } from "react";
import { Button } from "../ui/Button";
interface PropsInputBasic {
    data: {
        form: {
            name: string;
            type: "text" | "number" | "date" | "time" | "selection" | "password" | "email";
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
        key: string;
        index: number;
        onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
    };
    formData: Record<string, string>;
    user?: User
}

const options = ["text", "number", "date", "time", "email"]

export const InputBasic = ({formData, data, user}: PropsInputBasic) => {
    const [isUnlimited, setIsUnlimited] = useState(formData[data.key] === "-1");
    let valueFormatted: string | {id: number, name: string} = "";

    const getValueFormatted = (user: User, value: string | {id: number, key: string}, key: string): string | {id: number, name: string} => {
        if(typeof value != "object"){
            return value
        }

        const keyData = user[key as keyof User];
        const valueFormatted = keyData?.find((d: { id: number }) => d.id == Number(value.id)) as { id: number, name: string }

        if(!valueFormatted){
            return ""
        }

        return valueFormatted
    }

    if(user){
        const keyFormatted = data.key == "formAssists" || data.key == "formInscriptions" ? "form" : data.key
        const valueInit = formData[data.key]

        valueFormatted = getValueFormatted(user, valueInit as string | {id: number, key: string}, keyFormatted)
    }

    if (options.includes(data.form.type)) {
        if (data.form.type === "number" && data.key === "cupos") {
            return(
                <>
                    <Label>{data.form.name}</Label>

                    <div className="grid grid-cols-4 gap-2 mt-2 w-full">
                        <Input
                            key={data.index}
                            type={isUnlimited ? "text" : "number"}
                            className="col-span-2 max-sm:col-span-4 w-full"
                            disabled={isUnlimited}
                            value={isUnlimited ? "Cupos ilimitados" : valueFormatted as string}
                            onChange={(e) => {
                                data.onChange(e);
                            }}
                        />

                        <Button 
                            variant="outline" 
                            size="icon"
                            type="button"
                            className="bg-primary text-white px-2 text-xs col-span-2 max-sm:col-span-4 text-center flex justify-center items-center w-full"
                            style={isUnlimited ? { backgroundColor: "var(--primary)", color: "white" } : { backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
                            onClick={() => {
                                setIsUnlimited(!isUnlimited);
                                data.onChange(isUnlimited ? "-1" : valueFormatted as string);
                            }}
                        >
                            Ilimitado
                        </Button>
                    </div>
                </>
            )
        }

        return(
            <>
                <Label>{data.form.name}</Label>
                <Input
                    key={data.index}
                    type={data.form.type}
                    value={valueFormatted as string}
                    onChange={data.onChange}
                    required={data.form.required}
                />
            </>
        )
    } else if (data.form.type === "password") {
        return (
            <InputPassword
                data={{
                    key: data.key,
                    value: formData[data.key] as string,
                    label: data.form.name,
                    onChange: data.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void,
                }}
            />
        )
    } else if(data.form.type == "selection"){
        return(
            <>
                <Label htmlFor="faculty">{data.form.name}</Label>
                <Select
                    key={data.index}
                    value={typeof valueFormatted == "object" ? valueFormatted.name + "_" + valueFormatted.id : valueFormatted}
                    onValueChange={data.onChange}
                    required={data.form.required}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={`Seleccione un/una ${data.form.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {data.form.options.length > 0 ? (
                            data.form.options.map((option, index) => (
                            <SelectItem key={index} value={`${option.value}${option.id ? '_' + option.id : ''}`}>
                                {option.label}
                            </SelectItem>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm p-2">No se encontraron opciones</p>
                        )}
                    </SelectContent>
                </Select>
            </>
        )
  }
}
