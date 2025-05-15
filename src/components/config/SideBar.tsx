import { LayoutDashboard, Calendar, Users, BookOpen, UserCog, FileText, GraduationCap } from "lucide-react"

type SideBar = {
    title: string
    href?: string
    icon: React.ReactNode
    children?: { title: string; href: string; icon?: React.ReactNode }[]
}

export const ConfigSideBar: SideBar[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
        title: "Eventos",
        icon: <Calendar className="h-4 w-4" />,
        children: [
            { title: "Evento", href: "/events", icon: <Calendar className="h-4 w-4" /> },
            { title: "Escenarios", href: "/events/scenerys", icon: <Calendar className="h-4 w-4" /> },
        ],
    },
    {
        title: "Participantes",
        icon: <Users className="h-4 w-4" />,
        children: [{ title: "Participante", href: "/participantes", icon: <Users className="h-4 w-4" /> }],
    },
    {
        title: "Prestamos",
        icon: <BookOpen className="h-4 w-4" />,
        children: [{ title: "Prestamo", href: "/prestamos", icon: <BookOpen className="h-4 w-4" /> }],
    },
    {
        title: "Usuarios",
        icon: <UserCog className="h-4 w-4" />,
        children: [
            { title: "Usuario", href: "/users", icon: <UserCog className="h-4 w-4" /> },
            { title: "Roles", href: "/users/roles", icon: <UserCog className="h-4 w-4" /> },
        ],
    },
    {
        title: "Programas",
        href: "/programs",
        icon: <GraduationCap className="h-4 w-4" />,
    },
    {
        title: "Formularios",
        href: "/formularios",
        icon: <FileText className="h-4 w-4" />,
    },
]
