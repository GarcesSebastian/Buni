"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export type NotificationType = "success" | "error" | "warning" | "info" | "default"
export type NotificationPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center"

export interface NotificationProps {
  id: string
  title: string
  message?: string
  type?: NotificationType
  position?: NotificationPosition
  duration?: number
  onClose?: () => void
  index?: number
}

type NotificationContextType = {
  notifications: NotificationProps[]
  showNotification: (notification: Omit<NotificationProps, "id" | "index">) => string
  hideNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification debe ser usado dentro de un NotificationProvider")
  }
  return context
}

function getVariantClasses(type: NotificationType): string {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-200 text-green-800"
    case "error":
      return "bg-red-50 border-red-200 text-red-800"
    case "warning":
      return "bg-yellow-50 border-yellow-200 text-yellow-800"
    case "info":
      return "bg-blue-50 border-blue-200 text-blue-800"
    default:
      return "bg-background text-foreground"
  }
}

function getPositionClasses(position: NotificationPosition): string {
  switch (position) {
    case "top-right":
      return "top-4 right-4"
    case "top-left":
      return "top-4 left-4"
    case "bottom-right":
      return "bottom-4 right-4"
    case "bottom-left":
      return "bottom-4 left-4"
    case "top-center":
      return "top-4 left-1/2 -translate-x-1/2"
    case "bottom-center":
      return "bottom-4 left-1/2 -translate-x-1/2"
    default:
      return "top-4 right-4"
  }
}

function NotificationItem({
  title,
  message,
  type = "default",
  position = "top-right",
  onClose,
  index = 0,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const enterTimeout = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => {
      clearTimeout(enterTimeout)
    }
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getVerticalOffset = () => {
    const baseOffset = 24
    const itemHeight = 88
    const gap = 32

    return baseOffset + index * (itemHeight + gap)
  }

  const getPositionStyle = () => {
    const offset = getVerticalOffset()

    if (position.includes("top")) {
      return { top: `${offset}px` }
    } else if (position.includes("bottom")) {
      return { bottom: `${offset}px` }
    }

    return {}
  }

  const baseClasses =
    "fixed flex w-auto max-w-sm items-center rounded-lg border p-4 shadow-md z-50 transition-all duration-300 ease-in-out"
  const variantClasses = getVariantClasses(type)
  const positionClasses = getPositionClasses(position)
  const visibilityClasses = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  const exitingClasses = isExiting ? "opacity-0 translate-x-4" : ""

  const combinedClasses = `${baseClasses} ${variantClasses} ${positionClasses} ${visibilityClasses} ${exitingClasses}`

  return (
    <div className={combinedClasses} role="alert" style={getPositionStyle()}>
      <div className="flex w-full items-start">
        {getIcon() && <div className="mr-3 flex-shrink-0">{getIcon()}</div>}
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {message && <p className="mt-1 text-sm">{message}</p>}
        </div>
        <button
          onClick={handleClose}
          className="ml-4 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function NotificationContainer({
  notifications,
  position = "top-right",
  onClose,
}: {
  notifications: NotificationProps[]
  position: NotificationPosition
  onClose: (id: string) => void
}) {
  return (
    <div className={`fixed bg-red-500 z-50 ${position}`}>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          position={position}
          index={index}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  )
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      const position = notification.position || "top-right"
      if (!acc[position]) {
        acc[position] = []
      }
      acc[position].push(notification)
      return acc
    },
    {} as Record<NotificationPosition, NotificationProps[]>,
  )

  const showNotification = useCallback((notification: Omit<NotificationProps, "id" | "index">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    }

    setNotifications((prev) => [...prev, newNotification])

    if (newNotification.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        hideNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}

      {Object.entries(groupedNotifications).map(([position, notifs]) => (
        <NotificationContainer
          key={position}
          position={position as NotificationPosition}
          notifications={notifs}
          onClose={hideNotification}
        />
      ))}
    </NotificationContext.Provider>
  )
}

