import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

type IssueCardProps = {
    issueTitle: string;
    issueTags: Record<string, string>;
    onClick: () => void;
};

export function IssueCard({ issueTitle, issueTags, onClick }: IssueCardProps) {
    return (
        <Card
            onClick={onClick}
            className="hover: cursor-pointer hover:bg-slate-100"
        >
            <CardContent>
                <h3 className="text-lg font-medium">{issueTitle}</h3>
                <p className="text-sm text-muted-foreground"></p>
                <div className="flex items-center gap-2 mt-2">
                    {Object.entries(issueTags).map(([tagCategory, tag]) => (
                        <Badge
                            key={`${issueTitle}-${tag}-tag`}
                            variant="outline"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
                Last Edited by John Doe on 2023-07-01
            </CardFooter>
        </Card>
    );
}
