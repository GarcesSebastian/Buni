import { User } from "@/types/User";
import { useState } from "react";
import Cookies from "js-cookie";

const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    const getUsers = async () => {  
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                setUsers([]);
                return;
            }

            const usersFiltered = data.map((user: { id: string, name: string, email: string, password: string, role_id: string, created_at: string }) => ({
                ...user,
                roles: {
                    id: user.role_id,
                    key: "roles"
                },
            }));

            setUsers(usersFiltered);
        } catch (error) {
            console.error(error);
            setUsers([]);
        }
    }

    const createUser = async (user: User) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();

            if (response.ok) {  
                setUsers(data);
                return data;
            }

            throw new Error(data.error || 'Error al crear el usuario');
        } catch (error) {
            throw error;
        }
    }

    const updateUser = async (user: User) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteUser = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
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

    return { users, getUsers, createUser, updateUser, deleteUser };
}

export default useUsers;