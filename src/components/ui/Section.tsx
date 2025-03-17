import { SideBar } from '@/components/ui/SideBar'
import { ReactNode } from "react"

export default function Section({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row bg-gray-100 h-full">
            <SideBar/>
            <main className="w-full h-full overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}