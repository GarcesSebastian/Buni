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

            const usersFiltered = data.map((user: { id: number, name: string, email: string, password: string, role_id: number, created_at: string }) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                roles: {
                    id: user.role_id,
                    key: "roles"
                },
            }));

            setUsers(usersFiltered);
        } catch (error) {
            console.error(error);
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
            setUsers(data);
        } catch (error) {
            console.error(error);
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

    const deleteUser = async (userId: number) => {
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