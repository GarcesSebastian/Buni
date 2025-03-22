"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevronDown, ChevronRight, Menu } from "lucide-react"
import { ConfigSideBar } from "@/config/components/SideBar"

export function SideBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeviceMobile, setIsDeviceMobile] = useState(window.innerWidth <= 768)
  const [openItems, setOpenItems] = useState<string[]>([])
  const pathname = usePathname()
  const isAuthenticated = pathname === "/"

  const handleResize = () => {
    const mobile = window.innerWidth <= 768
    setIsDeviceMobile(mobile)
    if (window.innerWidth > 768) {
      setIsExpanded(true)
    } else {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const toggleItem = (title: string) => {
    setOpenItems((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    )
  }

  if (isAuthenticated) {
    return <div></div>
  }

  return (
    <div 
      className={`bg-primary text-white transition-all duration-300 ease-in-out max-md:w-full max-md:px-2 md:overflow-y-auto ${isExpanded ? "w-64" : "w-16"}`}
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
      <nav 
        className={`overflow-hidden space-y-2 md:p-2 transition-all duration-300 ease-in-out ${isExpanded ? "max-md:initial max-md:pb-2" : "max-md:max-h-0"}`}
        style={{ maxHeight: isDeviceMobile ? (isExpanded ? "500px" : "0px") : undefined }}
      >
        {ConfigSideBar.map((item) => (
          <div key={item.title}>
            <Link key={item.href} href={item.href || pathname}>
              <Button
                variant="ghost"
                className={`w-full justify-left items-center text-white hover:text-white hover:bg-white/10 ${pathname === item.href ? "bg-white/10" : ""}`}
                onClick={() => item.children && toggleItem(item.title)}
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
              <div className="ml-4 mt-2 space-y-1 grid">
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-left text-white hover:text-white hover:bg-white/10 ${pathname === child.href ? "bg-white/10" : ""}`}
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
    </div>
  )
}
