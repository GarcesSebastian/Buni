"use client"

import Image from "next/image"
import { UserNav } from "./UserNav"
import { usePathname } from "next/navigation"

export function TopNav() {
  const pathname = usePathname()
  const isAuthenticated = pathname !== "/"

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
            <Image src="/logo-buni.png" alt="Description" width={40} height={40}/>
            <span className="font-semibold">BUNI</span>
        </div>
        {isAuthenticated && (
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        )}
      </div>
    </header>
  )
}

