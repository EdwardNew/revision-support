"use client";

// shadcn imports
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

import { ChevronLeftIcon } from "@radix-ui/react-icons";

// custom components imports

import { Pdf } from "@/components/pdf/Pdf";
import { Sidebar } from "@/components/pdf/Sidebar";
import { Searchbar } from "@/components/Searchbar";
import { ReviewHighlight } from "@/components/ReviewHighlight";
import { ReviewHighlightTooltip } from "@/components/ReviewHighlightToolTip";
import { DiscussionSection } from "@/components/DiscussionSection";
import { DiscussionCard } from "@/components/DisucssionCard";

import type { IHighlight } from "react-pdf-highlighter";

import { useState, useEffect, useRef } from "react";

import Markdown from "react-markdown";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Script from "next/script";

type Review = {
    reviewer: string;
    content: object;
};

export type Issue = {
    title: string;
    tags: {
        reviewer: string;
        type: string;
        status: string;
    };
    highlight: {
        text: string;
        rects: Rect[];
        initialScrollPosition: number;
    };
    discussion: discussionComment[];
};

export type discussionComment = {
    content: string;
    author: string;
    timestamp: string;
};

export type Rect = {
    x: number;
    y: number;
    height: number;
    width: number;
};

export type Tags = {
    reviewer: string[];
    type: string[];
    status: string[];
};

export default function Page() {
    const [pdfHighlights, setPdfHighlights] = useState<Array<IHighlight>>([]);

    // get and store peer review data
    const [reviews, setReviews] = useState<Array<Review>>([]);

    useEffect(() => {
        fetch("http://localhost:8000/papers")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setReviews(data[0].reviews);
            });
    }, []);

    // get and store issues; filter issues by selected tag filters
    const [selectedTags, setSelectedTags] = useState<Tags>({
        reviewer: [],
        type: [],
        status: [],
    });

    const [allIssues, setAllIssues] = useState<Array<Issue>>([]);
    const [filteredIssues, setFilteredIssues] = useState<Array<Issue>>([]);

    useEffect(() => {
        fetch("http://localhost:8000/issues")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setAllIssues(data);
            });
    }, []);

    useEffect(() => {
        const allSelectedTags = Object.values(selectedTags).flat();
        if (allSelectedTags.length === 0) {
            setFilteredIssues(allIssues);
        } else {
            const filteredIssues = allIssues.filter((issue) =>
                Object.values(issue.tags).some((tag) =>
                    allSelectedTags.includes(tag)
                )
            );
            setFilteredIssues(filteredIssues);
        }
    }, [selectedTags, allIssues]);

    // handle review highlights
    const [selectionText, setSelectionText] = useState<string>();
    const [position, setPosition] = useState<Record<string, number>>();
    const [selection, setSelection] = useState<Selection>();
    const scrollContainer = useRef<HTMLElement | null>(null);
    const [reviewsScrollPosition, setReviewsScrollPosition] =
        useState<number>(0);

    useEffect(() => {
        scrollContainer.current = document.getElementById("scroll-container");
        // console.log(scrollContainer.current?.scrollTop);
        console.log(scrollContainer.current?.getBoundingClientRect());

        const handleScroll = () => {
            if (scrollContainer.current) {
                // console.log(
                //     "Scroll position:",
                //     scrollContainer.current.scrollTop
                // );
                setReviewsScrollPosition(scrollContainer.current.scrollTop);
            }
        };

        const container = scrollContainer.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        // Clean up the event listener on component unmount
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    function onSelectStart() {
        setSelectionText(undefined);
    }

    function onSelectEnd() {
        const activeSelection = document.getSelection();
        const text = activeSelection?.toString();

        if (!activeSelection || !text) {
            setSelectionText(undefined);
            return;
        }

        setSelection(activeSelection);
        setSelectionText(text);

        const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

        setPosition({
            x: rect.left + rect.width / 2 - 80 / 2,
            y: rect.top + window.scrollY - 30,
            width: rect.width,
            height: rect.height,
        });
    }

    function createNewHighlight() {
        if (!selection) {
            return;
        }
        console.log(selection.getRangeAt(0).getClientRects());

        const comment = prompt("Enter a comment for this highlight:");
        if (!comment) return;

        const selectedRange = selection.getRangeAt(0);
        const text = selectedRange.toString();
        const rects = [...selectedRange.getClientRects()];
        console.log(selectedRange.getClientRects());
        console.log(rects);

        const newIssue = {
            title: comment,
            tags: {
                reviewer: "reviewer 1",
                type: "novelty",
                status: "done",
            },
            highlight: {
                text: text,
                rects: rects,
                initialScrollPosition: reviewsScrollPosition,
            },
        };

        setAllIssues((prevIssues) => [...prevIssues, newIssue]);

        // const range = selection.getRangeAt(0);
        // console.log(range);
        // const mark = document.createElement("mark");
        // mark.classList.add("bg-yellow-200");
        // mark.classList.add("py-px");
        // mark.appendChild(range.extractContents());
        // range.insertNode(mark);

        // // Clear the selection after highlighting
        // setSelectionText(undefined);
        // setSelection(null);
    }

    useEffect(() => {
        document.addEventListener("selectstart", onSelectStart);
        document.addEventListener("mouseup", onSelectEnd);
        return () => {
            document.removeEventListener("selectstart", onSelectStart);
            document.removeEventListener("mouseup", onSelectEnd);
        };
    }, []);

    // discussion panel
    const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
    const [currentComments, setCurrentComments] = useState<
        Array<discussionComment>
    >([]);
    const [newCommentContent, setNewCommentContent] = useState<string>("");

    function updateCurrentIssue(issue: Issue) {
        setCurrentIssue(issue);
    }

    function submitComment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newComment = {
            content: newCommentContent,
            author: "NewCommentAuthor",
            timestamp: new Date().toISOString().slice(0, -5) + "Z",
        };

        setCurrentComments((prevIssues) => [...prevIssues, newComment]);

        setNewCommentContent("");
    }
    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            submitComment(e);
        }
    }

    useEffect(() => {
        console.log(currentIssue);
        if (!currentIssue) {
            return;
        }
        setCurrentComments(currentIssue?.discussion);
    }, [currentIssue]);

    return (
        <div className="flex h-screen overflow-y-hidden">
            <ResizablePanelGroup
                direction="horizontal"
                className="w-full border rounded-lg"
            >
                {/* <ResizablePanel
                    defaultSize={25}
                    minSize={20}
                    collapsible={true}
                >
                    <div className="flex flex-col h-full">
                        <div className="bg-primary text-primary-foreground px-4 py-3 font-medium rounded-t-lg">
                            PDF Viewer
                        </div>
                        <div>
                            <Pdf
                                highlights={highlights}
                                setHighlights={setHighlights}
                            />
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle /> */}
                <ResizablePanel
                    defaultSize={25}
                    minSize={20}
                    collapsible={true}
                >
                    <div className="flex flex-col h-full">
                        <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                            Reviews
                        </div>
                        <div
                            id="scroll-container"
                            className="flex-1 p-4 overflow-auto selection:bg-yellow-200"
                        >
                            {filteredIssues &&
                                filteredIssues.map((issue) =>
                                    issue.highlight.rects.map((rect) => (
                                        <ReviewHighlight
                                            key={`${rect.x}-x-${rect.y}-y`}
                                            rect={rect}
                                            initialScrollPosition={
                                                issue.highlight
                                                    .initialScrollPosition
                                            }
                                            reviewsScrollPosition={
                                                reviewsScrollPosition
                                            }
                                            issue={issue}
                                            onClick={(issue) =>
                                                setCurrentIssue(issue)
                                            }
                                        />
                                    ))
                                )}

                            <ReviewHighlightTooltip
                                selectionText={selectionText}
                                position={position}
                                createNewHighlight={createNewHighlight}
                            />
                            {reviews.length > 0 &&
                                reviews.map((review) => {
                                    return (
                                        <Card
                                            key={review.reviewer}
                                            className="p-4 mx-2 my-6"
                                        >
                                            {Object.entries(review.content).map(
                                                ([section, content]) => {
                                                    return (
                                                        <div
                                                            key={`${review.reviewer}-${section}`}
                                                            className="text-sm"
                                                        >
                                                            <p className="text-red-800 font-bold mt-1.5 mb-0.5">
                                                                {section}
                                                            </p>
                                                            {JSON.stringify(
                                                                content
                                                            )
                                                                .replaceAll(
                                                                    '\\"',
                                                                    '"'
                                                                )
                                                                .replaceAll(
                                                                    '"',
                                                                    ""
                                                                )
                                                                .split("\\n")
                                                                .map(
                                                                    (
                                                                        line,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <p
                                                                                key={`${review.reviewer}-${section}-${index}`}
                                                                            >
                                                                                {
                                                                                    line
                                                                                }
                                                                            </p>
                                                                        );
                                                                    }
                                                                )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={25}
                    minSize={20}
                    collapsible={true}
                >
                    <div className="flex flex-col h-full">
                        <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                            Outline
                        </div>
                        <div className="flex items-center justify-between mb-4 ps-6">
                            {currentIssue ? (
                                <button
                                    className="mt-6"
                                    onClick={() => setCurrentIssue(null)}
                                >
                                    <ChevronLeftIcon />
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Searchbar
                                        selectedTags={selectedTags}
                                        setSelectedTags={setSelectedTags}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="grid gap-4 p-6 overflow-y-auto">
                            {currentIssue ? (
                                <DiscussionSection currentIssue={currentIssue}>
                                    {currentComments.map((comment) => (
                                        <DiscussionCard
                                            key={`${comment.author}-${comment.timestamp}`}
                                            comment={comment}
                                        />
                                    ))}
                                    <div className="mt-4">
                                        <form
                                            className="grid gap-4"
                                            onSubmit={submitComment}
                                            onKeyDown={handleKeyDown}
                                        >
                                            <div className="grid gap-2">
                                                <Label htmlFor="comment">
                                                    Add a comment
                                                </Label>
                                                <Textarea
                                                    id="comment"
                                                    placeholder="Write your comment..."
                                                    className="min-h-[100px]"
                                                    value={newCommentContent}
                                                    onChange={(e) =>
                                                        setNewCommentContent(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full"
                                            >
                                                Post Comment
                                            </Button>
                                        </form>
                                    </div>
                                </DiscussionSection>
                            ) : (
                                <>
                                    {filteredIssues &&
                                        filteredIssues.map((issue) => (
                                            <Card
                                                className="hover: cursor-pointer hover:bg-slate-100"
                                                key={issue.title}
                                                onClick={() => {
                                                    setCurrentIssue(issue);
                                                }}
                                            >
                                                <CardContent>
                                                    <h3 className="text-lg font-medium">
                                                        {issue.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground"></p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {Object.entries(
                                                            issue.tags
                                                        ).map(
                                                            ([
                                                                tagCategory,
                                                                tag,
                                                            ]) => (
                                                                <Badge
                                                                    key={`${issue.title}-${tag}-tag`}
                                                                    variant="outline"
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="text-xs text-muted-foreground">
                                                    Last Edited by John Doe on
                                                    2023-07-01
                                                </CardFooter>
                                            </Card>
                                        ))}
                                </>
                            )}
                            {/* {filteredIssues &&
                                filteredIssues.map((issue) => (
                                    <Card
                                        key={issue.title}
                                        onClick={() => {
                                            setCurrentIssue(issue);
                                        }}
                                    >
                                        <CardContent>
                                            <h3 className="text-lg font-medium">
                                                {issue.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground"></p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {Object.entries(issue.tags).map(
                                                    ([tagCategory, tag]) => (
                                                        <Badge
                                                            key={`${issue.title}-${tag}-tag`}
                                                            variant="outline"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="text-xs text-muted-foreground">
                                            Last Edited by John Doe on
                                            2023-07-01
                                        </CardFooter>
                                    </Card>
                                ))} */}
                        </div>
                    </div>
                </ResizablePanel>
                {/* <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={25}
                    minSize={20}
                    collapsible={true}
                >
                    <div className="flex flex-col h-full">
                        <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                            Rebuttal Draft
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Tag 1</Badge>
                                    <Badge variant="outline">Tag 2</Badge>
                                    <Badge variant="outline">Tag 3</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Author 1
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Author 2
                                    </span>
                                </div>
                            </div>
                            <Textarea
                                placeholder="Type your response here..."
                                className="w-full min-h-[100px] rounded-md border border-input bg-background p-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="flex justify-end mt-4">
                                <Button>Save</Button>
                            </div>
                        </div>
                    </div>
                </ResizablePanel> */}
            </ResizablePanelGroup>
        </div>
    );
}
