"use client"

import { useState, useEffect } from "react"
import { Role } from "@/app/users/roles/page"
import { PermissionKey } from "@/config/Permissions"
import { RoleDialog } from "@/components/services/Dialogs/Roles/RoleDialog"

interface CreateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onRoleCreate: (role: { name: string; permissions: Record<PermissionKey, boolean> }) => void
    isEditing?: boolean
    roleToEdit?: Role | null
    isLoading?: boolean
}

const CreateDialog = ({ open, onOpenChange, onRoleCreate, isEditing, roleToEdit, isLoading }: CreateDialogProps) => {
    const [roleName, setRoleName] = useState(roleToEdit?.name || "")
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        roleToEdit 
            ? Object.entries(roleToEdit.permissions)
                .filter(([, value]) => value)
                .map(([key]) => key)
            : []
    )

    useEffect(() => {
        if (open) {
            setRoleName(roleToEdit?.name || "")
            setSelectedPermissions(
                roleToEdit 
                    ? Object.entries(roleToEdit.permissions)
                        .filter(([, value]) => value)
                        .map(([key]) => key)
                    : []
            )
        }
    }, [open, roleToEdit])

    const handleCreateRole = () => {
        const permissions: Record<PermissionKey, boolean> = {}
        selectedPermissions.forEach(permission => {
            permissions[permission as PermissionKey] = true
        })
        
        onRoleCreate({
            name: roleName,
            permissions
        })
    }

    return (
        <RoleDialog 
            open={open}
            onOpenChange={(open) => {
                if (!open && !isLoading) {
                    setRoleName("")
                    setSelectedPermissions([])
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
