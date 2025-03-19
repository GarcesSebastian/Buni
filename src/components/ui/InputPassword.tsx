import { useState } from "react"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Eye, EyeOff, Zap } from "lucide-react"

interface PropsInputBasic {
    data: {
        key: string;
        value: string;
        label: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }
}

export const InputPassword = ({ data }: PropsInputBasic) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const togglePassword = () => {
        setShowPassword(!showPassword);
    }
    
    const generatePassword = () => {

        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
        
        const allChars = lowercase + uppercase + numbers + symbols;
        
        const length = Math.floor(Math.random() * 3) + 10; // 10, 11 o 12
        
        let password = '';
        
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        for (let i = 4; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        const event = {
            target: { value: password }
        } as React.ChangeEvent<HTMLInputElement>;

        data.onChange(event);

        setShowPassword(true);
    }
    
    return (
        <>
          <Label>{data.label}</Label>
          <div className="relative flex items-center">
            <div className="w-full">
                <Input
                    key={data.key}
                    type={showPassword ? "text" : "password"}
                    value={data.value}
                    onChange={data.onChange}
                    required
                    className="pr-20" 
                />
            </div>
            <div className="absolute right-0 w-fit flex">
                <Button
                    onClick={togglePassword}
                    type="button"
                    className="flex items-center justify-center"
                    variant="ghost"
                    size="icon"
                    title="Mostrar/ocultar contraseña"
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </Button>

                <Button
                    onClick={generatePassword}
                    type="button"
                    className="flex items-center justify-center"
                    variant="ghost"
                    size="icon"
                    title="Generar contraseña aleatoria"
                >
                    <Zap />
                </Button>
            </div>
          </div>
        </>
    );
}
