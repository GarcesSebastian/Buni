import { User } from "@/types/User";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, unwrap, type Envelope } from "@/lib/api/client";

interface RawUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role_id: string;
    created_at: string;
}

const USERS_KEY = ["users"] as const;

const fetchUsers = async (): Promise<User[]> => {
    const data = await apiFetch<RawUser[]>("/users");

    if (!data || !Array.isArray(data)) {
        return [];
    }

    return data.map((user) => ({
        ...user,
        roles: {
            id: user.role_id,
            key: "roles",
        },
    })) as unknown as User[];
};

/**
 * Users hook (design §5.4). TanStack Query drives the users list internally while the
 * public API `{ users, getUsers, createUser, updateUser, deleteUser }` is preserved so
 * consumers keep calling `getUsers()` / `createUser()` unchanged. Real-time behavior is
 * kept: mutations and socket-driven updates invalidate the `['users']` query to rehydrate.
 */
const useUsers = () => {
    const queryClient = useQueryClient();

    const { data: users = [] } = useQuery({
        queryKey: USERS_KEY,
        queryFn: fetchUsers,
        // The list is fetched on demand via getUsers(); do not auto-fetch on mount.
        enabled: false,
    });

    const getUsers = async () => {
        await queryClient.fetchQuery({ queryKey: USERS_KEY, queryFn: fetchUsers });
    };

    const createMutation = useMutation({
        mutationFn: (user: User) =>
            apiFetch<Envelope<User>>("/users", {
                method: "POST",
                body: JSON.stringify(user),
            }),
        // State bug fix (design §5.2): do NOT store the mutation response as the array.
        // Invalidate so the list rehydrates (socket rehydration / refetch), preserving behavior.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_KEY });
        },
    });

    const createUser = async (user: User) => {
        const data = await createMutation.mutateAsync(user);
        return unwrap(data);
    };

    const updateMutation = useMutation({
        mutationFn: (user: User) =>
            apiFetch<Envelope<User>>(`/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify(user),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_KEY });
        },
    });

    const updateUser = async (user: User) => {
        try {
            const data = await updateMutation.mutateAsync(user);
            return unwrap(data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            const data = await apiFetch<unknown>(`/users/${userId}`, {
                method: "DELETE",
            });
            queryClient.invalidateQueries({ queryKey: USERS_KEY });
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { users, getUsers, createUser, updateUser, deleteUser };
};

export default useUsers;
