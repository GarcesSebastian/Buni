import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export function useFetchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error('Error al obtener usuarios')
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al obtener usuarios')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading, error };
}
