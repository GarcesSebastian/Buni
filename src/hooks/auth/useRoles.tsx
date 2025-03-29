import { useState } from 'react';
import { useNotification } from '@/components/ui/Notification';
import Cookies from 'js-cookie';

type PermissionKey = 
    | 'create_event' | 'edit_event' | 'delete_event' | 'view_event'
    | 'create_user' | 'edit_user' | 'delete_user' | 'view_user'
    | 'create_role' | 'edit_role' | 'delete_role' | 'view_role'
    | 'create_faculty' | 'edit_faculty' | 'delete_faculty' | 'view_faculty'
    | 'create_scenery' | 'edit_scenery' | 'delete_scenery' | 'view_scenery';

interface Role {
    id: number;
    name: string;
    permissions: {
        [key in PermissionKey]: boolean;
    };
    created_at: string;
}

interface UseRolesReturn {
    roles: Role[];
    loading: boolean;
    error: string | null;
    createRole: (name: string, permissions: Role['permissions']) => Promise<void>;
    updateRole: (id: number, name: string, permissions: Role['permissions']) => Promise<void>;
    deleteRole: (id: number) => Promise<void>;
    getRoles: () => Promise<void>;
}

export const useRoles = (): UseRolesReturn => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showNotification } = useNotification();

    const getRoles = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    throw new Error('Token inválido');
                }
                throw new Error('Error al obtener los roles');
            }

            const data = await response.json();
            setRoles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            showNotification({
                title: 'Error',
                message: err instanceof Error ? err.message : 'Error desconocido',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const createRole = async (name: string, permissions: Role['permissions']) => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, permissions }),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    throw new Error('Token inválido');
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear el rol');
            }

            const newRole = await response.json();
            setRoles(prev => [...prev, newRole]);
            showNotification({
                title: 'Success',
                message: 'Rol creado exitosamente',
                type: 'success'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            showNotification({
                title: 'Error',
                message: 'Error al crear el rol',
                type: 'error'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateRole = async (id: number, name: string, permissions: Role['permissions']) => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, permissions }),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    throw new Error('Token inválido');
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el rol');
            }

            const updatedRole = await response.json();
            setRoles(prev => prev.map(role => 
                role.id === id ? updatedRole : role
            ));
            showNotification({
                title: 'Success',
                message: 'Rol actualizado exitosamente',
                type: 'success'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            showNotification({
                title: 'Error',
                message: 'Error al actualizar el rol',
                type: 'error'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteRole = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    throw new Error('Token inválido');
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar el rol');
            }

            setRoles(prev => prev.filter(role => role.id !== id));
            showNotification({
                title: 'Success',
                message: 'Rol eliminado exitosamente',
                type: 'success'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            showNotification({
                title: 'Error',
                message: 'Error al eliminar el rol',
                type: 'error'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        roles,
        loading,
        error,
        createRole,
        updateRole,
        deleteRole,
        getRoles
    };
}; 