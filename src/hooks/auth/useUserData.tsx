"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";
import { Role, User as UserType } from "@/types/User";
import useRoles from "../server/useRoles";
import useUsers from "../server/useUsers";
import useEvents from "../server/useEvents";
import useScenery from "../server/useScenery";
import useFaculty from "../server/useFaculty";
import usePermissions from "../server/usePermissions";
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

export interface States {
    sidebarExpanded?: boolean;
    sidebarOpenItems?: string[];
    isDeviceMobile?: boolean;
    userToggled?: boolean;
}

const UserDataContext = createContext<{
    user: User;
    setUser: (data: User) => void;
    updateEvent: (eventId: number, updatedEvent: Event) => void;
    states: States,
    setStates: (data: States) => void;
    isLoaded: boolean;
    setIsLoaded: (data: boolean) => void;
} | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const [states, setStates] = useState<States>({});
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [user, setUserState] = useState<User>(TemplateData);
    const { roles, getRoles } = useRoles();
    const { users, getUsers } = useUsers();
    const { events, getEvents } = useEvents();
    const { scenery, getScenery } = useScenery();
    const { faculty, getFaculty } = useFaculty();
    const { isAuthenticated } = useAuth();
    const { permissions, isSuperAdmin, hasPermission } = usePermissions();

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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoaded(false);
            try {
                await getRoles();
                await getUsers();
                await getEvents();
                await getScenery();
                await getFaculty();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        console.log("isAuthenticated", isAuthenticated);

        if (isAuthenticated) {
            fetchData();
        } else {
            setUser(TemplateData);
            setIsLoaded(true);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isSuperAdmin) {
            // console.log("YOU ARE SUPER ADMIN");
        }

        if (permissions) {
            const canCreateEvents = hasPermission("events", "create");

            if (canCreateEvents) {
                // console.log("YOU HAVE PERMISSION TO CREATE EVENTS");
            }
        }
    }, [isSuperAdmin, permissions]);

    useEffect(() => {
        if (roles.length > 0) {
            setUserState(prevUser => ({ ...prevUser, roles: roles }));
        }

        if (users.length > 0) {
            setUserState(prevUser => ({ ...prevUser, users: users }));
        }

        if (events.length > 0) {
            setUserState(prevUser => ({ ...prevUser, events: events }));
        }

        if (scenery.length > 0) {
            setUserState(prevUser => ({ ...prevUser, scenery: scenery }));
        }

        if (faculty.length > 0) {
            setUserState(prevUser => ({ ...prevUser, faculty: faculty }));
        }

    }, [roles, users, events, scenery, faculty]);

    useEffect(() => {
        Cookies.set("events", JSON.stringify(user.events), { expires: 7 });
        Cookies.set("faculty", JSON.stringify(user.faculty), { expires: 7 });
        Cookies.set("scenery", JSON.stringify(user.scenery), { expires: 7 });
        Cookies.set("form", JSON.stringify(user.form), { expires: 7 });
        Cookies.set("users", JSON.stringify(user.users), { expires: 7 });
        Cookies.set("roles", JSON.stringify(user.roles), { expires: 7 });

        console.log("Datos del usuario actualizados:", user);
    }, [user]);
    
    return (
        <UserDataContext.Provider value={{ user, setUser, updateEvent, states, setStates, isLoaded, setIsLoaded }}>
            {children}
        </UserDataContext.Provider> 
    );
};

export const useUserData = (): { 
    user: User; 
    setUser: (data: User) => void;
    updateEvent: (eventId: number, updatedEvent: Event) => void;
    states: States;
    setStates: (data: States) => void;
    isLoaded: boolean;
    setIsLoaded: (data: boolean) => void;
} => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData debe estar dentro de un UserDataProvider");
    }

    return context;
};