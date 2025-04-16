import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"

import { TopNav } from "@/components/ui/TopNav"
import { UserDataProvider } from "@/hooks/auth/useUserData"
import { WebSocketProvider } from "@/hooks/server/useWebSocket"
import { NotificationProvider } from "@/components/ui/Notification"
import { Suspense } from "react"

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
        <div className="h-screen overflow-hidden">
          <TopNav/>
          <div className="flex overflow-hidden">
            <UserDataProvider>
              <WebSocketProvider>
                <NotificationProvider>
                  <Suspense>
                    <main className="w-full overflow-hidden h-screen">{children}</main>
                  </Suspense>
                </NotificationProvider>
              </WebSocketProvider>
            </UserDataProvider>
          </div>
        </div>
      </body>
    </html>
  )
}

