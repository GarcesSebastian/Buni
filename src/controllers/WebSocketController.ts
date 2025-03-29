import { User } from "@/hooks/auth/useUserData";

interface UpdateUserDataPayLoad {
  users: User;
}

export function handleUpdateUserData(data: UpdateUserDataPayLoad, setUser: (users: User) => void) {
    setUser(data.users)
}