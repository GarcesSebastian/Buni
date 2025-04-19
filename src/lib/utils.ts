import { User } from "@/hooks/auth/useUserData"

export const generateUniqueName = (user: User, baseName: string) => {
    const existingNames = user.forms.map(form => form.name)
    let counter = 1
    let newName = `${baseName} ${counter}`

    while (existingNames.includes(newName)) {
      counter++
      newName = `${baseName} ${counter}`
    }

    return newName
}