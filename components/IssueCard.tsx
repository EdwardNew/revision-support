import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    DotsVerticalIcon,
    TrashIcon,
    Pencil2Icon,
    CheckCircledIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import type { Issue } from "@/app/page";

type IssueCardProps = {
    issue: Issue;
};

export function IssueCard({ issue }: IssueCardProps) {
    return (
        <Card
            id={issue.title}
            onClick={() => {
                // setCurrentIssue(issue);

                const highlight = document.evaluate(
                    issue.highlight.startElementXPath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE
                )?.singleNodeValue?.childNodes[0]?.parentElement;
                if (highlight) {
                    highlight.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            }}
            className="hover: cursor-pointer hover:bg-slate-100"
        >
            <CardContent>
                <div className="flex justify-between">
                    <h3 className="font-medium mt-2">{issue.title}</h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-slate-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="sr-only">Open menu</span>
                                <DotsVerticalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Pencil2Icon className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                            >
                                <CheckCircledIcon className="w-4 h-4 mr-2" />
                                Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                            >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="text-muted-foreground bg-yellow-200 inline text-xs">
                    {`"${issue.highlight.text}"`}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    {Object.entries(issue.tags).map(([tagCategory, tag]) => (
                        <Badge
                            key={`${issue.title}-${tag}-tag`}
                            variant="outline"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
                Last Edited at {issue.timestamp}
            </CardFooter>
        </Card>
    );
}
