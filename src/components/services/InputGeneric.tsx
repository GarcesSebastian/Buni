import { InputPassword } from "@/components/ui/InputPassword"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { User } from "@/hooks/useUserData";
import { Form } from "@/types/Forms";

interface PropsInputBasic {
    data: {
        form: {
        name: string;
        options: { value: string; label: string; id?: number }[];
        type: "text" | "number" | "date" | "time" | "selection" | "password";
        };
        key: string;
        index: number;
        onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
    };
    formData: Record<string, string>;
    user?: User
}

const options = ["text", "number", "date", "time"]

export const InputBasic = ({formData, data, user}: PropsInputBasic) => {
    let valueFormatted: string | { id: number; nombre: string; };
    
    if(user){
        const valueInit = formData[data.key.toLowerCase()]
        const userData = user[data.key as keyof User] as (Form | { id: number; nombre: string })[];
        valueFormatted = typeof valueInit == "object" ? userData?.find((d: { id: number }) => d.id == Number((valueInit as { data: { id: string} }).data.id)) : valueInit
    }

    if (options.includes(data.form.type)) {
        return(
        <>
            <Label>{data.form.name}</Label>
            <Input
            key={data.index}
            type={data.form.type}
            value={valueFormatted as string}
            onChange={data.onChange}
            required
            />
        </>
        )
    } else if (data.form.type === "password") {
        return (
            <InputPassword
            data={{
                key: data.key,
                value: formData[data.key.toLowerCase()] || "",
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
            value={typeof valueFormatted == "object" ? valueFormatted.nombre + "_" + valueFormatted.id : valueFormatted}
            onValueChange={data.onChange}
            required
        >
            <SelectTrigger>
            <SelectValue placeholder={`Seleccione una ${data.form.name.toLowerCase()}`} />
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
