"use client";

import { useState, useEffect } from "react";

import { ReviewHighlight } from "./ReviewHighlight";
import { NewNoteForm } from "./NewNoteForm";

import { Issue } from "@/components/PanelManager";

import type { Review } from "@/components/PanelManager";

type ReviewHighlightTooltipProps = {
    reviewPanelSize: number;
    scrollContainer: HTMLElement | null;
    issuesId: string;
    setAllIssues: React.Dispatch<React.SetStateAction<Array<Issue>>>;
    paperTitle: string;
    paperAbstract: string;
    reviews: Array<Review>;
};

export function ReviewHighlightTooltip({
    reviewPanelSize,
    scrollContainer,
    issuesId,
    setAllIssues,
    paperTitle,
    paperAbstract,
    reviews,
}: ReviewHighlightTooltipProps) {
    const [selection, setSelection] = useState<Range>();
    const [showForm, setShowForm] = useState<boolean>(true);
    const [formPosition, setFormPosition] = useState<Record<string, number>>();

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

    useEffect(() => {
        function handleMouseUp(e: MouseEvent) {
            const selectedRange = document.getSelection()?.getRangeAt(0);
            const scrollContainerLeft = document
                .getElementById("scroll-container-top-marker")
                ?.getBoundingClientRect().x;
            if (
                selectedRange &&
                selectedRange.toString().length > 0 &&
                selectionInReviews(e.target as Node)
            ) {
                setSelection(selectedRange);
                const tooltipRect = selectedRange.getBoundingClientRect();
                setFormPosition({
                    x:
                        tooltipRect.left -
                        ((scrollContainerLeft ?? 0) + 16) +
                        tooltipRect.width / 2 -
                        180 / 2,
                    y:
                        tooltipRect.top -
                        (scrollContainer?.getBoundingClientRect().y ?? 0) +
                        tooltipRect.height +
                        (scrollContainer?.scrollTop ?? 0),
                    width: tooltipRect.width,
                    height: tooltipRect.height,
                });
                setShowForm(true);
            }
        }

        function handleMouseDown(e: Event) {
            if (!selectionInReviews(e.target as Node)) {
                return;
            }
            setShowForm(false);
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

    useEffect(() => {
        function onResize() {
            const tooltipRect = selection?.getBoundingClientRect();
            if (!tooltipRect) {
                return;
            }
            const scrollContainerLeft = document
                .getElementById("scroll-container-top-marker")
                ?.getBoundingClientRect().x;
            setFormPosition({
                x:
                    tooltipRect.left -
                    ((scrollContainerLeft ?? 0) + 16) +
                    tooltipRect.width / 2 -
                    180 / 2,
                y:
                    tooltipRect.top -
                    (scrollContainer?.getBoundingClientRect().y ?? 0) +
                    tooltipRect.height +
                    (scrollContainer?.scrollTop ?? 0),
                width: tooltipRect.width,
                height: tooltipRect.height,
            });
        }
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [scrollContainer, selection]);

    useEffect(() => {
        const tooltipRect = selection?.getBoundingClientRect();
        if (!tooltipRect) {
            return;
        }
        const scrollContainerLeft = document
            .getElementById("scroll-container-top-marker")
            ?.getBoundingClientRect().x;
        setFormPosition({
            x:
                tooltipRect.left -
                ((scrollContainerLeft ?? 0) + 16) +
                tooltipRect.width / 2 -
                180 / 2,
            y:
                tooltipRect.top -
                (scrollContainer?.getBoundingClientRect().y ?? 0) +
                tooltipRect.height +
                (scrollContainer?.scrollTop ?? 0),
            width: tooltipRect.width,
            height: tooltipRect.height,
        });
    }, [reviewPanelSize]);

    return (
        <>
            {selection &&
                scrollContainer &&
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

                        const reviewContainerWidth = Math.floor(
                            scrollContainer.children[1]?.children[0]?.getBoundingClientRect()
                                .width ?? 0
                        );

                        return rect.width < (reviewContainerWidth ?? 0);
                    })
                    .map((rect) => (
                        <ReviewHighlight
                            key={`${rect.x}-x-${rect.y}-y`}
                            rect={rect}
                            issueId=""
                        />
                    ))}

            <NewNoteForm
                showForm={showForm}
                setShowForm={setShowForm}
                formPosition={formPosition}
                selection={selection ?? null}
                scrollContainer={scrollContainer}
                issuesId={issuesId}
                setAllIssues={setAllIssues}
                paperTitle={paperTitle}
                paperAbstract={paperAbstract}
                reviews={reviews}
            />
        </>
    );
}
