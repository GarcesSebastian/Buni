import { Scenery } from "@/types/Events";
import { useState } from "react";
import Cookies from "js-cookie";

const useScenery = () => {
    const [scenery, setScenery] = useState<Scenery[]>([]);

    const getScenery = async () => {  
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenery`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();

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
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenery`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(scenery)
            });
            const data = await response.json();

            if (response.ok) {  
                setScenery(data);
                return data;
            }

            throw new Error(data.error || 'Error al crear el escenario');
        } catch (error) {
            throw error;
        }
    }

    const updateScenery = async (scenery: Scenery) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenery/${scenery.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(scenery)
            });
            const data = await response.json();
            setScenery(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteScenery = async (sceneryId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenery/${sceneryId}`, {
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

    return { scenery, getScenery, createScenery, updateScenery, deleteScenery };
}

export default useScenery;