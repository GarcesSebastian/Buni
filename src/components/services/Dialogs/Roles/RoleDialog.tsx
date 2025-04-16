"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { permissionModules } from "@/config/Permissions"

interface RoleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    roleName: string
    setRoleName: (name: string) => void
    selectedPermissions: string[]
    setSelectedPermissions: React.Dispatch<React.SetStateAction<string[]>>
    onSubmit: () => void
    isEditing?: boolean
}

export function RoleDialog({ 
    open, 
    onOpenChange, 
    roleName, 
    setRoleName, 
    selectedPermissions, 
    setSelectedPermissions,
    onSubmit,
    isEditing,
}: RoleDialogProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(
        permissionModules.map((module) => module.id)
    )

    const togglePermission = (permissionId: string) => {
        setSelectedPermissions((prev: string[]) =>
            prev.includes(permissionId) ? prev.filter((id: string) => id !== permissionId) : [...prev, permissionId]
        )
    }

    const toggleCategoryPermissions = (moduleId: string) => {
        const moduleData = permissionModules.find(m => m.id === moduleId)
        if (!moduleData) return

        const modulePermissionIds = moduleData.actions.map(action => `${action}_${moduleId}`)
        const allSelected = modulePermissionIds.every((id) => selectedPermissions.includes(id))

        if (allSelected) {
            setSelectedPermissions((prev: string[]) => prev.filter((id: string) => !modulePermissionIds.includes(id)))
        } else {
            setSelectedPermissions((prev: string[]) => {
                const newPermissions = [...prev]
                modulePermissionIds.forEach((id) => {
                    if (!newPermissions.includes(id)) {
                        newPermissions.push(id)
                    }
                })
                return newPermissions
            })
        }
    }

    const toggleCategoryExpansion = (categoryId: string) => {
        setExpandedCategories((prev: string[]) =>
            prev.includes(categoryId) ? prev.filter((id: string) => id !== categoryId) : [...prev, categoryId]
        )
    }

    const isCategoryFullySelected = (moduleId: string) => {
        const moduleData = permissionModules.find(m => m.id === moduleId)
        if (!moduleData) return false
        return moduleData.actions.every(action => selectedPermissions.includes(`${action}_${moduleId}`))
    }

    const isCategoryPartiallySelected = (moduleId: string) => {
        const moduleData = permissionModules.find(m => m.id === moduleId)
        if (!moduleData) return false
        const hasSelected = moduleData.actions.some(action => selectedPermissions.includes(`${action}_${moduleId}`))
        return hasSelected && !isCategoryFullySelected(moduleId)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Modifique los datos del rol' : 'Complete los datos para crear un nuevo rol'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label htmlFor="roleName" className="text-sm font-medium">
                            Nombre del Rol
                        </label>
                        <Input
                            id="roleName"
                            placeholder="Ej: Coordinador de Eventos"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Permisos</label>
                        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 hidden md:block">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 text-sm font-medium text-gray-700">Módulo</div>
                                    <div className="col-span-2 text-sm font-medium text-gray-700">Permisos</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 md:hidden">
                                <div className="text-sm font-medium text-gray-700">Módulos y Permisos</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {permissionModules.map((module) => {
                                    const isExpanded = expandedCategories.includes(module.id)
                                    const isFullySelected = isCategoryFullySelected(module.id)
                                    const isPartiallySelected = isCategoryPartiallySelected(module.id)

                                    return (
                                        <div key={module.id} className="hover:bg-gray-50 transition-colors">
                                            <div className="hidden md:grid md:grid-cols-3 md:gap-4">
                                                <div className="col-span-1 p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleCategoryExpansion(module.id)}
                                                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown size={16} className="text-gray-600" />
                                                            ) : (
                                                                <ChevronRight size={16} className="text-gray-600" />
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleCategoryPermissions(module.id)}
                                                            className="flex items-center space-x-2 text-sm font-medium"
                                                        >
                                                            <div
                                                                className={
                                                                    isFullySelected
                                                                        ? "w-5 h-5 rounded-md bg-primary flex items-center justify-center"
                                                                        : isPartiallySelected
                                                                            ? "w-5 h-5 rounded-md border-2 border-primary flex items-center justify-center"
                                                                            : "w-5 h-5 rounded-md border border-gray-300 flex items-center justify-center"
                                                                }
                                                            >
                                                                {isFullySelected && <Check size={14} className="text-white" />}
                                                                {isPartiallySelected && <div className="w-2 h-2 bg-primary rounded-sm" />}
                                                            </div>
                                                            <span className="text-gray-800">{module.name}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 p-4">
                                                    {isExpanded && (
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {module.actions.map((action) => {
                                                                const permissionId = `${action}_${module.id}`
                                                                const isSelected = selectedPermissions.includes(permissionId)

                                                                return (
                                                                    <button
                                                                        key={permissionId}
                                                                        type="button"
                                                                        onClick={() => togglePermission(permissionId)}
                                                                        className={
                                                                            isSelected
                                                                                ? "flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors bg-primary text-white hover:bg-primary/90"
                                                                                : "flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
                                                                        }
                                                                    >
                                                                        <span className="truncate">{action.charAt(0).toUpperCase() + action.slice(1)} {module.name}</span>
                                                                        {isSelected && <Check size={16} />}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="md:hidden">
                                                <div className="p-4 border-b border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleCategoryExpansion(module.id)}
                                                                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                                            >
                                                                {isExpanded ? (
                                                                    <ChevronDown size={16} className="text-gray-600" />
                                                                ) : (
                                                                    <ChevronRight size={16} className="text-gray-600" />
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleCategoryPermissions(module.id)}
                                                                className="flex items-center space-x-2 text-sm font-medium"
                                                            >
                                                                <div
                                                                    className={
                                                                        isFullySelected
                                                                            ? "w-5 h-5 rounded-md bg-primary flex items-center justify-center"
                                                                            : isPartiallySelected
                                                                                ? "w-5 h-5 rounded-md border-2 border-primary flex items-center justify-center"
                                                                                : "w-5 h-5 rounded-md border border-gray-300 flex items-center justify-center"
                                                                    }
                                                                >
                                                                    {isFullySelected && <Check size={14} className="text-white" />}
                                                                    {isPartiallySelected && <div className="w-2 h-2 bg-primary rounded-sm" />}
                                                                </div>
                                                                <span className="text-gray-800">{module.name}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {isExpanded && (
                                                    <div className="p-4 bg-gray-50">
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {module.actions.map((action) => {
                                                                const permissionId = `${action}_${module.id}`
                                                                const isSelected = selectedPermissions.includes(permissionId)

                                                                return (
                                                                    <button
                                                                        key={permissionId}
                                                                        type="button"
                                                                        onClick={() => togglePermission(permissionId)}
                                                                        className={
                                                                            isSelected
                                                                                ? "flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors bg-primary text-white hover:bg-primary/90"
                                                                                : "flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
                                                                        }
                                                                    >
                                                                        <span className="truncate">{action.charAt(0).toUpperCase() + action.slice(1)} {module.name}</span>
                                                                        {isSelected && <Check size={16} />}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-end">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        <Button
                            onClick={onSubmit}
                            className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
                            disabled={!roleName.trim()}
                        >
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 