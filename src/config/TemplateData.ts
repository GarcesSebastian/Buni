import { User } from "@/hooks/auth/useUserData";

export const TemplateData: User = {
    events: [],
    faculty: [],
    scenery: [],
    forms: [{
        "id": 1742291990002,
        "name": "Formulario de Inscripcion",
        "description": "Por favor ingrese los datos correctamente",
        "fields": [
            {
                "id": "nombre_1742294172313",
                "name": "Nombre",
                "type": "text",
                "required": true,
                "section": "personal"
            },
            {
                "id": "correo_electronico_1742294180033",
                "name": "Correo Electronico",
                "type": "email",
                "required": true,
                "section": "personal"
            },
            {
                "id": "numero_telefonico_1742294190390",
                "name": "Numero Telefonico",
                "type": "number",
                "required": true,
                "section": "personal"
            },
            {
                "id": "fecha_nacimiento_1742294209768",
                "name": "Fecha de Nacimiento",
                "type": "date",
                "required": true,
                "section": "personal"
            },
            {
                "id": "codigo_estudiantil_1742294260490",
                "name": "Código Estudiantil",
                "type": "number",
                "required": true,
                "section": "academic"
            },
            {
                "id": "semestre_1742294281482",
                "name": "Semestre",
                "type": "select",
                "required": true,
                "section": "academic",
                "options": [
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
                "name": "Programa",
                "type": "select",
                "required": true,
                "section": "academic",
                "options": [
                    "Ingenieria",
                    "Gastronomia",
                    "Psicologia"
                ]
            },
            {
                "id": "hora_clase_1742294300000",
                "name": "Hora de Clase",
                "type": "time",
                "required": true,
                "section": "academic"
            },
            {
                "id": "estrato_1742294310000",
                "name": "Estrato",
                "type": "select",
                "required": true,
                "section": "additional",
                "options": [
                    "Bajo",
                    "Medio",
                    "Alto"
                ]
            },
            {
                "id": "direccion_1742294320000",
                "name": "Direccion",
                "type": "text",
                "required": true,
                "section": "additional"
            },
            {
                "id": "acepta_terminos_1742294330000",
                "name": "Acepta Términos y Condiciones",
                "type": "checkbox",
                "required": true,
                "section": "additional"
            },
            {
                "id": "valoracion_1742294340000",
                "name": "Valoración del Evento",
                "type": "qualification",
                "required": true,
                "section": "additional",
                "maxQualification": 5,
                "qualificationIcon": "star"
            },
            {
                "id": "intereses_1742294350000",
                "name": "Intereses",
                "type": "checklist_multiple",
                "required": true,
                "section": "personal",
                "options": [
                    "Deportes",
                    "Arte",
                    "Música",
                    "Tecnología",
                    "Ciencia"
                ]
            },
            {
                "id": "idiomas_1742294360000",
                "name": "Idiomas que habla",
                "type": "checklist_single",
                "required": true,
                "section": "personal",
                "options": [
                    "Español",
                    "Inglés",
                    "Francés",
                    "Alemán",
                    "Portugués"
                ]
            },
            {
                "id": "habilidades_1742294370000",
                "name": "Habilidades",
                "type": "checklist_single_grid",
                "required": true,
                "section": "academic",
                "options": [
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
                "name": "Cursos realizados",
                "type": "checklist_multiple_grid",
                "required": true,
                "section": "academic",
                "options": [
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
        "name": "Formulario de Asistencia",
        "description": "Diligenciar este formulario para la asistencia al evento",
        "fields": [
            {
                "id": "nombre_1743070756636",
                "name": "Nombre",
                "type": "text",
                "required": true,
                "section": "personal"
            },
            {
                "id": "correo_electronico_1743070781306",
                "name": "Correo Electronico",
                "type": "email",
                "required": true,
                "section": "personal"
            },
            {
                "id": "codigo_estudiantil_1743070800404",
                "name": "Codigo Estudiantil",
                "type": "number",
                "required": true,
                "section": "academic"
            },
            {
                "id": "semestre_1743070812197",
                "name": "Semestre",
                "type": "select",
                "required": true,
                "section": "academic",
                "options": [
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
                "name": "Valoracion del Evento",
                "type": "qualification",
                "required": true,
                "section": "additional",
                "maxQualification": 5,
                "qualificationIcon": "star"
            }
        ],
        "state": true
    }],
    users: [],
    roles: []
}
