"use client"

import { useState, useEffect } from "react"
import { Role } from "@/types/User"
import { permissionsDefault } from "@/config/Permissions"
import { Permissions, PermissionType } from "@/types/Permissions"
import { RoleDialog } from "@/components/services/Dialogs/Roles/RoleDialog"

interface CreateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onRoleCreate: (role: { name: string; permissions: Permissions }) => void
    isEditing?: boolean
    roleToEdit?: Role | null
    isLoading?: boolean
}

const CreateDialog = ({ open, onOpenChange, onRoleCreate, isEditing, roleToEdit, isLoading }: CreateDialogProps) => {
    const [roleName, setRoleName] = useState(roleToEdit?.name || "")
    const [selectedPermissions, setSelectedPermissions] = useState<Record<string, PermissionType>>(permissionsDefault)

    useEffect(() => {
        if (open) {
            setRoleName(roleToEdit?.name || "")
            const permissions = roleToEdit?.permissions || permissionsDefault
            setSelectedPermissions(permissions as Record<string, PermissionType>)
        }
    }, [open, roleToEdit])

    const handleCreateRole = () => {
        onRoleCreate({
            name: roleName,
            permissions: selectedPermissions as Permissions
        })
    }

    return (
        <RoleDialog 
            open={open}
            onOpenChange={(open) => {
                if (!open && !isLoading) {
                    setRoleName("")
                    setSelectedPermissions(permissionsDefault)
                    onOpenChange(open)
                }
            }}
            roleName={roleName}
            setRoleName={setRoleName}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            onSubmit={handleCreateRole}
            isEditing={isEditing}
            isLoading={isLoading}
        />
    )
}

export default CreateDialog
