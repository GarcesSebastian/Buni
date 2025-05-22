"use client"

import { Button } from "@/components/ui/Button"
import { Dialog, DialogTitle, DialogHeader, DialogContent } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Check, Loader2 } from "lucide-react"
import { useState, useRef, ChangeEvent, KeyboardEvent, FormEvent, useEffect } from "react"
import Cookies from "js-cookie"
import { User } from "@/types/User"

interface Props {
    open: boolean
    eventToRecovery: User
    sendedCode: boolean
    setSendedCode: (value: boolean) => void
    onOpenChange: (value: boolean) => void
    onSubmit?: (code: string) => void
}

export const DialogRecovery = ({ open, eventToRecovery, sendedCode, setSendedCode, onOpenChange, onSubmit }: Props) => {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [isLoadingSend, setIsLoadingSend] = useState<boolean>(false);
    const [isLoadingVerify, setIsLoadingVerify] = useState<boolean>(false);
    const [isLoadingChange, setIsLoadingChange] = useState<boolean>(false);
    const [isVerify, setIsVerify] = useState<boolean>(false);
    const [isChange, setIsChange] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const focusFirstInput = () => {
        setTimeout(() => {
            if (inputsRef.current[0]) {
                inputsRef.current[0].focus();
            }
        }, 100);
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setCode(Array(6).fill(''));
            setError('');
            focusFirstInput();
        }
        onOpenChange(open);
    };

    const nextInput = (index: number) => {
        if (index >= 0 && index < 6 && inputsRef.current[index]) {
            inputsRef.current[index]?.focus();
        }
    };

    const handleCodeChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        
        const digit = value.slice(-1);
        
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);
        
        if (digit && index < 5) {
            nextInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
            const newCode = [...code];
            
            if (newCode[index]) {
                newCode[index] = '';
                setCode(newCode);
            } 
            else if (index > 0) {
                nextInput(index - 1);
            }
        }
        else if (event.key === "ArrowLeft" && index > 0) {
            nextInput(index - 1);
        }
        else if (event.key === "ArrowRight" && index < 5) {
            nextInput(index + 1);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (code.some(digit => !digit)) {
            setError('Por favor complete todos los dígitos del código');
            return;
        }
        
        const completeCode = code.join('');
        
        if (onSubmit) {
            setIsLoadingVerify(true);
            try {
                onSubmit(completeCode);
            } catch (error) {
                setError('Error al procesar el código. Inténtelo de nuevo.');
            } finally {
                setIsLoadingVerify(false);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (pastedDigits) {
            const newCode = [...code];
            for (let i = 0; i < pastedDigits.length; i++) {
                newCode[i] = pastedDigits[i];
            }
            setCode(newCode);
            
            const nextEmptyIndex = newCode.findIndex(digit => !digit);
            nextInput(nextEmptyIndex !== -1 ? nextEmptyIndex : 5);
        }
    };

    const handleSendCode = async () => {
        setIsLoadingSend(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${eventToRecovery.id}/verify-recovery`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify({
                    code: code.join('')
                })
            })

            const data_response = await response.json()

            if (!response.ok) {
                setError(data_response.error || "Error al verificar el código de recuperación")
                return
            }

            setSendedCode(true)
            setIsVerify(true)
        } catch (error) {
            setError('Error al procesar el código. Inténtelo de nuevo.');
        } finally {
            setIsLoadingSend(false)
        }
    }

    const handleChangePassword = async () => {
        if (password !== passwordConfirm) {
            setErrorPassword("Las contraseñas no coinciden");
            return;
        }

        if(password.trim() == "" || passwordConfirm.trim() == "") {
            setErrorPassword("La contraseña no puede estar vacía");
            return;
        }

        setIsLoadingChange(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${eventToRecovery.id}/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify({
                    password: password
                })
            })

            const data_response = await response.json()

            if (!response.ok) {
                setError(data_response.error || "Error al cambiar la contraseña")
                return
            }

            setIsChange(true)
            setIsLoadingChange(false)
        } catch (error) {
            setError('Error al procesar el código. Inténtelo de nuevo.');
        }
    }

    useEffect(() => {
        if (open) {
            focusFirstInput();
            setSendedCode(false);
        }
    }, [open]);

    return(
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Recuperar contraseña</DialogTitle>
                </DialogHeader>

                {isChange && (
                    <div className="flex flex-col gap-4 mt-4 justify-center items-center">
                        <Check className="h-12 w-12 text-primary" />
                        <Label className="text-sm text-muted-foreground">Contraseña cambiada exitosamente</Label>

                        <Button onClick={() => handleOpenChange(false)}>Cerrar</Button>
                    </div>
                )}

                {!sendedCode && (
                    <div className="flex flex-col gap-4 my-4 justify-center items-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <Label>Enviando código de recuperación</Label>
                    </div>
                )}

                {isLoadingVerify && (
                    <div className="flex flex-col gap-4 my-4 justify-center items-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <Label>Verificando código de recuperación</Label>
                    </div>
                )}

                {isLoadingChange && (
                    <div className="flex flex-col gap-4 my-4 justify-center items-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <Label>Cambiando contraseña</Label>
                    </div>
                )}

                {isVerify && !isLoadingChange && !isChange && (
                    <div className="flex flex-col gap-4 mt-4 justify-center items-center">
                        <Label className="text-sm text-muted-foreground">Por favor escriba su nueva contraseña</Label>

                        <Input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                        <Input type="password" placeholder="Confirmar contraseña" onChange={(e) => setPasswordConfirm(e.target.value)} />

                        {errorPassword && <Label className="text-red-500 text-sm">{errorPassword}</Label>}

                        <div className="flex flex-row gap-4 justify-center items-center">
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
                            <Button onClick={handleChangePassword}>Enviar</Button>
                        </div>
                    </div>
                )}

                {sendedCode && !isVerify && (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <Label>Ingrese el código de recuperación</Label>
                        </div>

                        <div className="flex flex-row gap-4 max-sm:gap-2 justify-center items-center my-4" onPaste={handlePaste}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Input 
                                key={i} 
                                ref={(refChild) => {inputsRef.current[i] = refChild}} 
                                onKeyDown={(e) => handleKeyDown(i, e)} 
                                className="w-full border-[#c8c8c8] max-w-12 text-center text-lg font-bold" 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={code[i] || ''} 
                                onChange={(e) => handleCodeChange(i, e)}
                                aria-label={`Dígito ${i+1} del código de recuperación`}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4 justify-center items-center">
                        <Label className="text-sm text-muted-foreground">Por favor verifique su correo electrónico <span className="font-bold">{eventToRecovery.email}</span> para obtener el código de recuperación.</Label>
                    </div>

                    <div className="flex flex-col gap-4 justify-center items-center mt-4">
                        <Button type="submit" onClick={handleSendCode} disabled={isLoadingSend}>
                            {isLoadingSend ? 'Procesando...' : 'Siguiente'}
                        </Button>
                    </div>
                </form>
            )}
            </DialogContent>
        </Dialog>
    )
}