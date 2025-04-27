"use client"

import { UserNav } from "./UserNav"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/auth/useAuth"

export function TopNav() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="border-b max-md:hidden">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center size-fit">
          <Image src={"https://i.ibb.co/K8mMDbP/Logo.png"} width={160} height={40} alt="Logo Bienestar Universitario Cartagena"></Image>
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

