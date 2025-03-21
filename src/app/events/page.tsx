"use client";
import React, { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import { TableGeneric } from "@/components/services/TableGeneric";
import { configEvent, configFormEvent, tableEvent } from "@/config/Events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import Notification from "@/components/ui/Notification";
import { AnimatePresence } from "framer-motion";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EventosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!WEBSOCKET_URL) {
      console.error("WebSocket URL no definida en las variables de entorno.");
      return;
    }

    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log("Conectado al WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Mensaje recibido:", data);

        if (data.type === "new_connection") {
          setNotifications((prev) => [
            ...prev,
            { id: Date.now(), message: "Nuevo usuario conectado" },
          ]);
        }

        if (data.users) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Conexión WebSocket cerrada");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!API_URL) {
      console.error("API URL no definida en las variables de entorno.");
      setError("No se pudo cargar la API");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users/get`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

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
    </div>
  );
}
