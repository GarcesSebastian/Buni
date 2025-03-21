"use client";
import React, { useEffect } from "react";
import Section from "@/components/ui/Section";
import { TableGeneric } from "@/components/services/TableGeneric";
import { configEvent, configFormEvent, tableEvent } from "@/config/Events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import Notification from "@/components/ui/Notification";
import { AnimatePresence } from "framer-motion";
import FloatingUsers from "@/components/ui/FloatingUsers";
import { useFetchUsers } from "@/hooks/server/useUsers";
import { useWebSocket } from "@/hooks/server/useWebSocket";
import { Button } from "@/components/ui/Button";

export default function EventosPage() {
  const { users, loading, error } = useFetchUsers();
  const { notifications, removeNotification, sendMessage } = useWebSocket();

  const handleClick = () => {
    sendMessage("CUSTOM_MESSAGE", { content: "Hi there :3" });
  }

  return (
    <div className="flex h-full flex-col relative">
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {notifications.map((notif) => (
            <Notification
              key={notif.id}
              message={notif.message}
              onClose={() => removeNotification(notif.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <Section>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col">
            <CardTitle>{tableEvent.name}</CardTitle>
            <p className="text-muted-foreground">Listado de {tableEvent.name}</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-3 text-lg font-semibold text-primary">Cargando datos...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="flex items-center gap-4">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <div>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </div>
              </Alert>
            ) : (
              <TableGeneric structure={configEvent} structureForm={configFormEvent} table={tableEvent} />
            )}
          </CardContent>
        </Card>
      </Section>

      <Button 
        className="absolute top-5 right-3 p-3"
        onClick={handleClick}
      >
        Prueba
      </Button>
      <FloatingUsers users={users} />
    </div>
  );
}
