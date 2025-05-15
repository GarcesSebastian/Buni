"use client"
import React, { useState, useEffect } from "react"
import Section from "@/components/ui/Section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Plus, MoreVertical, Edit, Trash, Eye } from "lucide-react"
import { useNotification } from "@/hooks/client/useNotification"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/Dropdown"
import { Role } from "@/types/User"
import { Permissions } from "@/types/Permissions"
import ShowPermissions from "@/components/services/Dialogs/Roles/ShowPermissions";
import CreateDialog from "@/components/services/Dialogs/Roles/CreateDialog";
import { useUserData } from "@/hooks/auth/useUserData"
import useRoles from "@/hooks/server/useRoles";
import CustomLoader from "@/components/ui/CustomLoader";

export default function RolesPage() {
    const { user, setUser, isLoaded } = useUserData();
    const { createRole, deleteRole, updateRole } = useRoles();
    const { showNotification } = useNotification();
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCreateRole = async (role: { name: string; permissions: Permissions }) => {
        const newRole = {
            id: -1,
            name: role.name,
            permissions: role.permissions,
            state: "true"
        };

        try {
            setIsCreating(true);
            setIsLoading(true);
            const createdRole = await createRole(newRole as unknown as Role);

            showNotification({
                title: "Rol creado",
                message: "El rol ha sido creado correctamente",
                type: "success"
            });

            setUser({ ...user, roles: [...user.roles, createdRole] });
            setIsCreating(false);
        } catch (error) {
            showNotification({
                title: "Error",
                message: error instanceof Error ? error.message : "Error al crear el rol",
                type: "error"
            });
            setIsCreating(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditRole = async (role: { name: string; permissions: Permissions }) => {
        if (!roleToEdit) return;

        const updatedRole = {
            ...roleToEdit,
            name: role.name,
            permissions: role.permissions,
            state: "true"
        };

        try {
            setIsEditing(true);
            setIsLoading(true);
            await updateRole(updatedRole as unknown as Role);

            showNotification({
                title: "Rol editado",
                message: "El rol ha sido editado correctamente",
                type: "success"
            });

            setUser({ ...user, roles: user.roles.map(r => r.id === roleToEdit.id ? updatedRole as unknown as Role : r) });
            setRoleToEdit(null);
            setIsEditing(false);
        } catch (error) {
            showNotification({
                title: "Error",
                message: error instanceof Error ? error.message : "Error al editar el rol",
                type: "error"
            });
            setIsEditing(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;

        try {
            setIsDeleting(true);
            setIsLoading(true);
            await deleteRole(roleToDelete.id);
                    
            showNotification({
                title: "Rol eliminado",
                message: "El rol ha sido eliminado correctamente",
                type: "success"
            });

            setUser({ ...user, roles: user.roles.filter(r => r.id !== roleToDelete.id) });
            setRoleToDelete(null);
            setIsDeleting(false);
        } catch (error) {
            showNotification({
                title: "Error",
                message: error instanceof Error ? error.message : "Error al eliminar el rol",
                type: "error"
            });
            setIsDeleting(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (role: Role) => {
        setRoleToEdit(role);
        setIsEditing(true);
    };

    const handleDeleteClick = (role: Role) => {
        setRoleToDelete(role);
    };

    return (
        <Section>
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col">
                    <CardTitle>Gestión de Roles</CardTitle>
                    <p className="text-muted-foreground">Crea y gestiona roles personalizados</p>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-start mb-4">
                        <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Rol
                        </Button>
                    </div>

                    {!mounted ? (
                        <div className="flex flex-col gap-4 justify-center items-center h-full">
                            <CustomLoader />
                        </div>
                    ) : !isLoaded ? (
                        <div className="flex flex-col gap-4 justify-center items-center h-full">
                            <CustomLoader />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>N°</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Permisos</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {user.roles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">
                                                No se encontraron roles
                                            </TableCell>
                                        </TableRow>
                                    ) : user.roles.map((role, index) => (
                                        <TableRow key={role.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedRole(role)}
                                                    className="flex items-center gap-2 max-sm:text-xs"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Ver permisos
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-fit w-fit p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="text-green-800" onClick={() => handleEditClick(role)}>
                                                            <Edit className="mr-2 h-4 w-4 text-green-800" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-800" onClick={() => handleDeleteClick(role)}>
                                                            <Trash className="mr-2 h-4 w-4 text-red-800" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <ShowPermissions open={!!selectedRole} onOpenChange={(open) => !open && setSelectedRole(null)} selectedRole={selectedRole} />

            <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
                if (!open) {
                    setIsCreating(false);
                    setIsEditing(false);
                    setRoleToEdit(null);
                }
            }}>
                <CreateDialog 
                    open={isCreating || isEditing}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsCreating(false);
                            setIsEditing(false);
                            setRoleToEdit(null);
                        }
                    }}
                    onRoleCreate={(role) => {
                        if (isEditing && roleToEdit) {
                            handleEditRole(role);
                        } else {
                            handleCreateRole(role);
                        }
                    }}
                    isEditing={isEditing}
                    roleToEdit={roleToEdit}
                    isLoading={isLoading}
                />
            </Dialog>

            <Dialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Rol</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el rol &quot;{roleToDelete?.name}&quot;? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRoleToDelete(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteRole}
                            loading={isDeleting}
                            loadingText="Eliminando..."
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Section>
    );
} 