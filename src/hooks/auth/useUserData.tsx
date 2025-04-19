"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";
import { Role, User as UserType } from "@/types/User";
import { useDataSync } from "./useDataSync";
import { useUserState } from "./useUserState";
import { useUserSettings } from "./useUserSettings";
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
    states: States;
    setStates: (data: States) => void;
    isLoaded: boolean;
    setIsLoaded: (data: boolean) => void;
    fetchAllData: () => Promise<void>;
} | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const { states, setStates } = useUserSettings();
    const { isLoaded, setIsLoaded } = useUserState();
    const { user, setUser, updateEvent, fetchAllData } = useDataSync();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const initializeData = async () => {
            if (!isAuthenticated) {
                setUser(TemplateData);
                setIsLoaded(true);
            } else {
                setIsLoaded(false);
                await fetchAllData();
                setIsLoaded(true);
            }
        };

        initializeData();
    }, [isAuthenticated]);

    return (
        <UserDataContext.Provider value={{ 
            user, 
            setUser, 
            updateEvent, 
            states, 
            setStates, 
            isLoaded, 
            setIsLoaded,
            fetchAllData
        }}>
            {children}
        </UserDataContext.Provider> 
    );
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData debe estar dentro de un UserDataProvider");
    }
    return context;
};