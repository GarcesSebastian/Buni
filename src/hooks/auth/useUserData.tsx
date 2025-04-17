"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import type { Form } from "@/types/Forms";
import { Event, Scenery } from "@/types/Events";
import { Faculty } from "@/types/Faculty";
import { Role, User as UserType } from "@/types/User";
import useRoles from "../server/useRoles";
import useUsers from "../server/useUsers";
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
    const [user, setUserState] = useState<User>({
        events: [{
            "nombre": "Induccion Universidad del Sinu",
            "organizador": "Universidad del Sinu",
            "cupos": "-1",
            "hora": "06:30",
            "fecha": "2025-03-07",
            "faculty": {
                "id": 1,
                "key": "faculty",
            },
            "scenery": {
                "id": 1,
                "key": "scenery",
            },
            "formAssists": {
                "id": 1743070732515,
                "key": "form"
            },
            "formInscriptions": {
                "id": 1742291990002,
                "key": "form"
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
                    "id": "fecha_nacimiento_1742294209768",
                    "nombre": "Fecha de Nacimiento",
                    "tipo": "fecha",
                    "requerido": true,
                    "seccion": "personal"
                },
                {
                    "id": "codigo_estudiantil_1742294260490",
                    "nombre": "Código Estudiantil",
                    "tipo": "numero",
                    "requerido": true,
                    "seccion": "academica"
                },
                {
                    "id": "semestre_1742294281482",
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
                    "id": "facultad_1742294297671",
                    "nombre": "Programa",
                    "tipo": "seleccion",
                    "requerido": true,
                    "seccion": "academica",
                    "opciones": [
                        "Ingenieria",
                        "Gastronomia",
                        "Psicologia"
                    ]
                },
                {
                    "id": "hora_clase_1742294300000",
                    "nombre": "Hora de Clase",
                    "tipo": "hora",
                    "requerido": true,
                    "seccion": "academica"
                },
                {
                    "id": "estrato_1742294310000",
                    "nombre": "Estrato",
                    "tipo": "seleccion",
                    "requerido": true,
                    "seccion": "adicional",
                    "opciones": [
                        "Bajo",
                        "Medio",
                        "Alto"
                    ]
                },
                {
                    "id": "direccion_1742294320000",
                    "nombre": "Direccion",
                    "tipo": "texto",
                    "requerido": true,
                    "seccion": "adicional"
                },
                {
                    "id": "acepta_terminos_1742294330000",
                    "nombre": "Acepta Términos y Condiciones",
                    "tipo": "checkbox",
                    "requerido": true,
                    "seccion": "adicional"
                },
                {
                    "id": "valoracion_1742294340000",
                    "nombre": "Valoración del Evento",
                    "tipo": "qualification",
                    "requerido": true,
                    "seccion": "adicional",
                    "maxQualification": 5,
                    "qualificationIcon": "star"
                },
                {
                    "id": "intereses_1742294350000",
                    "nombre": "Intereses",
                    "tipo": "checklist_multiple",
                    "requerido": true,
                    "seccion": "personal",
                    "opciones": [
                        "Deportes",
                        "Arte",
                        "Música",
                        "Tecnología",
                        "Ciencia"
                    ]
                },
                {
                    "id": "idiomas_1742294360000",
                    "nombre": "Idiomas que habla",
                    "tipo": "checklist_unico",
                    "requerido": true,
                    "seccion": "personal",
                    "opciones": [
                        "Español",
                        "Inglés",
                        "Francés",
                        "Alemán",
                        "Portugués"
                    ]
                },
                {
                    "id": "habilidades_1742294370000",
                    "nombre": "Habilidades",
                    "tipo": "checklist_unico_grid",
                    "requerido": true,
                    "seccion": "academica",
                    "opciones": [
                        {
                            "row": "Programación",
                            "data": ["Básico", "Intermedio", "Avanzado"]
                        },
                        {
                            "row": "Diseño",
                            "data": ["Básico", "Intermedio", "Avanzado"]
                        },
                        {
                            "row": "Matemáticas",
                            "data": ["Básico", "Intermedio", "Avanzado"]
                        }
                    ]
                },
                {
                    "id": "cursos_1742294380000",
                    "nombre": "Cursos realizados",
                    "tipo": "checklist_multiple_grid",
                    "requerido": true,
                    "seccion": "academica",
                    "opciones": [
                        {
                            "row": "Programación",
                            "data": ["Python", "JavaScript", "Java", "C++"]
                        },
                        {
                            "row": "Diseño",
                            "data": ["Photoshop", "Illustrator", "Figma", "Canva"]
                        },
                        {
                            "row": "Idiomas",
                            "data": ["Inglés", "Francés", "Alemán", "Portugués"]
                        }
                    ]
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
                    "tipo": "qualification",
                    "requerido": true,
                    "seccion": "adicional",
                    "maxQualification": 5,
                    "qualificationIcon": "star"
                }
            ],
            "state": true
        }],
        users: [],
        roles: []
    });
    const { roles, getRoles } = useRoles();
    const { users, getUsers } = useUsers();
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
        const token = Cookies.get("token");
        if (!token) {
            setIsLoaded(true);
            return;
        }

        const fetchRoles = async () => {
            setIsLoaded(false);
            await getRoles();
            await getUsers();
            setIsLoaded(true);
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        if (roles.length > 0) {
            setUserState(prevUser => ({ ...prevUser, roles: roles }));
        }

        if (users.length > 0) {
            setUserState(prevUser => ({ ...prevUser, users: users }));
        }
    }, [roles, users]);

    useEffect(() => {
        Cookies.set("events", JSON.stringify(user.events), { expires: 7 });
        Cookies.set("faculty", JSON.stringify(user.faculty), { expires: 7 });
        Cookies.set("scenery", JSON.stringify(user.scenery), { expires: 7 });
        Cookies.set("form", JSON.stringify(user.form), { expires: 7 });
        Cookies.set("users", JSON.stringify(user.users), { expires: 7 });
        Cookies.set("roles", JSON.stringify(user.roles), { expires: 7 });
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