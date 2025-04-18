import { Faculty } from "@/types/Faculty";
import { useState } from "react";
import Cookies from "js-cookie";

const useFaculty = () => {
    const [faculty, setFaculty] = useState<Faculty[]>([]);

    const getFaculty = async () => {  
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faculty`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                setFaculty([]);
                return;
            }

            setFaculty(data);
        } catch (error) {
            console.error(error);
            setFaculty([]);
        }
    }

    const createFaculty = async (faculty: Faculty) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faculty`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(faculty)
            });
            const data = await response.json();

            if (response.ok) {  
                setFaculty(data);
                return data;
            }

            throw new Error(data.error || 'Error al crear el facultad');
        } catch (error) {
            throw error;
        }
    }

    const updateFaculty = async (faculty: Faculty) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faculty/${faculty.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify(faculty)
            });
            const data = await response.json();
            setFaculty(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteFaculty = async (facultyId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faculty/${facultyId}`, {
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

    return { faculty, getFaculty, createFaculty, updateFaculty, deleteFaculty };
}

export default useFaculty;