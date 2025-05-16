import { Permissions, PermissionModule } from "@/types/Permissions";

export const permissionsDefault: Permissions = {
    events: {
        create: false,
        edit: false,
        delete: false,
        view: false
    },
    users: {
        create: false,
        edit: false,
        delete: false,
        view: false
    },
    roles: {
        create: false,
        edit: false,
        delete: false,
        view: false
    },
    programs: {
        create: false,
        edit: false,
        delete: false,
        view: false
    },
    scenery: {
        create: false,
        edit: false,
        delete: false,
        view: false
    },
    forms: {
        create: false,
        edit: false,
        delete: false,
        view: false
    },
    // additional: {
    //     export: false,
    //     import: false
    // }
};

export const permissionModules: PermissionModule[] = [
    {
        id: 'events',
        name: 'Eventos',
        description: 'Gestión de eventos y actividades',
        actions: [{ id: 'create',  name: 'Crear' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Eliminar' }, { id: 'view', name: 'Ver' }]
    },
    {
        id: 'users',
        name: 'Usuarios',
        description: 'Gestión de usuarios del sistema',
        actions: [{ id: 'create',  name: 'Crear' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Eliminar' }, { id: 'view', name: 'Ver' }]
    },
    {
        id: 'roles',
        name: 'Roles',
        description: 'Gestión de roles y permisos',
        actions: [{ id: 'create',  name: 'Crear' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Eliminar' }, { id: 'view', name: 'Ver' }]
    },
    {
        id: 'programs',
        name: 'Programas',
        description: 'Gestión de programas académicos',
        actions: [{ id: 'create',  name: 'Crear' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Eliminar' }, { id: 'view', name: 'Ver' }]
    },
    {
        id: 'scenery',
        name: 'Escenarios',
        description: 'Gestión de escenarios y espacios',
        actions: [{ id: 'create',  name: 'Crear' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Eliminar' }, { id: 'view', name: 'Ver' }]
    },
    {
        id: 'forms',
        name: 'Formularios',
        description: 'Gestión de formularios',
        actions: [{ id: 'create',  name: 'Crear' }, { id: 'edit', name: 'Editar' }, { id: 'delete', name: 'Eliminar' }, { id: 'view', name: 'Ver' }]
    }
    // {
    //     id: 'additional',
    //     name: 'Adicional',
    //     description: 'Permisos adicionales',
    //     actions: [{ id: 'export', name: 'Exportar' }, { id: 'import', name: 'Importar' }]
    // }
];