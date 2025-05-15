export type PermissionAction = {
    id: string;
    name: string;
};

export interface PermissionModule {
    id: string;
    name: string;
    description: string;
    actions: PermissionAction[];
}

export type PermissionType = {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    export?: boolean;
    import?: boolean;
};

export type Permissions = {
    events: PermissionType;
    users: PermissionType;
    roles: PermissionType;
    programs: PermissionType;
    scenery: PermissionType;
    forms: PermissionType;
    additional: PermissionType;
};