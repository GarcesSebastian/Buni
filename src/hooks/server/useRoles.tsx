import { Role } from "@/types/User";
import { useState } from "react";
import Cookies from "js-cookie";

const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);

    const getRoles = async () => {  
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                const rolesFiltered = data.map((role: { id: string, name: string, permissions: Record<string, boolean>, state: string }) => ({
                    id: role.id,
                    name: role.name,
                    permissions: role.permissions,
                    state: "true"
                }));
        
                setRoles(rolesFiltered);
                return rolesFiltered;
            }

            throw new Error(data.error || 'Error al obtener los roles');
        } catch (error) {
            throw error;
        }
    }

    const createRole = async (role: Role) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(role)
            });
            const data_response = await response.json();

            const payload = {
                ...data_response.data,
                state: "true"
            }

            if (response.ok) {
                setRoles(prevRoles => [...prevRoles, payload]);
                return payload;
            }

            throw new Error(data_response.error || 'Error al crear el rol');
        } catch (error) {
            throw error;
        }
    }

    const updateRole = async (role: Role) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${role.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(role)
            });

            const data = await response.json();

            if (response.ok) {
                setRoles(data);
                return data;
            }

            throw new Error(data.error || 'Error al editar el rol');
        } catch (error) {
            throw error;
        }
    }

    const deleteRole = async (roleId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${roleId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                return data;
            }

            throw new Error(data.error || 'Error al eliminar el rol');
        } catch (error) {
            throw error;
        }
    }

    return { roles, getRoles, createRole, updateRole, deleteRole };
}

export default useRoles;