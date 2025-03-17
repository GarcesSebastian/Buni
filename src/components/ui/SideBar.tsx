"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevronDown, ChevronRight, LayoutDashboard, Calendar, Users, BookOpen, UserCog, Menu } from "lucide-react"

type NavItem = {
  title: string
  href?: string
  icon: React.ReactNode
  children?: { title: string; href: string; icon?: React.ReactNode }[]
}

const navItems: NavItem[] = [
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
      { title: "Escenarios", href: "/events/scenerys" },
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
      { title: "Roles", href: "/users/roles" },
    ],
  },
  {
    title: "Facultades",
    href: "/faculties",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Formularios",
    href: "/formularios",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
]

export function SideBar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [openItems, setOpenItems] = useState<string[]>([])
  const pathname = usePathname()
  const isAuthenticated = pathname == "/"

  useEffect(() => {
    console.log("New state", isExpanded)
  },[isExpanded])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const toggleItem = (title: string) => {
    setOpenItems((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    )
  }

  if (isAuthenticated){
    return (<div></div>)
  }

  return (
    <div 
      className={`bg-[#DC2626] text-white transition-all duration-300 ease-in-out max-md:w-full max-md:px-2 ${isExpanded ? "w-64" : "w-16"}`}
    >
      <div className={`p-4 flex justify-between items-center`}>
        <span className={`font-bold text-xl ${isExpanded ? "md:initial" : "md:hidden"}`}>BUNI</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpand}
          className={`text-white hover:text-white hover:bg-white/10 justify-center ${isExpanded ? "md:px-2" : "md:w-8 md:h-8"}`}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className={`space-y-2 md:p-2 max-md:pb-2 ${isExpanded ? "max-md:initial" : "max-md:hidden max-md:animate-hidden-element max-md:h-0"}`}>
        {navItems.map((item) => (
          <div key={item.title}>
            <Link key={item.href} href={item.href || pathname}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white hover:bg-white/10 ${
                  pathname === item.href ? "bg-white/10" : ""
                }`}
                onClick={() => item.children && toggleItem(item.title)}
              >
                {item.icon}
                <div className={`w-full justify-left items-center max-md:flex ${isExpanded ? "md:flex" : "md:hidden"}`}>
                  <span className="ml-2">{item.title}</span>
                  {item.children &&
                    (openItems.includes(item.title) ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    ))}
                </div>
              </Button>
            </Link>
            {isExpanded && item.children && openItems.includes(item.title) && (
              <div className="ml-4 mt-2 space-y-1 grid">
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-left text-white hover:text-white hover:bg-white/10 ${
                        pathname === child.href ? "bg-white/10" : ""
                      }`}
                    >
                      {item.icon}
                      <span className="ml-2">{child.title}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

