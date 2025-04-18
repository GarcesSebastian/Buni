import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";

interface EventPermissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

interface UserPermissions {
    events: EventPermissions;
    users: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
    roles: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
    faculty: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
    scenery: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
}

const usePermissions = () => {
    const [permissions, setPermissions] = useState<UserPermissions>({
        events: { create: false, read: false, update: false, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        roles: { create: false, read: false, update: false, delete: false },
        faculty: { create: false, read: false, update: false, delete: false },
        scenery: { create: false, read: false, update: false, delete: false }
    });
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user?.permissions) {
            // Resetear permisos si no está autenticado
            setPermissions({
                events: { create: false, read: false, update: false, delete: false },
                users: { create: false, read: false, update: false, delete: false },
                roles: { create: false, read: false, update: false, delete: false },
                faculty: { create: false, read: false, update: false, delete: false },
                scenery: { create: false, read: false, update: false, delete: false }
            });
            setIsSuperAdmin(false);
            return;
        }

        if (typeof user.permissions === "string") {
            setIsSuperAdmin(true);
            setPermissions({
                events: { create: true, read: true, update: true, delete: true },
                users: { create: true, read: true, update: true, delete: true },
                roles: { create: true, read: true, update: true, delete: true },
                faculty: { create: true, read: true, update: true, delete: true },
                scenery: { create: true, read: true, update: true, delete: true }
            });
            return;
        }

        const userPermissions = user.permissions as Record<string, boolean>;
        // console.log("userPermissions", userPermissions);
        
        setPermissions({
            events: {
                create: userPermissions.create_event || false,
                read: userPermissions.view_event || false,
                update: userPermissions.edit_event || false,
                delete: userPermissions.delete_event || false
            },
            users: {
                create: userPermissions.create_user || false,
                read: userPermissions.view_user || false,
                update: userPermissions.edit_user || false,
                delete: userPermissions.delete_user || false
            },
            roles: {
                create: userPermissions.create_role || false,
                read: userPermissions.view_role || false,
                update: userPermissions.edit_role || false,
                delete: userPermissions.delete_role || false
            },
            faculty: {
                create: userPermissions.create_faculty || false,
                read: userPermissions.view_faculty || false,
                update: userPermissions.edit_faculty || false,
                delete: userPermissions.delete_faculty || false
            },
            scenery: {
                create: userPermissions.create_scenery || false,
                read: userPermissions.view_scenery || false,
                update: userPermissions.edit_scenery || false,
                delete: userPermissions.delete_scenery || false
            }
        });
    }, [isAuthenticated, user]);

    return {
        permissions,
        isSuperAdmin,
        hasPermission: (resource: keyof UserPermissions, action: keyof EventPermissions) => {
            if (isSuperAdmin) return true;
            return permissions[resource][action];
        }
    };
};

export default usePermissions;
