import { User } from "@/hooks/useUserData";

interface UpdateUserDataPayLoad {
  users: User;
}

export function handleUpdateUserData(data: UpdateUserDataPayLoad, setUser: (users: User) => void) {
    setUser(data.users)
}