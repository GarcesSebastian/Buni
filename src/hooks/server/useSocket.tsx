"use client"

import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState, createContext, useContext, ReactNode } from "react";
import { handleUpdateUserData, handleUpdateEventForm, handleUpdateUser } from "@/controllers/socket.controller";
import { User, useUserData } from "@/hooks/auth/useUserData";
import { useAuth } from "../auth/useAuth";
import Cookies from "js-cookie";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/contract.generated";

// The typed socket.io client consumes the shared contract (design §6.3): the server emits
// ServerToClientEvents and listens for ClientToServerEvents. Handlers no longer use `any`.
type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
    socket: TypedSocket | null;
    setSocket: (socket: TypedSocket | null) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error("useSocket must be used within a SocketProvider");
    return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<TypedSocket | null>(null);
    const { setUser } = useUserData();
    const { isAuthenticated, setUser: setUserAuth } = useAuth();
    // Guards the client_connected emit so it fires once per authenticated connection (design §6.3, R5).
    const connectedEmittedRef = useRef(false);

    useEffect(() => {
        // Fall back to NEXT_PUBLIC_API_URL when NEXT_PUBLIC_WEBSOCKET_URL is unset to avoid io(undefined) (design §5.5).
        const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? process.env.NEXT_PUBLIC_API_URL;
        if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
            console.warn("NEXT_PUBLIC_WEBSOCKET_URL is not set; falling back to NEXT_PUBLIC_API_URL for the socket connection.");
        }

        const newSocket: TypedSocket = io(socketUrl, {
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            // token_hs (HttpOnly) rides the WebSocket upgrade GET so the handshake can authenticate (design §3.8/§6.3).
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            console.log("connected to socket");
        });

        newSocket.on("disconnect", () => {
            // Re-arm the once-per-connection guard so a reconnection re-emits client_connected.
            connectedEmittedRef.current = false;
            console.log("disconnected from socket");
        });

        // Preserve the existing generic "error" listener (not a typed contract event).
        ;(newSocket as Socket).on("error", (error: unknown) => {
            console.error("socket error", error);
        });

        newSocket.on("UPDATE_DATA", (data) => {
            handleUpdateUserData(data as unknown as User, setUser);
        });

        newSocket.on("UPDATE_USER", (data) => {
            handleUpdateUser(data as unknown as Parameters<typeof handleUpdateUser>[0], setUserAuth);
        });

        newSocket.on("UPDATE_EVENT_FORMS", (data) => {
            handleUpdateEventForm(data, setUser as (user: User | ((prevUser: User) => User)) => void);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && socket && !connectedEmittedRef.current) {
            connectedEmittedRef.current = true;
            socket.emit("client_connected", { token: Cookies.get("token") });
        }
    }, [socket, isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
