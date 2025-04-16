export type PermissionAction = 'create' | 'edit' | 'delete' | 'view';

export interface PermissionModule {
    id: string;
    name: string;
    description: string;
    actions: PermissionAction[];
}

export const permissionModules: PermissionModule[] = [
    {
        id: 'events',
        name: 'Eventos',
        description: 'Gestión de eventos y actividades',
        actions: ['create', 'edit', 'delete', 'view']
    },
    {
        id: 'users',
        name: 'Usuarios',
        description: 'Gestión de usuarios del sistema',
        actions: ['create', 'edit', 'delete', 'view']
    },
    {
        id: 'roles',
        name: 'Roles',
        description: 'Gestión de roles y permisos',
        actions: ['create', 'edit', 'delete', 'view']
    },
    {
        id: 'faculties',
        name: 'Programas',
        description: 'Gestión de programas académicos',
        actions: ['create', 'edit', 'delete', 'view']
    },
    {
        id: 'sceneries',
        name: 'Escenarios',
        description: 'Gestión de escenarios y espacios',
        actions: ['create', 'edit', 'delete', 'view']
    }
];

export type PermissionKey = `${PermissionAction}_${PermissionModule['id']}`;

export const generatePermissionKey = (action: PermissionAction, moduleId: string): PermissionKey => {
    return `${action}_${moduleId}` as PermissionKey;
};

export const generateAllPermissions = (): Record<PermissionKey, boolean> => {
    const permissions: Record<PermissionKey, boolean> = {};
    
    permissionModules.forEach(module => {
        module.actions.forEach(action => {
            const key = generatePermissionKey(action, module.id);
            permissions[key] = false;
        });
    });

    return permissions;
};

export const getPermissionGroups = () => {
    return permissionModules.reduce((groups, module) => {
        groups[module.name] = module.actions.map(action => 
            generatePermissionKey(action, module.id)
        );
        return groups;
    }, {} as Record<string, PermissionKey[]>); 
};
