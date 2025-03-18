"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";

export interface User {
    events?: Event | [];
    faculty: Faculty[];
    scenery: Scenery[];
    form: Form[];
}

const UserDataContext = createContext<{
    user: User;
    setUser: (data: User) => void;
} | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User>({
        events: [],
        faculty: [],
        scenery: [],
        form: [],
    });

    const setUser = (data: User) => {
        Cookies.set("events", JSON.stringify(data.events), { expires: 7 });
        setUserState(data);
    };

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = (): { user: User; setUser: (data: User) => void } => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData debe estar dentro de un UserDataProvider");
    }
    return context;
};
