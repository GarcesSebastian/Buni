"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Permissions } from '@/types/Permissions';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: Permissions | string;
    created_at: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    useEffect(() => {
        const verifyToken = async () => {
            const token = Cookies.get('token');
            
            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                setIsLoading(false);

                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                logout();
            }

            setUser(data.user as User);
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        verifyToken();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            Cookies.set('token', data.token, { expires: 1 });

            setUser(data.user as User);
            setIsAuthenticated(true);
            setIsLoading(false);

            router.push('/dashboard');
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        
        Cookies.remove('token');
        
        setTimeout(() => {
            router.push('/');
        }, 50);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, setUser, setIsAuthenticated, setIsLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
} 