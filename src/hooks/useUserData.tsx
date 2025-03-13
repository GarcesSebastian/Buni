"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import type { Form } from "@/types/Forms";
interface User {
    events?: [];
    faculties?: [];
    scenerys?: [];
    loans?: [];
    users?: [];
    roles?: [];
    forms: Form[];
}

const UserDataContext = createContext<{
    user: User;
    setUser: (data: User) => void;
} | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        events: [],
        faculties: [],
        scenerys: [],
        loans: [],
        users: [],
        roles: [],
        forms: [],
    });

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
