"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";
import { Role, User as UserType } from "@/types/User";
import { TemplateData } from "@/config/TemplateData";
import { useAuth } from "./useAuth";

export interface User {
    events: Event[];
    faculty: Faculty[];
    scenery: Scenery[];
    form: Form[];
    users: UserType[];
    roles: Role[];
}

export const useDataSync = () => {
    const [user, setUserState] = useState<User>(TemplateData);
    const { isAuthenticated } = useAuth();

    const setUser = (data: User) => {
        setUserState(data);
    };

    const updateEvent = (eventId: number, updatedEvent: Event) => {
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
            data.form = TemplateData.form;
            setUserState(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setUserState(TemplateData);
        }
    };

    useEffect(() => {
        console.log("fetching data", isAuthenticated);
        fetchAllData();
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            console.log("user fetched", user);
        }
    }, [user, isAuthenticated]);

    return { user, setUser, updateEvent, fetchAllData };
}; 