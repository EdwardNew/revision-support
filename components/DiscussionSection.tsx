import type { Issue } from "@/components/PanelManager";
import { ReactNode } from "react";

type DiscussionSectionProps = {
    currentIssue: Issue;
    children: ReactNode;
};

export function DiscussionSection({
    currentIssue,
    children,
}: DiscussionSectionProps) {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">{currentIssue.title}</h2>
                <p className="text-muted-foreground bg-yellow-200 inline">
                    {`"${currentIssue.highlight.text}"`}
                </p>
            </div>
            {children}
        </div>
    );
}
