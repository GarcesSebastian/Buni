"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface LogoutContextType {
  isLoggingOut: boolean;
  startLogout: (redirectUrl?: string) => void;
  resetLogout: () => void;
}

const LogoutContext = createContext<LogoutContextType | null>(null);

export function LogoutProvider({ children }: { children: ReactNode }) {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>('/');

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout;

    if (isLoggingOut) {
      redirectTimeout = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
    }

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [isLoggingOut, redirectUrl]);

  const startLogout = (url?: string) => {
    if (url) {
      setRedirectUrl(url);
    }
    setIsLoggingOut(true);
  };

  const resetLogout = () => {
    setIsLoggingOut(false);
  };

  return (
    <LogoutContext.Provider value={{ isLoggingOut, startLogout, resetLogout }}>
      {isLoggingOut ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-95">
          <div className="flex flex-col items-center">
            <div className="relative mb-6 flex flex-col items-center">
              <Image
                src={"/logo.png"}
                alt="BUNI Logo"
                width={180}
                height={50}
                className="mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Cerrando sesión
              </h2>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-center max-w-md">
              Estamos finalizando tu sesión.
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </LogoutContext.Provider>
  );
}

export function useLogout() {
  const context = useContext(LogoutContext);
  if (!context) {
    throw new Error('useLogout debe ser usado dentro de un LogoutProvider');
  }
  return context;
}