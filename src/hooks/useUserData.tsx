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
            "nombre": "Induccion de Ingenieria, Gastronomia y Psicologia",
            "organizador": "Universidad del Sinu Seccional Cartagena",
            "cupos": -1,
            "hora": "05:39",
            "fecha": "2025-03-18",
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
                    "nombre": "Auditorio Santillana",
                    "state": "true",
                    "id": 1
                }
            },
            "form": {
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
                            "requerido": false,
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
                            "requerido": false,
                            "seccion": "adicional"
                        }
                    ],
                    "state": true
                }
            },
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
                    "requerido": false,
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
                    "requerido": false,
                    "seccion": "adicional"
                }
            ],
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
