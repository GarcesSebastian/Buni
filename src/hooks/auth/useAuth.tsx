"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type PermissionKey = 
    | 'create_event' | 'edit_event' | 'delete_event' | 'view_event'
    | 'create_user' | 'edit_user' | 'delete_user' | 'view_user'
    | 'create_role' | 'edit_role' | 'delete_role' | 'view_role'
    | 'create_faculty' | 'edit_faculty' | 'delete_faculty' | 'view_faculty'
    | 'create_scenery' | 'edit_scenery' | 'delete_scenery' | 'view_scenery';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: Record<PermissionKey, boolean>;
    created_at: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true
    });
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            const token = Cookies.get('token');
            
            if (!token) {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                });

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

            setAuthState({
                user: data.user as User,
                isAuthenticated: true,
                isLoading: false
            });
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

            setAuthState({
                user: data.user as User,
                isAuthenticated: true,
                isLoading: false
            });

            router.push('/dashboard');
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('events');
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
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