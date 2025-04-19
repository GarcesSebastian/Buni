"use client";

import { useState } from "react";

export const useUserState = () => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    return { isLoaded, setIsLoaded };
}; 