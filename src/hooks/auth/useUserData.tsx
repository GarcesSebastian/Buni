"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Programs } from "@/types/Programs";
import { Role, User as UserType } from "@/types/User";
import { useDataSync } from "./useDataSync";
import { useUserState } from "./useUserState";
import { useUserSettings } from "./useUserSettings";
import { useAuth } from "./useAuth";


export interface User {
    events: Event[];
    programs: Programs[];
    scenery: Scenery[];
    forms: Form[];
    users: UserType[];
    roles: Role[];
}

export interface Views {
    events: boolean;
    programs: boolean;
    scenery: boolean;
    forms: boolean;
    users: boolean;
    roles: boolean;
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
    updateEvent: (eventId: string, updatedEvent: Event) => void;
    states: States;
    setStates: (data: States) => void;
    isLoaded: boolean;
    setIsLoaded: (data: boolean) => void;
    fetchAllData: () => Promise<void>;
    views: Views;
    setViews: (data: Views) => void;
} | null>(null);

const viewsDefault = {
    events: true,
    programs: true,
    scenery: true,
    forms: true,
    users: true,
    roles: true,
}

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const { states, setStates } = useUserSettings();
    const { isLoaded, setIsLoaded } = useUserState();
    const { user, setUser, updateEvent, fetchAllData } = useDataSync();
    const { user: authUser, isAuthenticated, isLoading } = useAuth();
    const [views, setViews] = useState<Views>(viewsDefault);

    useEffect(() => {
        const initializeData = async () => {
            if (isAuthenticated) {
                setIsLoaded(false);
                await fetchAllData();
                setIsLoaded(true);
            }
        };

        initializeData();
    }, [isAuthenticated]);

    useEffect(() => {
        if(isLoading){
            return;
        }

        if(authUser?.permissions && typeof authUser.permissions === "object"){
            Object.entries(viewsDefault).forEach(([key]) => {
                const isView = (authUser.permissions as Record<string, { view: boolean }>)[key]?.view ?? false;
                setViews((prev) => ({...prev, [key]: isView}));
            });
        }

        if(authUser?.permissions === "***"){
            setViews(viewsDefault);
        }
    }, [authUser])

    return (
        <UserDataContext.Provider value={{ 
            user, 
            setUser, 
            updateEvent, 
            states, 
            setStates, 
            isLoaded, 
            setIsLoaded,
            fetchAllData,
            views,
            setViews
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