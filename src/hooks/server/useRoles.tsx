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

            const rolesFiltered = data.map((role: { id: number, name: string, permissions: Record<string, boolean>, state: string }) => ({
                id: role.id,
                name: role.name,
                permissions: role.permissions,
                state: "true"
            }));
        
            setRoles(rolesFiltered);
        } catch (error) {
            console.error(error);
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
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error(error);
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
            setRoles(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteRole = async (roleId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles/${roleId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { roles, getRoles, createRole, updateRole, deleteRole };
}

export default useRoles;