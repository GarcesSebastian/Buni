import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"

import { TopNav } from "@/components/ui/TopNav"
import { UserDataProvider } from "@/hooks/auth/useUserData"
import { NotificationProvider } from "@/hooks/client/useNotification"
import { Suspense } from "react"
import { AuthProvider } from "@/hooks/auth/useAuth"
import { SocketProvider } from "@/hooks/server/useSocket"
import { RouteProtection } from "@/components/services/RouteProtection"

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
        <link rel="shortcut icon" href="/logo-buni.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <NotificationProvider>
          <AuthProvider>
            <UserDataProvider>
              <SocketProvider>
                <RouteProtection>
                  <div className="flex flex-col h-screen overflow-hidden">
                    <TopNav />
                    <Suspense>
                      <main className="flex-1 overflow-hidden">
                        {children}
                      </main>
                    </Suspense>
                  </div>
                </RouteProtection>
              </SocketProvider>
            </UserDataProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}

