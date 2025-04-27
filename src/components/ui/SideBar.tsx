"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevronDown, ChevronRight, Menu, LogOut } from "lucide-react"
import { ConfigSideBar } from "@/components/config/SideBar"
import { useUserData } from "@/hooks/auth/useUserData"
import { useAuth } from "@/hooks/auth/useAuth"

export function SideBar() {
  const { states, setStates } = useUserData()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const isAuthenticated = pathname === "/"
  
  useEffect(() => {
    if (states.sidebarExpanded === undefined) {
      const isDesktop = window.innerWidth > 768
      setStates({
        ...states,
        sidebarExpanded: isDesktop,
        sidebarOpenItems: [],
        isDeviceMobile: window.innerWidth <= 768
      })
    }
    
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setStates({
        ...states,
        isDeviceMobile: mobile,
        sidebarExpanded: states.userToggled ? states.sidebarExpanded : window.innerWidth > 768
      })
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [states, setStates])

  const toggleExpand = () => {
    setStates({
      ...states,
      sidebarExpanded: !states.sidebarExpanded,
      userToggled: true
    })
  }

  const toggleItem = (title: string) => {
    const currentOpenItems = states.sidebarOpenItems || []
    setStates({
      ...states,
      sidebarOpenItems: currentOpenItems.includes(title)
        ? currentOpenItems.filter(item => item !== title)
        : [...currentOpenItems, title]
    })
  }

  if (isAuthenticated) {
    return <div></div>
  }

  const isExpanded = states.sidebarExpanded !== undefined ? states.sidebarExpanded : true
  const isDeviceMobile = states.isDeviceMobile !== undefined ? states.isDeviceMobile : false
  const openItems = states.sidebarOpenItems || []

  return (
    <div 
      className={`bg-primary text-white transition-all duration-300 ease-in-out max-md:w-full max-md:px-2 md:overflow-y-auto flex flex-col ${isExpanded ? isDeviceMobile ? "w-full h-screen max-h-screen" : "w-64 h-full" : isDeviceMobile ? "w-full h-fit" : "w-16 h-full"}`}
    >
      <div className={`py-4 flex items-center ${isExpanded ? "md:px-4 justify-between" : "px-0 md:justify-center justify-between"}`}>
        <span className={`font-bold text-xl ${isExpanded ? "md:initial" : "md:hidden"}`}>BUNI</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpand}
          className={`text-white hover:text-white hover:bg-white/10 justify-center ${isExpanded && "md:px-2"}`}
        >
          <span className="flex-shrink-0">
            <Menu className="h-4 w-4" />
          </span>
        </Button>
      </div>
      <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-md:initial" : "max-md:hidden"} ${isDeviceMobile ? "h-[calc(100vh-4rem)] overflow-y-auto" : ""}`}>
        <nav 
          className={`overflow-y-auto overflow-x-hidden space-y-2 md:p-2 transition-all duration-300 ease-in-out max-md:h-fit`}
        >
          {ConfigSideBar.map((item) => (
            <div key={item.title}>
              <Link key={item.href} href={item.href || pathname}>
                <Button
                  variant="ghost"
                  className={`w-full justify-left items-center text-white hover:text-white hover:bg-white/10 ${pathname === item.href ? "bg-white/10" : ""}`}
                  onClick={() => {
                    if (item.children) {
                      toggleItem(item.title)
                    } else if (isDeviceMobile) {
                      toggleExpand()
                    }
                  }}
                >
                  <span className={`flex-shrink-0 ${isExpanded ? "max-md:flex" : "max-md:hidden"}`}>{item.icon}</span>
                  <div className={`w-full flex justify-left items-center ${isExpanded ? "flex" : "hidden"}`}>
                    <span className="ml-2 whitespace-nowrap">{item.title}</span>
                    {item.children &&
                      (openItems.includes(item.title) ? (
                        <ChevronDown className="ml-auto h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4 flex-shrink-0" />
                      ))}
                  </div>
                </Button>
              </Link>
              {isExpanded && item.children && openItems.includes(item.title) && (
                <div className="ml-4 mt-2 space-y-1 grid transition-all duration-300 ease-in-out">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-left text-white hover:text-white hover:bg-white/10 ${pathname === child.href ? "bg-white/10" : ""}`}
                        onClick={() => isDeviceMobile && toggleExpand()}
                      >
                        <span className="flex-shrink-0">{child.icon}</span>
                        <span className="ml-2 whitespace-nowrap">{child.title}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        {isDeviceMobile && isExpanded && (
          <div className="mt-auto p-2 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {user && (
                <div className="text-sm text-white/80 px-2 py-1">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-white/60 truncate">{user.email}</p>
                </div>
              )}
              <Button
                variant="ghost"
                className="w-full justify-left text-white hover:text-white hover:bg-white/10"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}