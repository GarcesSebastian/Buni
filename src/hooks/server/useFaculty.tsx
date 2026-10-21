import { Programs } from "@/types/Programs";
import { useState } from "react";
import { apiFetch, unwrap, type Envelope } from "@/lib/api/client";

const usePrograms = () => {
    const [programs, setPrograms] = useState<Programs[]>([]);

    const getPrograms = async () => {
        try {
            const data = await apiFetch<Programs[]>("/programs");

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
        const data = await apiFetch<Envelope<Programs>>("/programs", {
            method: "POST",
            body: JSON.stringify(programs),
        });
        return unwrap(data);
    }

    const updatePrograms = async (programs: Programs) => {
        try {
            const data = await apiFetch<Envelope<Programs>>(`/programs/${programs.id}`, {
                method: "PUT",
                body: JSON.stringify(programs),
            });
            return unwrap(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deletePrograms = async (programsId: string) => {
        try {
            const data = await apiFetch<unknown>(`/programs/${programsId}`, {
                method: "DELETE",
            });
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { programs, getPrograms, createPrograms, updatePrograms, deletePrograms };
}

export default usePrograms;
