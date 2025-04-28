import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
  
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Check, Edit, EllipsisVertical, GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "./Button"
import { useState } from "react"
import { Input } from "./Input"
import { ItemList } from "../services/Dialogs/Forms/CreateDialog"

interface Field {
    id: string,
    value: string
}

interface SorteableFieldProps {
    campo: Field,
    onDelete: (id: string) => void,
    onEdit: (id: string) => void,
    editingField: string | null,
    handleEdit: (id: string, value: string) => void,
    isOpen: Record<string, boolean>,
    setIsOpen: (value: Record<string, boolean>) => void
}

interface CheckListProps {
    itemsList: ItemList[]
    setItemsList: (prev: ItemList[] | ((prev: ItemList[]) => ItemList[])) => void
    normalizeString: (str: string) => string
}

const SorteableOptions = ({campo, onDelete, onEdit}: {campo: Field, onDelete: (id: string) => void, onEdit: (id: string) => void}) => {
    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(campo.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(campo.id)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            >
                <Edit className="h-4 w-4" />
            </Button>
        </>
    )
}

function SortableCampo({ campo, onDelete, onEdit, editingField, handleEdit, isOpen, setIsOpen }: SorteableFieldProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: campo.id })
    const [currentItem, setCurrentItem] = useState<string>(campo.value)
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    const handleCheck = () => {
        handleEdit(campo.id, currentItem)
    }

    const handleEllipsis = () => {
        const newState = {...isOpen}
        Object.keys(newState).map((key) => {
            newState[key] = !(key !== campo.id.toString())
        })
        setIsOpen(newState)
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="grid grid-cols-4 border gap-2 px-1 py-2 rounded-md hover:bg-gray-50 cursor-move"
      >
        <div className="w-full flex items-center gap-3 col-span-3">
          <div
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="w-full grid grid-cols-1">
            {editingField === campo.id ? (
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={currentItem}
                        onChange={(e) => setCurrentItem(e.target.value)}
                    />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCheck}
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <p className="font-normal text-sm truncate w-full">{campo.value}</p>
            )}
          </div>
        </div>
  
        <div className="w-full flex justify-center items-center col-span-1 max-[350px]:hidden">
            <SorteableOptions campo={campo} onDelete={onDelete} onEdit={onEdit} />
        </div>

        <div className="w-full flex justify-center items-center col-span-1 min-[350px]:hidden">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleEllipsis}
            >
                <EllipsisVertical className="h-4 w-4" />
            </Button>

            {isOpen[campo.id.toString()] && (
                <div className="absolute top-full right-0 bg-white shadow-md rounded-md z-10">
                    <SorteableOptions campo={campo} onDelete={onDelete} onEdit={onEdit} />
                </div>
            )}
        </div>
      </div>
    )
}

const CheckList = ({itemsList, setItemsList, normalizeString}: CheckListProps) => {
    const [currentItem, setCurrentItem] = useState<string>("Crear nuevo")
    const [editingField, setEditingField] = useState<string | null>(null)
    const [isOpenItems, setIsOpenItems] = useState<Record<string, boolean>>({})
    const [error, setError] = useState<string>("")

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
    
        if (over && active.id !== over.id) {
          const oldIndex = itemsList.findIndex((campo) => campo.id === active.id)
          const newIndex = itemsList.findIndex((campo) => campo.id === over.id)
    
          const itemListNew = arrayMove(itemsList, oldIndex, newIndex)
          setItemsList(itemListNew)
        }
    }

    const deleteField = (id: string) => {
        setItemsList((prev: ItemList[]) => prev.filter((item) => item.id !== id))
        setIsOpenItems((prev: Record<string, boolean>) => {
            const newIsOpen = {...prev}
            delete newIsOpen[id]
            return newIsOpen
        })
    }

    const addField = () => {
        if (currentItem.trim() === "") {
            setError("El campo no puede estar vacío")
            return
        }

        const fieldExists = itemsList.some(item => normalizeString(item.value) === normalizeString(currentItem))
        if (fieldExists) {
            setError("Este campo ya existe")
            return
        }

        const newId = itemsList[itemsList.length - 1] ? itemsList[itemsList.length - 1].id + 1 : 1
        setItemsList((prev: ItemList[]) => [...prev, {id: newId.toString(), value: currentItem}])
        setCurrentItem("Crear nuevo")
        setIsOpenItems((prev: Record<string, boolean>) => ({...prev, [newId.toString()]: false}))
        setError("")
    }

    const editField = (id: string) => {
        setEditingField(id)
    }

    const handleEdit = (id: string, value: string) => {
        if (value.trim() === "") {
            setError("El campo no puede estar vacío")
            return
        }

        const fieldExists = itemsList.some(item => item.id !== id && normalizeString(item.value) === normalizeString(value))
        if (fieldExists) {
            setError("Este campo ya existe")
            return
        }

        setItemsList((prev: ItemList[]) => prev.map((item) => item.id === id ? {...item, value: value} : item))
        setEditingField(null)
        setError("")
    }

    return(
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={itemsList} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {itemsList.map((campo) => (
                            <div key={campo.id} className="relative">
                                <SortableCampo 
                                    campo={campo} 
                                    onDelete={deleteField} 
                                    onEdit={editField} 
                                    editingField={editingField} 
                                    handleEdit={handleEdit}
                                    isOpen={isOpenItems}
                                    setIsOpen={setIsOpenItems}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 w-full">
                                <Input
                                    type="text"
                                    value={currentItem}
                                    onChange={(e) => {
                                        setCurrentItem(e.target.value)
                                        setError("")
                                    }}
                                    placeholder="Crear nuevo"
                                    className="w-full outline-none ring-"
                                />
                            </div>

                            <div className="flex justify-center items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addField()}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </SortableContext>
            </DndContext>
        </>
    )
}

export default CheckList