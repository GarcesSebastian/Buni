import { SideBar } from "@/components/ui/SideBar";
import { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { useFetchUsers } from "@/hooks/server/useUsers";

interface SectionProps {
  children: ReactNode;
}

export default function Section({ children }: SectionProps) {
  const { loading, error } = useFetchUsers();

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 h-full">
      <SideBar />
      <main className="w-full h-full overflow-y-auto p-4 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-3 text-lg font-semibold text-primary">Cargando datos...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="flex items-center gap-4">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
