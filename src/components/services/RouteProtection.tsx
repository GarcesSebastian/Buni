"use client"

import { usePathname, useRouter } from "next/navigation"
import { useUserData, Views } from "@/hooks/auth/useUserData"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "../ui/Button"

const getRouteToViewMap = (): Record<string, keyof Views> => ({
  "/events": "events",
  "/programs": "programs",
  "/events/scenerys": "scenery",
  "/formularios": "formularios",
  "/users": "users",
  "/users/roles": "roles"
})

export function RouteProtection({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { views } = useUserData()
  const routeToViewMap = getRouteToViewMap()

  console.log(pathname)
  console.log(routeToViewMap)
  
  const viewKey = routeToViewMap[pathname]

  if (viewKey && !views[viewKey]) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Acceso restringido</h3>
          <p className="text-sm text-muted-foreground">
            No tienes permiso para ver esta sección
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push("/")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </div>
    )
  }

  return <>{children}</>
}