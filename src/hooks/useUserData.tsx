"use client"

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
    events?: [];
    faculties?: [];
    scenerys?: [];
    loans?: [];
    users?: [];
    roles?: [];
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
    });

    return (
        <UserDataContext.Provider value={{ user, setUser }}>
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
