"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";

export interface User {
    events?: Event[];
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
        events: [{
            "nombre": "da",
            "organizador": "de",
            "cupos": 2,
            "hora": "05:03",
            "fecha": "2025-02-27",
            "faculty": {
                "value": "da_1",
                "data": {
                    "nombre": "da",
                    "state": "true",
                    "id": 1
                }
            },
            "scenery": {
                "value": "DA_1",
                "data": {
                    "nombre": "DA",
                    "state": "true",
                    "id": 1
                }
            },
            "form": {
                "value": "Nuevo Formulario_1742291990002",
                "data": {
                    "id": 1742291990002,
                    "nombre": "Nuevo Formulario",
                    "descripcion": "Descripción del formulario",
                    "campos": [],
                    "state": true
                }
            },
            "state": "true",
            "id": 1
        }],
        faculty: [{
            "nombre": "da",
            "state": "true",
            "id": 1
        }],
        scenery: [{
            "nombre": "DA",
            "state": "true",
            "id": 1
        }],
        form: [{
            "id": 1742291990002,
            "nombre": "Nuevo Formulario",
            "descripcion": "Descripción del formulario",
            "campos": [],
            "state": true
        }],
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
