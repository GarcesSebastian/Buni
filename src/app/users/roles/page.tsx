"use client"
import React, { useState, useEffect } from "react"
import Section from "@/components/ui/Section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Alert, AlertDescription } from "@/components/ui/Alert"
import { Loader2, Plus, MoreVertical, Edit, Trash } from "lucide-react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useNotification } from "@/components/ui/Notification"
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

interface Role {
    id: number;
    name: string;
    permissions: Record<PermissionKey, boolean>;
    created_at: string;
}

type PermissionKey = 
    | 'create_event' | 'edit_event' | 'delete_event' | 'view_event'
    | 'create_user' | 'edit_user' | 'delete_user' | 'view_user'
    | 'create_role' | 'edit_role' | 'delete_role' | 'view_role'
    | 'create_faculty' | 'edit_faculty' | 'delete_faculty' | 'view_faculty'
    | 'create_scenery' | 'edit_scenery' | 'delete_scenery' | 'view_scenery';

const defaultPermissions: Record<PermissionKey, boolean> = {
    create_event: false,
    edit_event: false,
    delete_event: false,
    view_event: false,
    create_user: false,
    edit_user: false,
    delete_user: false,
    view_user: false,
    create_role: false,
    edit_role: false,
    delete_role: false,
    view_role: false,
    create_faculty: false,
    edit_faculty: false,
    delete_faculty: false,
    view_faculty: false,
    create_scenery: false,
    edit_scenery: false,
    delete_scenery: false,
    view_scenery: false,
};

const permissionGroups = {
    "Eventos": ["create_event", "edit_event", "delete_event", "view_event"],
    "Usuarios": ["create_user", "edit_user", "delete_user", "view_user"],
    "Roles": ["create_role", "edit_role", "delete_role", "view_role"],
    "Facultades": ["create_faculty", "edit_faculty", "delete_faculty", "view_faculty"],
    "Escenarios": ["create_scenery", "edit_scenery", "delete_scenery", "view_scenery"],
};

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newRole, setNewRole] = useState({
        name: "",
        permissions: { ...defaultPermissions }
    });
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const router = useRouter();
    const { showNotification } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    router.push('/');
                    return;
                }
                throw new Error('Error al cargar los roles');
            }

            const data = await response.json();
            setRoles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los roles');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const permissions = { ...defaultPermissions };
            selectedPermissions.forEach(permission => {
                permissions[permission as PermissionKey] = true;
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newRole.name,
                    permissions
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    router.push('/');
                    return;
                }
                const data = await response.json();
                throw new Error(data.error || 'Error al crear el rol');
            }

            await fetchRoles();
            setNewRole({
                name: "",
                permissions: { ...defaultPermissions }
            });
            setSelectedPermissions([]);
            setIsCreating(false);
            showNotification({
                title: "Rol creado",
                message: "El rol se ha creado exitosamente",
                type: "success"
            });
        } catch (err) {
            showNotification({
                title: "Error",
                message: err instanceof Error ? err.message : 'Error al crear el rol',
                type: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleToEdit) return;
        setIsSubmitting(true);

        try {
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const permissions = { ...defaultPermissions };
            selectedPermissions.forEach(permission => {
                permissions[permission as PermissionKey] = true;
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles/${roleToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newRole.name,
                    permissions
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    router.push('/');
                    return;
                }
                const data = await response.json();
                throw new Error(data.error || 'Error al actualizar el rol');
            }

            await fetchRoles();
            setNewRole({
                name: "",
                permissions: { ...defaultPermissions }
            });
            setSelectedPermissions([]);
            setIsEditing(false);
            setRoleToEdit(null);
            showNotification({
                title: "Rol actualizado",
                message: "El rol se ha actualizado exitosamente",
                type: "success"
            });
        } catch (err) {
            showNotification({
                title: "Error",
                message: err instanceof Error ? err.message : 'Error al actualizar el rol',
                type: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRole = async () => {
        if (!roleToDelete) return;
        setIsDeleting(true);

        try {
            const token = Cookies.get('token');
            
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/roles/${roleToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    router.push('/');
                    return;
                }
                const data = await response.json();
                throw new Error(data.error || 'Error al eliminar el rol');
            }

            await fetchRoles();
            setRoleToDelete(null);
            showNotification({
                title: "Rol eliminado",
                message: "El rol se ha eliminado exitosamente",
                type: "success"
            });
        } catch (err) {
            showNotification({
                title: "Error",
                message: err instanceof Error ? err.message : 'Error al eliminar el rol',
                type: "error"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = (role: Role) => {
        setRoleToEdit(role);
        setNewRole({
            name: role.name,
            permissions: role.permissions
        });
        setSelectedPermissions(
            Object.entries(role.permissions)
                .filter(([_, value]) => value)
                .map(([key]) => key)
        );
        setIsEditing(true);
    };

    const handleDeleteClick = (role: Role) => {
        setRoleToDelete(role);
    };

    const handlePermissionToggle = (permission: string) => {
        setSelectedPermissions(prev => 
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    if (loading) {
        return (
            <Section>
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </Section>
        );
    }

    return (
        <Section>
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col">
                    <CardTitle>Gestión de Roles</CardTitle>
                    <p className="text-muted-foreground">Crea y gestiona roles personalizados</p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end mb-4">
                        <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Rol
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>N°</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Permisos</TableHead>
                                    <TableHead>Fecha de Creación</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No se encontraron roles
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.map((role, index) => (
                                        <TableRow key={role.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(role.permissions)
                                                        .filter(([_, value]) => value)
                                                        .map(([permission]) => (
                                                            <button
                                                                key={permission}
                                                                className="px-3 py-1.5 text-sm rounded-md border bg-background border-input hover:border-foreground/20 transition-colors"
                                                            >
                                                                {permission.split('_').map(word => 
                                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                                ).join(' ')}
                                                            </button>
                                                        ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(role.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-fit w-fit p-0">
                                                        <span className="sr-only">Abrir menú</span>
                                                        <MoreVertical className="h-4 w-4 p-0"/>
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Diálogo de Crear/Editar Rol */}
            <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
                if (!open) {
                    setIsCreating(false);
                    setIsEditing(false);
                    setRoleToEdit(null);
                    setNewRole({
                        name: "",
                        permissions: { ...defaultPermissions }
                    });
                    setSelectedPermissions([]);
                }
            }}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Modifica los datos del rol' : 'Complete los datos para crear un nuevo rol'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={isEditing ? handleEditRole : handleCreateRole} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="roleName">Nombre del Rol</Label>
                            <Input
                                id="roleName"
                                value={newRole.name}
                                onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ej: Coordinador de Eventos"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>Permisos</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(permissionGroups).map(([group, permissions]) => (
                                    <div key={group} className="space-y-2">
                                        <h4 className="font-medium">{group}</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {permissions.map((permission) => (
                                                <button
                                                    key={permission}
                                                    type="button"
                                                    onClick={() => handlePermissionToggle(permission)}
                                                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-muted min-h-[2.5rem] flex items-center justify-center ${
                                                        selectedPermissions.includes(permission)
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-background border-input hover:border-foreground/20"
                                                    }`}
                                                >
                                                    {permission.split('_').map(word => 
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                    ).join(' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreating(false);
                                    setIsEditing(false);
                                    setRoleToEdit(null);
                                    setNewRole({
                                        name: "",
                                        permissions: { ...defaultPermissions }
                                    });
                                    setSelectedPermissions([]);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-primary hover:bg-primary/90"
                                loading={isSubmitting}
                                loadingText={isEditing ? "Actualizando..." : "Creando..."}
                            >
                                {isEditing ? 'Actualizar' : 'Crear'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Diálogo de Eliminar Rol */}
            <Dialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Rol</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el rol "{roleToDelete?.name}"? Esta acción no se puede deshacer.
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