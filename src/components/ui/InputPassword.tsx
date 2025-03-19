import { useRef, useState } from "react"
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
    
    // Función para generar una contraseña aleatoria segura
    const generatePassword = () => {
        // Caracteres posibles para la contraseña
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
        
        // Combinar todos los caracteres
        const allChars = lowercase + uppercase + numbers + symbols;
        
        // Longitud de la contraseña (entre 10-12 caracteres)
        const length = Math.floor(Math.random() * 3) + 10; // 10, 11 o 12
        
        let password = '';
        
        // Asegurar que haya al menos uno de cada tipo
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        // Llenar el resto con caracteres aleatorios
        for (let i = 4; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        // Mezclar los caracteres (usando el algoritmo Fisher-Yates para barajar)
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        // Crear un evento simulado para cambiar el valor
        const event = {
            target: { value: password }
        } as React.ChangeEvent<HTMLInputElement>;
        
        // Llamar al onChange proporcionado en data para actualizar el valor
        data.onChange(event);
        
        // Mostrar la contraseña generada
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
