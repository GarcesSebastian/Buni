import { Scenery } from "@/types/Events";
import { useState } from "react";
import { apiFetch, unwrap, type Envelope } from "@/lib/api/client";

const useScenery = () => {
    const [scenery, setScenery] = useState<Scenery[]>([]);

    const getScenery = async () => {
        try {
            const data = await apiFetch<Scenery[]>("/scenery");

            if (!data || !Array.isArray(data)) {
                setScenery([]);
                return;
            }

            setScenery(data);
        } catch (error) {
            console.error(error);
            setScenery([]);
        }
    }

    const createScenery = async (scenery: Scenery) => {
        const data = await apiFetch<Envelope<Scenery>>("/scenery", {
            method: "POST",
            body: JSON.stringify(scenery),
        });
        return unwrap(data);
    }

    const updateScenery = async (scenery: Scenery) => {
        try {
            const data = await apiFetch<Envelope<Scenery>>(`/scenery/${scenery.id}`, {
                method: "PUT",
                body: JSON.stringify(scenery),
            });
            return unwrap(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteScenery = async (sceneryId: string) => {
        try {
            const data = await apiFetch<unknown>(`/scenery/${sceneryId}`, {
                method: "DELETE",
            });
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { scenery, getScenery, createScenery, updateScenery, deleteScenery };
}

export default useScenery;
