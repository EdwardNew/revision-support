"use client";
import { ObjectId } from "mongodb";
import { createContext, ReactNode } from "react";

interface PaperContextType {
    issues_id: ObjectId;
    rebuttal_id: ObjectId;
    title: string;
    abstract: string;
    pdf: string;
    paper_id: string;
    reviews: Array<Object>;
}

// Create the PaperContext with a default value
export const PaperContext = createContext<PaperContextType>({
    issues_id: new ObjectId(""),
    rebuttal_id: new ObjectId(""),
    title: "",
    abstract: "",
    pdf: "",
    paper_id: "",
    reviews: [],
});

interface PaperContextProviderProps {
    children: ReactNode;
    issues_id: ObjectId;
    rebuttal_id: ObjectId;
    title: string;
    abstract: string;
    pdf: string;
    paper_id: string;
    reviews: Array<Object>;
}

export function PaperContextProvider({
    children,
    issues_id,
    rebuttal_id,
    title,
    abstract,
    pdf,
    paper_id,
    reviews,
}: PaperContextProviderProps) {
    return (
        <PaperContext.Provider
            value={{
                issues_id,
                rebuttal_id,
                title,
                abstract,
                pdf,
                paper_id,
                reviews,
            }}
        >
            {children}
        </PaperContext.Provider>
    );
}
