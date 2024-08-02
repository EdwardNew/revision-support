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

import { Pdf } from "@/components/pdf/Pdf";
import { Sidebar } from "@/components/pdf/Sidebar";
import { Searchbar } from "@/components/Searchbar";

import type { IHighlight } from "react-pdf-highlighter";

import { useEffect, useState } from "react";

import Markdown from "react-markdown";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

type Review = {
    reviewer: string;
    content: object;
};

type Issue = {
    title: string;
    tags: {
        reviewer: string;
        type: string;
        status: string;
    };
};

export default function Page() {
    const [highlights, setHighlights] = useState<Array<IHighlight>>([]);

    const [reviews, setReviews] = useState<Array<Review>>([]);
    const [issues, setIssues] = useState<Array<Issue>>([]);

    useEffect(() => {
        fetch("http://localhost:8000/papers")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setReviews(data[0].reviews);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:8000/issues")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setIssues(data);
            });
    }, []);

    return (
        <div className="flex h-screen">
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
                        <div className="flex-1 p-4 overflow-auto">
                            {reviews.length > 0 &&
                                reviews.map((review) => {
                                    return (
                                        <Card
                                            key={review.reviewer}
                                            className="p-4 mx-2 my-6"
                                        >
                                            {Object.entries(review.content).map(
                                                ([key, value]) => {
                                                    return (
                                                        <div
                                                            key={key}
                                                            className="text-sm"
                                                        >
                                                            <p className="text-red-800 font-bold mt-1.5 mb-0.5">
                                                                {key}
                                                            </p>
                                                            <p>
                                                                {JSON.stringify(
                                                                    value
                                                                )
                                                                    .replaceAll(
                                                                        '\\"',
                                                                        '"'
                                                                    )
                                                                    .replaceAll(
                                                                        '"',
                                                                        ""
                                                                    )
                                                                    .split(
                                                                        "\\n"
                                                                    )
                                                                    .map(
                                                                        (
                                                                            line
                                                                        ) => {
                                                                            return (
                                                                                <p
                                                                                    key={
                                                                                        line
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        line
                                                                                    }
                                                                                </p>
                                                                            );
                                                                        }
                                                                    )}
                                                            </p>
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
                            <div className="flex items-center gap-2">
                                <Searchbar />
                            </div>
                        </div>
                        <div className="grid gap-4 p-6">
                            {issues &&
                                issues.map((issue) => (
                                    <Card key={issue.title}>
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
                                ))}
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
