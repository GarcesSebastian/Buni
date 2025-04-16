import { Role } from "@/app/users/roles/page"
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/Dialog"
import { PermissionKey, getPermissionGroups } from "@/config/Permissions"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedRole: Role | null
}   

const permissionGroups = getPermissionGroups();

const ShowPermissions = ({open, onOpenChange, selectedRole}: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] grid grid-rows-[auto_1fr] max-h-[90vh] overflow-y-hidden">
                <DialogHeader>
                    <DialogTitle>Permisos del Rol: {selectedRole?.nombre}</DialogTitle>
                    <DialogDescription>
                        Lista de permisos asignados al rol
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 max-h-[100vh] overflow-y-auto">
                    {Object.entries(permissionGroups).map(([group, permissions]) => {
                        const hasPermissions = permissions.some(permission => 
                            selectedRole?.permissions[permission as PermissionKey]
                        );

                        if (!hasPermissions) return null;

                        return (
                            <div key={group} className="space-y-2">
                                <h4 className="font-medium text-lg">{group}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {permissions.map((permission) => {
                                        const hasPermission = selectedRole?.permissions[permission as PermissionKey];
                                        if (!hasPermission) return null;

                                        return (
                                            <div
                                                key={permission}
                                                className="px-3 py-2 text-sm rounded-md border bg-muted/50"
                                            >
                                                {permission.split('_').map(word => 
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' ')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )   
}

export default ShowPermissions;