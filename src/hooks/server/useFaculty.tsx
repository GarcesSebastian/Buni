import { Programs } from "@/types/Programs";
import { useState } from "react";
import Cookies from "js-cookie";

const usePrograms = () => {
    const [programs, setPrograms] = useState<Programs[]>([]);

    const getPrograms = async () => {  
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                setPrograms([]);
                return;
            }

            setPrograms(data);
        } catch (error) {
            console.error(error);
            setPrograms([]);
        }
    }

    const createPrograms = async (programs: Programs) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(programs)
            });
            const data = await response.json();

            if (response.ok) {  
                setPrograms(data);
                return data;
            }

            throw new Error(data.error || 'Error al crear el programa');
        } catch (error) {
            throw error;
        }
    }

    const updatePrograms = async (programs: Programs) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${programs.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(programs)
            });
            const data = await response.json();
            setPrograms(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deletePrograms = async (programsId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${programsId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { programs, getPrograms, createPrograms, updatePrograms, deletePrograms };
}

export default usePrograms;