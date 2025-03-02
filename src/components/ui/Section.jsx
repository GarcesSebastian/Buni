import { TableGeneric } from "@/components/services/TableGeneric"
import { SideBar } from '@/components/ui/SideBar'

export default function Section({structure, structureForm, data, setData, table}) {
    return (
        <div className="flex flex-1 flex-row max-md:flex-col bg-gray-100">
            <SideBar/>
            <main className="flex-1 p-4 sm:p-8">
                <div className="space-y-4 p-4 shadow-lg shadow-black/5 rounded-lg bg-white">
                    <h1 className="text-2xl font-bold">{table.name}</h1>
                    <p className="text-muted-foreground">Listado de {table.name}</p>
                    <TableGeneric structure={structure} structureForm={structureForm} data={data} setData={setData} table={table} />
                </div>
            </main>
        </div>
    )
}