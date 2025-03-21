import { useState, useEffect } from "react";
import { handleUserConnected, handleCustomMessage, handleUpdateUserData } from "@/controllers/WebSocketController";
import { type User, useUserData } from "../useUserData";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

let globalSocket: WebSocket | null = null;

interface WebSocketMessage<T> {
  type: string;
  payload: T;
}

interface UserConnectedPayload {
  username: string;
  message: string;
}

interface CustomMessagePayload {
  content: string;
}

interface UpdateUserDataPayLoad {
  users: User;
}

export function useWebSocket() {
  const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);
  const { setUser } = useUserData();

  useEffect(() => {
    if (!WEBSOCKET_URL) {
      console.error("WebSocket URL no definida.");
      return;
    }

    if (!globalSocket || globalSocket.readyState === WebSocket.CLOSED) {
      globalSocket = new WebSocket(WEBSOCKET_URL);

      globalSocket.onopen = () => console.log("Conectado al WebSocket");

      globalSocket.onmessage = (event) => {
        try {
          const data: WebSocketMessage<unknown> = JSON.parse(event.data);
          console.log("Mensaje recibido:", data);

          switch (data.type) {
            case "USER_CONNECTED":
              handleUserConnected(data.payload as UserConnectedPayload, setNotifications);
              break;
            case "CUSTOM_MESSAGE":
              handleCustomMessage(data.payload as CustomMessagePayload, setNotifications);
              break;
            case "UPDATE_DATA":
              handleUpdateUserData(data.payload as UpdateUserDataPayLoad, setUser);
              break;
            default:
              console.warn("Tipo de mensaje desconocido:", data);
          }
        } catch (error) {
          console.error("Error al procesar el mensaje:", error);
        }
      };

      globalSocket.onerror = (error) => console.error("Error en WebSocket:", error);
      globalSocket.onclose = () => console.log("Conexión WebSocket cerrada");
    }

    return () => {
      console.log("useWebSocket desmontado, pero la conexión sigue activa");
    };
  }, []);

  const sendMessage = <T,>(type: string, payload: T) => {
    if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<T> = { type, payload };
      globalSocket.send(JSON.stringify(message));
    } else {
      console.warn("No se puede enviar el mensaje, WebSocket no conectado.");
    }
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return { notifications, removeNotification, sendMessage };
}
