import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
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
    CheckIcon,
    CheckCircledIcon,
    CrossCircledIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import { BASE_URL } from "@/components/PanelManager";
import type { Issue } from "@/components/PanelManager";
import { gptResponseMap } from "./NewNoteForm";

import { DeleteIssueDialog } from "@/components/DeleteIssueDialog";
import { useState } from "react";

type IssueCardProps = {
    issue: Issue;
    issuesId: string;
    setAllIssues: React.Dispatch<React.SetStateAction<Array<Issue>>>;
};

export function IssueCard({ issue, issuesId, setAllIssues }: IssueCardProps) {
    const [showDeleteIssue, setShowDeleteIssue] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>(issue.comment);
    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <>
            <Card
                id={issue._id}
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
                className="hover: cursor-pointer hover:bg-slate-100 p-1 rounded-md"
            >
                <CardHeader className="p-2">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-yellow-200 h-full min-w-1"></span>
                                <p className="text-muted-foreground text-xs mr-8 line-clamp-3">
                                    {`"${issue.highlight.text}"`}
                                </p>
                            </div>
                            {issue.gptResponse && issue.gptResponseType && (
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`${
                                            issue.gptResponseType
                                                ? gptResponseMap[
                                                      issue.gptResponseType
                                                  ].bg
                                                : ""
                                        } h-full min-w-1 bg-opacity-60`}
                                    ></span>
                                    {typeof issue.gptResponse === "string" ? (
                                        <p
                                            className={`
                                            ${
                                                showMore ? "" : "line-clamp-2"
                                            } text-muted-foreground text-xs
                                        `}
                                        >
                                            {issue.gptResponse}
                                        </p>
                                    ) : (
                                        <ul
                                            className={`text-muted-foreground text-xs mr-8 ${
                                                showMore
                                                    ? "list-disc list-inside"
                                                    : ""
                                            }`}
                                        >
                                            {Object.entries(
                                                issue.gptResponse
                                            ).map(
                                                ([header, strategy], index) => {
                                                    return (
                                                        <li
                                                            key={`GPT-strategy-${index}`}
                                                            className={`
                     ${showMore ? "" : "line-clamp-2"} pt-1
                 `}
                                                        >
                                                            <em className="font-semibold not-italic">
                                                                {`${header}: `}
                                                            </em>
                                                            {strategy}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-slate-200 -mr-2 -mt-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* <span className="sr-only">
                                        Open menu
                                    </span> */}
                                    <DotsVerticalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowEdit(true);
                                    }}
                                >
                                    <Pencil2Icon className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <CheckIcon className="w-4 h-4 mr-2" />
                                    Resolve
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteIssue(true);
                                    }}
                                    className="hover:text-red-400"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-2">
                    {showEdit ? (
                        <div className="flex items-center gap-10">
                            <Textarea
                                value={newComment}
                                onChange={(e) => {
                                    setNewComment(e.target.value);
                                }}
                            />
                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className=" text-muted-foreground"
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        setShowEdit(false);
                                    }}
                                >
                                    <CrossCircledIcon className="w-6 h-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-green-600 text-green-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAllIssues((prevIssues) => {
                                            const updatedIssues =
                                                prevIssues.map((prevIssue) => {
                                                    if (
                                                        prevIssue._id ===
                                                        issue._id
                                                    ) {
                                                        return {
                                                            ...prevIssue,
                                                            comment: newComment,
                                                        };
                                                    }
                                                    return prevIssue;
                                                });
                                            fetch(
                                                `${BASE_URL}/issues/${issuesId}/${issue._id}`,
                                                {
                                                    method: "PATCH",
                                                    body: JSON.stringify(
                                                        newComment
                                                    ),
                                                }
                                            );
                                            return updatedIssues;
                                        });
                                        setShowEdit(false);
                                    }}
                                >
                                    <CheckCircledIcon className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm font-medium pl-1">
                            {issue.comment}
                        </p>
                    )}

                    {/* <div className="flex items-center gap-2 mt-2">
                        {Object.entries(issue.tags).map(
                            ([tagCategory, tag]) => (
                                <Badge
                                    key={`${issue._id}-${tag}-tag`}
                                    variant="outline"
                                    className="font-normal"
                                >
                                    {tag}
                                </Badge>
                            )
                        )}
                    </div> */}
                </CardContent>
                {issue.gptResponse && issue.gptResponseType && (
                    <CardFooter className="p-2 pt-0 flex justify-end">
                        {showMore ? (
                            <Button
                                variant="link"
                                className="p-0 pl-1 text-xs text-muted-foreground h-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMore(false);
                                }}
                            >
                                show less
                            </Button>
                        ) : (
                            <Button
                                variant="link"
                                className="p-0 pl-1 text-xs text-muted-foreground h-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMore(true);
                                }}
                            >
                                show more
                            </Button>
                        )}
                    </CardFooter>
                )}
            </Card>

            {showDeleteIssue && (
                <DeleteIssueDialog
                    issuesId={issuesId}
                    noteId={issue._id}
                    setShowDeleteIssue={setShowDeleteIssue}
                    setAllIssues={setAllIssues}
                />
            )}
        </>
    );
}
