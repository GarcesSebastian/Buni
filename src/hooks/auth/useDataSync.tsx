"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Event } from "@/types/Events";
import { User } from "./useUserData";
import { TemplateData } from "@/config/TemplateData";
import { useAuth } from "./useAuth";


export const useDataSync = () => {
    const [user, setUserState] = useState<User>(TemplateData);
    const { isAuthenticated } = useAuth();

    const setUser = (data: User) => {
        setUserState(data);
    };

    const updateEvent = (eventId: string, updatedEvent: Event) => {
        setUserState(prevUser => ({
            ...prevUser,
            events: prevUser.events.map(event => 
                event.id === eventId ? updatedEvent : event
            )
        }));
    };

    const fetchAllData = async () => {
        if (!isAuthenticated) {
            setUserState(TemplateData);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/data`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario');
            }

            const data = await response.json();

            data.users = data.users.map((user: { id: string, name: string, email: string, password: string, role_id: string, created_at: string }) => ({
                ...user,
                roles: {
                    id: user.role_id,
                    key: "roles"
                }
            }));

            data.roles = data.roles.map((role: { id: string, name: string, permissions: Record<string, boolean>, state: string }) => ({
                ...role,
                state: "true"
            }));

            setUserState(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setUserState(TemplateData);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            console.log("user fetched", user);
        }
    }, [user, isAuthenticated]);

    return { user, setUser, updateEvent, fetchAllData };
}; 