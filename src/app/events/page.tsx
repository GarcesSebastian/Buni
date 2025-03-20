"use client"
import React, { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import { TableGeneric } from "@/components/services/TableGeneric";
import { configEvent, configFormEvent, tableEvent } from "@/config/Events";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

export default function EventosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://api-buni-production.up.railway.app/users/get");
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

  console.log(users)

  return (
    <div className="flex h-full flex-col">
      <Section>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col">
            <CardTitle>
              {tableEvent.name}
            </CardTitle>
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
                <AlertTriangle className="h-6 w-6 text-primary"/>
                <div className="">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </div>
              </Alert>
            ) : (
              <TableGeneric 
                structure={configEvent} 
                structureForm={configFormEvent} 
                table={tableEvent} 
              />
            )}
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
