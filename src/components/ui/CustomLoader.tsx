import { Loader } from "lucide-react"

const CustomLoader = () => {
    return (
        <div className="flex flex-col gap-4 justify-center items-center h-full">
          <Loader className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando activos</p>
        </div>
    )
}

export default CustomLoader;
