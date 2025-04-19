"use client";

import { useState } from "react";

export interface States {
    sidebarExpanded?: boolean;
    sidebarOpenItems?: string[];
    isDeviceMobile?: boolean;
    userToggled?: boolean;
}

export const useUserSettings = () => {
    const [states, setStates] = useState<States>({});

    return { states, setStates };
}; 