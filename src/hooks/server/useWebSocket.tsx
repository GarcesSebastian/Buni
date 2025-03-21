import { useEffect } from "react";
import { handleUpdateUserData } from "@/controllers/WebSocketController";
import { type User, useUserData } from "../useUserData";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

let globalSocket: WebSocket | null = null;

interface WebSocketMessage<T> {
  type: string;
  payload: T;
}

interface UpdateUserDataPayLoad {
  users: User;
}

export function useWebSocket() {
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

  return { sendMessage };
}
