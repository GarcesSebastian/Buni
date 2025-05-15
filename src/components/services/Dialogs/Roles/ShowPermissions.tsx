import { Role } from "@/types/User"
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/Dialog"
import { permissionModules } from "@/config/Permissions"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedRole: Role | null,
}   

const ShowPermissions = ({open, onOpenChange, selectedRole}: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] grid grid-rows-[auto_1fr] max-h-[90vh] overflow-y-hidden">
                <DialogHeader>
                    <DialogTitle>Permisos del Rol: {selectedRole?.name}</DialogTitle>
                    <DialogDescription>
                        Lista de permisos asignados al rol
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 max-h-[100vh] overflow-y-auto">
                    {selectedRole?.permissions && Object.entries(selectedRole?.permissions).map(([group, permissions]) => {
                        const modulePermissions = permissionModules.find((moduleChild) => moduleChild.id === group);
                        return (
                            <div key={group} className="space-y-2">
                                <h4 className="font-medium text-lg">{modulePermissions?.name}</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {Object.entries(permissions as Permissions).map(([permission, value]) => {
                                        if(!value) return null;
                                        const action = modulePermissions?.actions.find(action => action.id === permission);
                                        return (
                                            <div
                                                key={permission}
                                                className="px-3 py-2 text-sm rounded-md border bg-muted/50"
                                            >
                                                {action?.name} {modulePermissions?.name}
                                            </div>
                                        );
                                    })}

                                    {Object.entries(permissions as Permissions).every(([, value]) => value === false) && (
                                        <div className="px-3 py-2 text-sm rounded-md border bg-muted/50">
                                            No hay permisos asignados
                                        </div>
                                    )}
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