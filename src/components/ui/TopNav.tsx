"use client"

import Image from "next/image"
import { UserNav } from "./UserNav"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function TopNav() {
  const pathname = usePathname()
  const isAuthenticated = pathname !== "/"

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center size-fit">
          <img src="https://i.ibb.co/K8mMDbP/Logo.png" alt="Logo Bienestar Universitario Cartagena" width={160} height={40}/>
        </Link>
        {isAuthenticated && (
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        )}
      </div>
    </header>
  )
}

