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
    const test = 1;
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
                "value": "Formulario de Asistencia_1743070732515",
                "data": {
                    "id": 1743070732515,
                    "nombre": "Formulario de Asistencia",
                    "descripcion": "Diligenciar este formulario para la asistencia al evento",
                    "campos": [
                        {
                            "id": "nombre_1743070756636",
                            "nombre": "Nombre",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "apellido_1743070766625",
                            "nombre": "Apellido",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "correo_electronico_1743070781306",
                            "nombre": "Correo Electronico",
                            "tipo": "email",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "codigo_estudiantil_1743070800404",
                            "nombre": "Codigo Estudiantil",
                            "tipo": "numero",
                            "requerido": true,
                            "seccion": "academica"
                        },
                        {
                            "id": "semestre_1743070812197",
                            "nombre": "Semestre",
                            "tipo": "seleccion",
                            "requerido": true,
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
                            "requerido": true,
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
                "value": "Formulario de Inscripcion_1742291990002",
                "data": {
                    "id": 1742291990002,
                    "nombre": "Formulario de Inscripcion",
                    "descripcion": "Por favor ingrese los datos correctamente",
                    "campos": [
                        {
                            "id": "nombre_1742294172313",
                            "nombre": "Nombre",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "correo_electronico_1742294180033",
                            "nombre": "Correo Electronico",
                            "tipo": "email",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "numero_telefonico_1742294190390",
                            "nombre": "Numero Telefonico",
                            "tipo": "numero",
                            "requerido": true,
                            "seccion": "personal"
                        },
                        {
                            "id": "semestre_1742294209768",
                            "nombre": "Semestre",
                            "tipo": "seleccion",
                            "requerido": true,
                            "seccion": "personal",
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
                            "id": "facultad_1742294260490",
                            "nombre": "Facultad",
                            "tipo": "seleccion",
                            "requerido": true,
                            "seccion": "personal",
                            "opciones": [
                                "Ingenieria",
                                " Gastronomia",
                                " Psicologia"
                            ]
                        },
                        {
                            "id": "estrato_1742294281482",
                            "nombre": "Estrato",
                            "tipo": "seleccion",
                            "requerido": true,
                            "seccion": "adicional",
                            "opciones": [
                                "Bajo",
                                " Medio",
                                " Alto"
                            ]
                        },
                        {
                            "id": "direccion_1742294297671",
                            "nombre": "Direccion",
                            "tipo": "texto",
                            "requerido": true,
                            "seccion": "adicional"
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
        faculty: [{
            "nombre": "Ingenieria",
            "state": "true",
            "id": 1
        }],
        scenery: [{
            "id": 1,
            "nombre": "Auditorio Santillana",
            "state": "true"
        }],
        form: [{
            "id": 1742291990002,
            "nombre": "Formulario de Inscripcion",
            "descripcion": "Por favor ingrese los datos correctamente",
            "campos": [
                {
                    "id": "nombre_1742294172313",
                    "nombre": "Nombre",
                    "tipo": "texto",
                    "requerido": true,
                    "seccion": "personal"
                },
                {
                    "id": "correo_electronico_1742294180033",
                    "nombre": "Correo Electronico",
                    "tipo": "email",
                    "requerido": true,
                    "seccion": "personal"
                },
                {
                    "id": "numero_telefonico_1742294190390",
                    "nombre": "Numero Telefonico",
                    "tipo": "numero",
                    "requerido": true,
                    "seccion": "personal"
                },
                {
                    "id": "semestre_1742294209768",
                    "nombre": "Semestre",
                    "tipo": "seleccion",
                    "requerido": true,
                    "seccion": "personal",
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
                    "id": "facultad_1742294260490",
                    "nombre": "Facultad",
                    "tipo": "seleccion",
                    "requerido": true,
                    "seccion": "personal",
                    "opciones": [
                        "Ingenieria",
                        " Gastronomia",
                        " Psicologia"
                    ]
                },
                {
                    "id": "estrato_1742294281482",
                    "nombre": "Estrato",
                    "tipo": "seleccion",
                    "requerido": true,
                    "seccion": "adicional",
                    "opciones": [
                        "Bajo",
                        " Medio",
                        " Alto"
                    ]
                },
                {
                    "id": "direccion_1742294297671",
                    "nombre": "Direccion",
                    "tipo": "texto",
                    "requerido": true,
                    "seccion": "adicional"
                }
            ],
            "state": true
        },
        {
                "id": 1743070732515,
                "nombre": "Formulario de Asistencia",
                "descripcion": "Diligenciar este formulario para la asistencia al evento",
                "campos": [
                    {
                        "id": "nombre_1743070756636",
                        "nombre": "Nombre",
                        "tipo": "texto",
                        "requerido": true,
                        "seccion": "personal"
                    },
                    {
                        "id": "apellido_1743070766625",
                        "nombre": "Apellido",
                        "tipo": "texto",
                        "requerido": true,
                        "seccion": "personal"
                    },
                    {
                        "id": "correo_electronico_1743070781306",
                        "nombre": "Correo Electronico",
                        "tipo": "email",
                        "requerido": true,
                        "seccion": "personal"
                    },
                    {
                        "id": "codigo_estudiantil_1743070800404",
                        "nombre": "Codigo Estudiantil",
                        "tipo": "numero",
                        "requerido": true,
                        "seccion": "academica"
                    },
                    {
                        "id": "semestre_1743070812197",
                        "nombre": "Semestre",
                        "tipo": "seleccion",
                        "requerido": true,
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
                        "requerido": true,
                        "seccion": "adicional",
                        "opciones": [
                            "Bueno",
                            " Buenisimo",
                            " Super"
                        ]
                    }
                ],
                "state": true
        }],
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

