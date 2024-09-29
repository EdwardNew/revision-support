"use client";
import { ObjectId } from "mongodb";
import { createContext, ReactNode, useContext } from "react";

interface UserContextType {
    username: string;
    treatment: "Full-AI" | "Half-AI" | "No-AI";
    papers: Array<ObjectId>;
}

// Create the UserContext with a default value
export const UserContext = createContext<UserContextType>({
    username: "",
    treatment: "Full-AI",
    papers: [],
});

interface UserContextProviderProps {
    children: ReactNode;
    username: string;
    treatment: "Full-AI" | "Half-AI" | "No-AI";
    papers: Array<ObjectId>;
}

export function UserContextProvider({
    children,
    username,
    treatment,
    papers,
}: UserContextProviderProps) {
    return (
        <UserContext.Provider value={{ username, treatment, papers }}>
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
