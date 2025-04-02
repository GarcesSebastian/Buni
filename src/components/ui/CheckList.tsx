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
import { GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "./Button"
import { useState } from "react"
import { Input } from "./Input"
import { ItemList } from "../services/Dialogs/Forms/CreateDialog"

interface Field {
    id: number,
    value: string
}

interface SorteableFieldProps {
    campo: Field,
    onDelete: (id: number) => void,
}

interface CheckListProps {
    itemsList: ItemList[]
    setItemsList: (prev: ItemList[] | ((prev: ItemList[]) => ItemList[])) => void
}

function SortableCampo({ campo, onDelete }: SorteableFieldProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: campo.id })
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
  
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between border p-1 rounded-md bg-white hover:bg-gray-50 cursor-move"
      >
        <div className="flex items-center gap-3">
          <div
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div>
            <p className="font-normal text-sm">{campo.value}</p>
          </div>
        </div>
  
        <div className="flex justify-center items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(campo.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
      </div>
    )
}

const CheckList = ({itemsList, setItemsList}: CheckListProps) => {
    const [currentItem, setCurrentItem] = useState<string>("Crear nuevo")

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

    const deleteField = (id: number) => {
        setItemsList((prev: ItemList[]) => prev.filter((item) => item.id !== id))
    }

    const addField = () => {
        setItemsList((prev: ItemList[]) => [...prev, {id: itemsList[itemsList.length - 1] ? itemsList[itemsList.length - 1].id + 1 : 1, value: currentItem}])
        setCurrentItem("Crear nuevo")
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
                                <SortableCampo campo={campo} onDelete={deleteField}/>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full">
                            <Input
                                type="text"
                                value={currentItem}
                                onChange={(e) => setCurrentItem(e.target.value)}
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
                </SortableContext>
            </DndContext>
        </>
    )
}

export default CheckList