"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";
import { User as UserType } from "@/types/User"; 

export interface User {
    events: Event[];
    faculty: Faculty[];
    scenery: Scenery[];
    form: Form[];
    users: UserType[];
    roles: {
        id: number;
        name: string;
        permissions: {
            [key: string]: boolean;
        };
        created_at: string;
    }[];
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
} | null>(null);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const [states, setStates] = useState<States>({});
    const [user, setUserState] = useState<User>({
        events: [{
            "nombre": "Induccion Universidad del Sinu",
            "organizador": "Universidad del Sinu",
            "cupos": -1,
            "hora": "06:30",
            "fecha": "2025-03-07",
            "faculty": {
                "value": "Ingenieria_1",
                "data": {
                    "nombre": "Ingenieria",
                    "state": "true",
                    "id": 1
                }
            },
            "scenery": {
                "value": "Auditorio Santillana_1",
                "data": {
                    "id": 1,
                    "nombre": "Auditorio Santillana",
                    "state": "true"
                }
            },
            "formAssists": {
                "value": "form_1",
                "data": {
                    "id": 1,
                    "nombre": "Formulario de Asistencia",
                    "descripcion": "Formulario para registrar asistencia",
                    "campos": [
                        {
                            "id": "nombre_1743070812197",
                            "nombre": "Nombre",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "apellido_1743070812197",
                            "nombre": "Apellido",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "email_1743070812197",
                            "nombre": "Email",
                            "tipo": "email",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "carrera_1743070812197",
                            "nombre": "Carrera",
                            "tipo": "texto",
                            "requerido": false,
                            "seccion": "academica"
                        },
                        {
                            "id": "semestre_1743070812197",
                            "nombre": "Semestre",
                            "tipo": "seleccion",
                            "requerido": false,
                            "seccion": "academica",
                            "opciones": [
                                "I",
                                "II",
                                "III",
                                "IV",
                                "V",
                                "VI",
                                "VII",
                                "VIII",
                                "IX",
                                "X"
                            ]
                        },
                        {
                            "id": "valoracion_del_evento_1743070837876",
                            "nombre": "Valoracion del Evento",
                            "tipo": "seleccion",
                            "requerido": false,
                            "seccion": "adicional",
                            "opciones": [
                                "Bueno",
                                " Buenisimo",
                                " Super"
                            ]
                        }
                    ],
                    "state": true
                }
            },
            "formInscriptions": {
                "value": "form_2",
                "data": {
                    "id": 2,
                    "nombre": "Formulario de Inscripcion",
                    "descripcion": "Formulario para registrar inscripcion",
                    "campos": [
                        {
                            "id": "nombre_1743070812197",
                            "nombre": "Nombre",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "apellido_1743070812197",
                            "nombre": "Apellido",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "email_1743070812197",
                            "nombre": "Email",
                            "tipo": "email",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "carrera_1743070812197",
                            "nombre": "Carrera",
                            "tipo": "texto",
                            "requerido": false,
                            "seccion": "academica"
                        },
                        {
                            "id": "semestre_1743070812197",
                            "nombre": "Semestre",
                            "tipo": "seleccion",
                            "requerido": false,
                            "seccion": "academica",
                            "opciones": [
                                "I",
                                "II",
                                "III",
                                "IV",
                                "V",
                                "VI",
                                "VII",
                                "VIII",
                                "IX",
                                "X"
                            ]
                        },
                        {
                            "id": "valoracion_del_evento_1743070837876",
                            "nombre": "Valoracion del Evento",
                            "tipo": "seleccion",
                            "requerido": false,
                            "seccion": "adicional",
                            "opciones": [
                                "Bueno",
                                " Buenisimo",
                                " Super"
                            ]
                        }
                    ],
                    "state": true
                }
            },
            "assists": [],
            "inscriptions": [],
            "state": "true",
            "id": 1
        }],
        faculty: [],
        scenery: [],
        form: [],
        users: [],
        roles: []
    });

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
        Cookies.set("events", JSON.stringify(user.events), { expires: 7 });
        Cookies.set("faculty", JSON.stringify(user.faculty), { expires: 7 });
        Cookies.set("scenery", JSON.stringify(user.scenery), { expires: 7 });
        Cookies.set("form", JSON.stringify(user.form), { expires: 7 });
        Cookies.set("users", JSON.stringify(user.users), { expires: 7 });
        Cookies.set("roles", JSON.stringify(user.roles), { expires: 7 });
    }, [user]);
    
    return (
        <UserDataContext.Provider value={{ user, setUser, updateEvent, states, setStates }}>
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
} => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error("useUserData debe estar dentro de un UserDataProvider");
    }
    return context;
};

