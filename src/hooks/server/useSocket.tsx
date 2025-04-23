"use client"

import { io, Socket } from "socket.io-client";
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { handleUpdateUserData, handleUpdateEventForm } from "@/controllers/socket.controller";
import { User, useUserData } from "@/hooks/auth/useUserData";
import { useAuth } from "../auth/useAuth";
import Cookies from "js-cookie";


interface SocketContextType {
    socket: Socket | null;
    setSocket: (socket: Socket | null) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error("useSocket must be used within a SocketProvider");
    return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { setUser } = useUserData();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
        });

        newSocket.on("connect", () => {
            console.log("connected to socket");
        });

        newSocket.on("disconnect", () => {
            console.log("disconnected from socket");
        });
        
        newSocket.on("error", (error) => {
            console.error("socket error", error);
        });

        newSocket.on("UPDATE_DATA", (data) => {
            handleUpdateUserData(data, setUser);
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
        if (isAuthenticated) {
            socket?.emit("client_connected", { token: Cookies.get("token") });
        }
    }, [socket, isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
