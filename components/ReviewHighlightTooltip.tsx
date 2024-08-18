import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef, useCallback } from "react";

import { ReviewHighlight } from "./ReviewHighlight";

import { Issue } from "@/app/page";
// import getXPath from "get-xpath";
import { computeXPath } from "compute-XPath";

type ReviewHighlightTooltipProps = {
    scrollContainer: HTMLElement | null;
    setAllIssues: React.Dispatch<React.SetStateAction<Array<Issue>>>;
};

const emptyIssue = {
    title: "",
    comment: "",
    tags: {
        reviewer: "",
        type: "",
        status: "",
    },
    timestamp: "",
    highlight: {
        text: "",
        startElementXPath: "",
        endElementXPath: "",
        startOffset: 0,
        endOffset: 0,
    },
};

export function ReviewHighlightTooltip({
    scrollContainer,
    setAllIssues,
}: ReviewHighlightTooltipProps) {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newIssue, setNewIssue] = useState<Issue>(emptyIssue);
    const [selection, setSelection] = useState<Range>();
    const [position, setPosition] = useState<Record<string, number>>();

    function selectionInReviews(node: Node | HTMLElement | null) {
        let currentNode = node;

        // Traverse up the DOM tree
        while (currentNode) {
            if (
                currentNode instanceof HTMLElement &&
                currentNode.id.includes("reviewer")
            ) {
                return true; // Found a parent with the specified ID
            }
            currentNode = currentNode.parentElement;
        }

        return false; // No parent with the specified ID found
    }

    function getReviewer(node: Node | HTMLElement | null) {
        let currentNode = node;

        // Traverse up the DOM tree
        while (currentNode) {
            if (
                currentNode instanceof HTMLElement &&
                currentNode.id.includes("reviewer")
            ) {
                return currentNode.id; // Found a parent with the specified ID
            }
            currentNode = currentNode.parentElement;
        }

        return ""; // No parent with the specified ID found
    }

    useEffect(() => {
        function handleMouseUp(e: MouseEvent) {
            const selectedRange = document.getSelection()?.getRangeAt(0);
            if (
                selectedRange &&
                selectedRange.toString().length > 0 &&
                selectionInReviews(e.target as Node)
            ) {
                setSelection(selectedRange);
                const tooltipRect = selectedRange.getBoundingClientRect();
                setPosition({
                    x: tooltipRect.left + tooltipRect.width / 2 - 80 / 2,
                    y:
                        tooltipRect.top -
                        80 +
                        (scrollContainer?.scrollTop ?? 0) -
                        52.8,
                    width: tooltipRect.width,
                    height: tooltipRect.height,
                });
                setShowTooltip(true);
            }
        }

        function handleMouseDown(e: Event) {
            if (!selectionInReviews(e.target as Node)) {
                return;
            }
            setShowTooltip(false);
            setShowForm(false);
            setNewIssue(emptyIssue);
            setSelection(undefined);
        }

        scrollContainer?.addEventListener("selectstart", (e) => {
            handleMouseDown(e);
        });
        scrollContainer?.addEventListener("mouseup", (e) => {
            handleMouseUp(e);
        });

        return () => {
            scrollContainer?.removeEventListener("mousedown", handleMouseDown);
            scrollContainer?.removeEventListener("mouseup", handleMouseUp);
        };
    }, [scrollContainer]);

    function createNewHighlight() {
        if (!selection) {
            console.log("ERROR: SELECTION UNDEFINED");
            return;
        }
        const startElementXPath =
            computeXPath(selection.startContainer.parentElement as Node)?.[0] ||
            "";
        let endElementXPath = startElementXPath;
        if (!selection.startContainer.isEqualNode(selection.endContainer)) {
            endElementXPath =
                computeXPath(
                    selection.endContainer.parentElement as Node
                )?.[0] || "";
        }

        newIssue.highlight = {
            text: selection.toString(),
            startElementXPath: startElementXPath,
            endElementXPath: endElementXPath,
            startOffset: selection.startOffset,
            endOffset: selection.endOffset,
        };

        newIssue.tags.reviewer = getReviewer(selection.startContainer);
        newIssue.tags.status = "not started";
        newIssue.timestamp = new Date().toISOString().slice(0, -5) + "Z";

        setAllIssues((prevIssues) => [...prevIssues, newIssue]);

        setShowForm(false);
    }

    return (
        <>
            {selection &&
                Array.from(selection.getClientRects())
                    .filter((rect) => {
                        // const commonAncestorContainer =
                        //     selection.commonAncestorContainer;
                        // if (commonAncestorContainer instanceof Element) {
                        //     return (
                        //         rect.width !==
                        //         commonAncestorContainer.getBoundingClientRect()
                        //             .width
                        //     );
                        // }
                        // return true;

                        const reviewContainerWidth = document
                            .getElementById("reviewer 1")
                            ?.children[0]?.getBoundingClientRect().width;
                        return rect.width < (reviewContainerWidth ?? 0);
                    })
                    .map((rect) => (
                        <ReviewHighlight
                            key={`${rect.x}-x-${rect.y}-y`}
                            rect={rect}
                            issueId=""
                        />
                    ))}
            {showTooltip && position && (
                <div
                    className="
                    absolute z-10 -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0
                    after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
                  "
                    style={{
                        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    }}
                >
                    <button
                        className="flex w-full h-full justify-between items-center px-2"
                        onClick={() => {
                            setShowForm(true);
                            setShowTooltip(false);
                        }}
                    >
                        <span id="new-issue" className="text-xs">
                            New Issue
                        </span>
                    </button>
                </div>
            )}

            {showForm && position && (
                <div
                    className="bg-background p-4 rounded-md shadow-md absolute z-10"
                    style={{
                        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    }}
                >
                    <form
                        className="grid gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            createNewHighlight();
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    required
                                    id="title"
                                    placeholder="Enter a title"
                                    value={newIssue.title}
                                    onChange={(e) =>
                                        setNewIssue({
                                            ...newIssue,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="comment">Comment</Label>
                                <Textarea
                                    required
                                    id="comment"
                                    placeholder="Enter your comment"
                                    rows={4}
                                    value={newIssue.comment}
                                    onChange={(e) =>
                                        setNewIssue({
                                            ...newIssue,
                                            comment: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid grid-rows-1 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tag2">Type</Label>
                                    <Select
                                        required
                                        name="tag2"
                                        onValueChange={(value) => {
                                            setNewIssue({
                                                ...newIssue,
                                                tags: {
                                                    ...newIssue.tags,
                                                    type: value,
                                                },
                                            });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type of issue" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="novelty">
                                                novelty
                                            </SelectItem>
                                            <SelectItem value="grammar & style">
                                                grammar & style
                                            </SelectItem>
                                            <SelectItem value="technical accuracy">
                                                technical accuracy
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            Save
                        </Button>
                    </form>
                </div>
            )}
        </>
    );
}
