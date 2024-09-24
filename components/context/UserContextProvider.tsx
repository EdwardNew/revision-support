"use client";
import { createContext, ReactNode, useContext } from "react";

interface UserContextType {
    treatment: "Full-AI" | "Half-AI" | "No-AI";
}

// Create the UserContext with a default value
export const UserContext = createContext<UserContextType>({
    treatment: "Full-AI",
});

interface UserContextProviderProps {
    children: ReactNode;
    treatment: "Full-AI" | "Half-AI" | "No-AI";
}

export function UserContextProvider({
    children,
    treatment,
}: UserContextProviderProps) {
    return (
        <UserContext.Provider value={{ treatment }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook to use the UserContext in components
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        console.log("useUser must be used within a UserProvider");
    }
    return context;
}
