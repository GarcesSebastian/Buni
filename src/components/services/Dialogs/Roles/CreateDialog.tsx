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
}

const CreateDialog = ({ open, onOpenChange, onRoleCreate, isEditing, roleToEdit }: CreateDialogProps) => {
    const [roleName, setRoleName] = useState(roleToEdit?.nombre || "")
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        roleToEdit 
            ? Object.entries(roleToEdit.permissions)
                .filter(([, value]) => value)
                .map(([key]) => key)
            : []
    )

    useEffect(() => {
        if (open) {
            setRoleName(roleToEdit?.nombre || "")
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
        setRoleName("")
        setSelectedPermissions([])
        onOpenChange(false)
    }

    return (
        <RoleDialog 
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    setRoleName("")
                    setSelectedPermissions([])
                }
                onOpenChange(open)
            }}
            roleName={roleName}
            setRoleName={setRoleName}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            onSubmit={handleCreateRole}
            isEditing={isEditing}
        />
    )
}

export default CreateDialog
