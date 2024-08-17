import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

type IssueCardProps = {
    issueTitle: string;
    issueSelectedText: string;
    issueTags: Record<string, string>;
    onClick: () => void;
};

export function IssueCard({
    issueTitle,
    issueSelectedText,
    issueTags,
    onClick,
}: IssueCardProps) {
    return (
        <Card
            onClick={onClick}
            className="hover: cursor-pointer hover:bg-slate-100"
        >
            <CardContent>
                <h3 className="font-medium mt-2">{issueTitle}</h3>
                <p className="text-muted-foreground bg-yellow-200 inline text-xs">
                    {`"${issueSelectedText}"`}
                </p>
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
