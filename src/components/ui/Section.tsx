import { SideBar } from "@/components/ui/SideBar";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

export default function Section({ children }: SectionProps) {
  return (
    <div className="flex flex-col md:flex-row bg-muted h-full">
      <SideBar />
      <main className="w-full h-full overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
