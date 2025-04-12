"use client"

import { useState, useContext, createContext, ReactNode } from "react";
import { handleUpdateUserData } from "@/controllers/WebSocketController";
import { type User, useUserData } from "../auth/useUserData";

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

let globalSocket: WebSocket | null = null;

interface WebSocketMessage<T> {
  type: string;
  payload: T;
}

interface UpdateUserDataPayLoad {
  users: User;
}

interface WebSocketContextType {
  sendMessage: <T,>(type: string, payload: T) => void;
  lastMessage: WebSocketMessage<unknown> | null;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { setUser } = useUserData();
  const [lastMessage, setLastMessage] = useState<WebSocketMessage<unknown> | null>(null);

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
        setLastMessage(data);

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

  const sendMessage = <T,>(type: string, payload: T) => {
    if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<T> = { type, payload };
      globalSocket.send(JSON.stringify(message));
    } else {
      console.warn("No se puede enviar el mensaje, WebSocket no conectado.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ lastMessage, sendMessage }}>{children}</WebSocketContext.Provider>
  );
};

export const useWebSocket = (): { 
  lastMessage: WebSocketMessage<unknown> | null;
  sendMessage: <T,>(type: string, payload: T) => void;
} => {
  const context = useContext(WebSocketContext);
  if (!context) {
      throw new Error("useWebSocketv2 debe estar dentro de un WebSocketProvider");
  }
  return context;
};