import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"

import { TopNav } from "@/components/ui/TopNav"
import { UserDataProvider } from "@/hooks/auth/useUserData"
import { NotificationProvider } from "@/hooks/client/useNotification"
import { AuthProvider } from "@/hooks/auth/useAuth"
import { SocketProvider } from "@/hooks/server/useSocket"
import { RouteProtection } from "@/components/services/RouteProtection"
import { LogoutProvider } from "@/contexts/LogoutContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BUNI - Sistema de Eventos",
  description: "Sistema de administración de eventos universitarios",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="shortcut icon" href={"/logo.png"} type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <NotificationProvider>
          <LogoutProvider>
            <div className="h-screen overflow-hidden">
              <AuthProvider>
                <TopNav />
                <div className="flex overflow-hidden">
                  <UserDataProvider>
                    <SocketProvider>
                      <RouteProtection>
                        <div className="flex-1 overflow-hidden md:h-[calc(100vh-4.05rem)] h-screen">
                          {children}
                        </div>
                      </RouteProtection>
                    </SocketProvider>
                  </UserDataProvider>
                </div>
              </AuthProvider>
            </div>
          </LogoutProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}

