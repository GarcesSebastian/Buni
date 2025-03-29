import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
    name: string;
    email: string;
    role: string;
    permissions?: any;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true
    });
    const router = useRouter();

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                setAuthState({ user, isAuthenticated: true, isLoading: false });
            } catch (error) {
                console.error('Error parsing user cookie:', error);
                logout();
            }
        } else {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
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
            Cookies.set('user', JSON.stringify(data.user), { expires: 1 });

            setAuthState({
                user: data.user,
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
        Cookies.remove('user');
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
        router.push('/');
    };

    return {
        ...authState,
        login,
        logout
    };
} 