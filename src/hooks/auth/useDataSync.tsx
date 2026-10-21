"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types/Events";
import { User } from "./useUserData";
import { TemplateData } from "@/config/TemplateData";
import { useAuth } from "./useAuth";
import { apiFetch } from "@/lib/api/client";


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
            const raw = await apiFetch<
                Omit<User, "users" | "roles"> & {
                    users: { id: string, name: string, email: string, password: string, role_id: string, created_at: string }[],
                    roles: { id: string, name: string, permissions: Record<string, boolean>, state: string }[],
                }
            >("/users/data");

            const data: User = {
                ...raw,
                users: raw.users.map((user) => ({
                    ...user,
                    roles: {
                        id: user.role_id,
                        key: "roles"
                    }
                })),
                roles: raw.roles.map((role) => ({
                    ...role,
                    state: "true"
                })),
            } as unknown as User;

            setUserState(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setUserState(TemplateData);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [isAuthenticated]);

    return { user, setUser, updateEvent, fetchAllData };
}; 
