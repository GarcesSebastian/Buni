import { Role } from "@/types/User";
import { useState } from "react";
import { apiFetch, type Envelope } from "@/lib/api/client";

const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);

    const getRoles = async () => {
        const data = await apiFetch<Array<{ id: string, name: string, permissions: Record<string, boolean>, state: string }>>("/roles");

        const rolesFiltered = data.map((role) => ({
            id: role.id,
            name: role.name,
            permissions: role.permissions,
            state: "true"
        }));

        setRoles(rolesFiltered as unknown as Role[]);
        return rolesFiltered;
    }

    const createRole = async (role: Role) => {
        const data_response = await apiFetch<Envelope<Role>>("/roles", {
            method: "POST",
            body: JSON.stringify(role),
        });

        const payload = {
            ...data_response.data,
            state: "true"
        }

        setRoles(prevRoles => [...prevRoles, payload]);
        return payload;
    }

    const updateRole = async (role: Role) => {
        const data = await apiFetch<Role[]>(`/roles/${role.id}`, {
            method: "PUT",
            body: JSON.stringify(role),
        });

        setRoles(data);
        return data;
    }

    const deleteRole = async (roleId: string) => {
        const data = await apiFetch<unknown>(`/roles/${roleId}`, {
            method: "DELETE",
        });
        return data;
    }

    return { roles, getRoles, createRole, updateRole, deleteRole };
}

export default useRoles;
