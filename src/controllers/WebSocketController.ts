import { User } from "@/hooks/useUserData";

type NotificationSetter = React.Dispatch<React.SetStateAction<{ id: number; message: string }[]>>;

interface UserConnectedPayload {
  username: string;
  message: string;
}

interface CustomMessagePayload {
  content: string;
}

interface UpdateUserDataPayLoad {
  users: User;
}

export function handleUserConnected(data: UserConnectedPayload, setNotifications: NotificationSetter) {
  setNotifications((prev) => [
    ...prev,
    { id: Date.now(), message: data.message },
  ]);
}

export function handleCustomMessage(data: CustomMessagePayload, setNotifications: NotificationSetter) {
  setNotifications((prev) => [
    ...prev,
    { id: Date.now(), message: `Nuevo mensaje: ${data.content}` },
  ]);
}

export function handleUpdateUserData(data: UpdateUserDataPayLoad, setUser: (users: User) => void) {
    setUser(data.users)
}