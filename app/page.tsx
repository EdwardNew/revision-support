"use client";

// shadcn imports
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// custom components imports
import { Pdf } from "@/components/pdf/Pdf";
import { Sidebar } from "@/components/pdf/Sidebar";
import { Searchbar } from "@/components/Searchbar";
import { ReviewHighlight } from "@/components/ReviewHighlight";
import { ReviewHighlightTooltip } from "@/components/ReviewHighlightTooltip";
import { Review } from "@/components/Review";
import { IssueCard } from "@/components/IssueCard";
// import { DiscussionSection } from "@/components/DiscussionSection";
// import { DiscussionCard } from "@/components/DisucssionCard";
// import { DiscussionTextarea } from "@/components/DiscussionTextarea";

import { useState, useEffect, useRef } from "react";

type Review = {
    reviewer: string;
    content: object;
};

export type Issue = {
    _id: string;
    comment: string;
    tags: {
        reviewer: string;
        type: string;
        status: string;
    };
    timestamp: string;
    highlight: {
        text: string;
        startElementXPath: string;
        endElementXPath: string;
        startOffset: number;
        endOffset: number;
    };
};

export type ReviewHighlight = {
    rects: DOMRect[];
    issueId: string;
};

export type Tag = {
    reviewer: string;
    type: string;
    status: string;
};

export type Tags = {
    reviewer: string[];
    type: string[];
    status: string[];
};

// export type DiscussionComment = {
//     content: string;
//     author: string;
//     timestamp: string;
// };

import type { IHighlight } from "react-pdf-highlighter";

export default function Page() {
    const [pdfHighlights, setPdfHighlights] = useState<Array<IHighlight>>([]);

    // get and store peer review data
    const [reviews, setReviews] = useState<Array<Review>>([]);

    useEffect(() => {
        fetch("http://localhost:3000/papers")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setReviews(data.items[0].reviews);
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
        fetch("http://localhost:3000/issues")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setAllIssues(data.items);
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
    const [reviewsPanelSize, setReviewsPanelSize] = useState<number>(50);
    const scrollContainer = useRef<HTMLElement | null>(null);
    const [reviewHighlights, setReviewHighlights] = useState<
        Array<ReviewHighlight>
    >([]);

    function handleResize(currentIssues: Issue[]) {
        const updatedReviewHighlights = currentIssues
            .map((issue) => {
                const highlight = issue.highlight;
                const newRange = document.createRange();
                const startElement = document.evaluate(
                    highlight.startElementXPath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE
                ).singleNodeValue?.childNodes[0];
                const endElement = document.evaluate(
                    highlight.endElementXPath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE
                ).singleNodeValue?.childNodes[0];

                if (!(startElement && endElement)) {
                    return;
                }

                newRange.setStart(startElement, highlight.startOffset);
                newRange.setEnd(endElement, highlight.endOffset);

                return {
                    issueId: issue._id,
                    rects: Array.from(newRange.getClientRects()).filter(
                        (rect) => {
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
                        }
                    ),
                };
            })
            .filter(
                (highlight): highlight is ReviewHighlight =>
                    highlight !== undefined
            ); // Filters out undefined values;

        setReviewHighlights(updatedReviewHighlights);
    }

    useEffect(() => {
        scrollContainer.current = document.getElementById("scroll-container");
    }, []);

    useEffect(() => {
        handleResize(filteredIssues);

        function onResize() {
            handleResize(filteredIssues);
        }
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, [filteredIssues]);

    useEffect(() => {
        handleResize(filteredIssues);
    }, [reviewsPanelSize]);

    /* discussion panel */
    // const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
    // const [currentComments, setCurrentComments] = useState<
    //     Array<DiscussionComment>
    // >([]);

    // function updateCurrentIssue(issue: Issue) {`
    //     setCurrentIssue(issue);
    // }

    // useEffect(() => {
    //     if (!currentIssue) {
    //         return;
    //     }
    //     setCurrentComments(currentIssue?.discussion);
    // }, [currentIssue]);

    const [showPDF, setShowPDF] = useState<boolean>(true);
    const [showReviews, setShowReviews] = useState<boolean>(true);
    const [showNotes, setShowNotes] = useState<boolean>(true);
    const [showRebuttal, setShowRebuttal] = useState<boolean>(false);
    const panelHiddenClass = "bg-slate-300";

    return (
        <>
            <div className="flex justify-evenly p-5 ">
                <Button
                    variant="outline"
                    className={`${showPDF ? "" : panelHiddenClass}`}
                    onClick={() => {
                        showPDF ? setShowPDF(false) : setShowPDF(true);
                    }}
                >
                    PDF Viewer
                </Button>
                <Button
                    variant="outline"
                    className={`${showReviews ? "" : panelHiddenClass}`}
                    onClick={() => {
                        showReviews
                            ? setShowReviews(false)
                            : setShowReviews(true);
                    }}
                >
                    Reviews
                </Button>
                <Button
                    variant="outline"
                    className={`${showNotes ? "" : panelHiddenClass}`}
                    onClick={() => {
                        showNotes ? setShowNotes(false) : setShowNotes(true);
                    }}
                >
                    Notes
                </Button>
                <Button
                    variant="outline"
                    className={`${showRebuttal ? "" : panelHiddenClass}`}
                    onClick={() => {
                        showRebuttal
                            ? setShowRebuttal(false)
                            : setShowRebuttal(true);
                    }}
                >
                    Rebuttal
                </Button>
            </div>
            <div className="flex h-[600px]">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="w-full border rounded-lg"
                >
                    {showPDF ? (
                        <>
                            <ResizablePanel
                                defaultSize={35}
                                minSize={20}
                                collapsible={true}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                        PDF Viewer
                                    </div>
                                    <div>
                                        <Pdf
                                            highlights={pdfHighlights}
                                            setHighlights={setPdfHighlights}
                                        />
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                        </>
                    ) : (
                        <></>
                    )}
                    {showReviews ? (
                        <>
                            <ResizablePanel
                                defaultSize={40}
                                minSize={20}
                                collapsible={true}
                                onResize={(size) => {
                                    setReviewsPanelSize(size);
                                }}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                        Reviews
                                    </div>
                                    <div className="flex items-center justify-between bg-card rounded-t-lg px-4 py-2 border-b border-muted">
                                        <div className="flex items-center gap-4">
                                            {reviews.length > 0 &&
                                                reviews.map((review) => {
                                                    return (
                                                        <Button
                                                            className="text-xs"
                                                            key={`${review.reviewer}-btn`}
                                                            onClick={() => {
                                                                document
                                                                    .getElementById(
                                                                        review.reviewer
                                                                    )
                                                                    ?.scrollIntoView(
                                                                        {
                                                                            behavior:
                                                                                "smooth",
                                                                        }
                                                                    );
                                                            }}
                                                            variant="outline"
                                                        >
                                                            {review.reviewer}
                                                        </Button>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                    <div
                                        id="scroll-container"
                                        className="flex-1 p-4 overflow-auto relative selection:bg-yellow-200"
                                    >
                                        <div id="scroll-container-top-marker"></div>
                                        <ReviewHighlightTooltip
                                            scrollContainer={
                                                scrollContainer.current
                                            }
                                            setAllIssues={setAllIssues}
                                        />
                                        {reviews.length > 0 &&
                                            reviews.map((review) => {
                                                return (
                                                    <Review
                                                        key={review.reviewer}
                                                        reviewer={
                                                            review.reviewer
                                                        }
                                                        reviewConent={
                                                            review.content
                                                        }
                                                    />
                                                );
                                            })}

                                        {reviewHighlights &&
                                            reviewHighlights.map((highlight) =>
                                                highlight.rects.map((rect) => (
                                                    <ReviewHighlight
                                                        key={`${rect.x}-x-${rect.y}-y`}
                                                        rect={rect}
                                                        issueId={
                                                            highlight.issueId
                                                        }
                                                    />
                                                ))
                                            )}
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                        </>
                    ) : (
                        <></>
                    )}

                    {showNotes ? (
                        <>
                            <ResizablePanel
                                defaultSize={25}
                                minSize={20}
                                collapsible={true}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                        Notes
                                    </div>
                                    <div className="flex items-center justify-between mb-4 ps-6">
                                        <div className="flex items-center gap-2">
                                            <Searchbar
                                                selectedTags={selectedTags}
                                                setSelectedTags={
                                                    setSelectedTags
                                                }
                                            />
                                        </div>
                                        {/* {currentIssue ? (
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
                            )} */}
                                    </div>
                                    <div className="grid gap-4 p-6 overflow-y-auto">
                                        {filteredIssues &&
                                            filteredIssues.map((issue) => (
                                                <IssueCard
                                                    key={issue._id}
                                                    issue={issue}
                                                    setAllIssues={setAllIssues}
                                                />
                                            ))}
                                        {/* {currentIssue ? (
                                <DiscussionSection currentIssue={currentIssue}>
                                    {currentComments.map((comment) => (
                                        <DiscussionCard
                                            key={`${comment.author}-${comment.timestamp}`}
                                            comment={comment}
                                        />
                                    ))}
                                    <DiscussionTextarea
                                        setCurrentComments={setCurrentComments}
                                    />
                                </DiscussionSection>
                            ) : (
                                <>
                                    {filteredIssues &&
                                        filteredIssues.map((issue) => (
                                            <IssueCard
                                                key={issue._id}
                                                issueTitle={issue.title}
                                                issueSelectedText={
                                                    issue.highlight.text
                                                }
                                                issueTags={issue.tags}
                                                onClick={() => {
                                                    // setCurrentIssue(issue);
                                                    const highlight =
                                                        document.evaluate(
                                                            issue.highlight
                                                                .startElementXPath,
                                                            document,
                                                            null,
                                                            XPathResult.FIRST_ORDERED_NODE_TYPE
                                                        )?.singleNodeValue
                                                            ?.childNodes[0]
                                                            ?.parentElement;
                                                    if (highlight) {
                                                        highlight.scrollIntoView(
                                                            {
                                                                behavior:
                                                                    "smooth",
                                                                block: "start",
                                                            }
                                                        );
                                                    }
                                                }}
                                            />
                                        ))}
                                </>
                            )} */}
                                    </div>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                        </>
                    ) : (
                        <></>
                    )}
                    {showRebuttal ? (
                        <>
                            <ResizablePanel
                                defaultSize={25}
                                minSize={20}
                                collapsible={true}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="bg-secondary text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                        Rebuttal Draft
                                    </div>
                                    <div className="flex-1 p-4 overflow-auto mt-20">
                                        <Textarea
                                            placeholder="Type your response here..."
                                            className="w-full min-h-[300px] rounded-md border border-input bg-background p-2 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <div className="flex justify-end mt-4">
                                            <Button>Save</Button>
                                        </div>
                                    </div>
                                </div>
                            </ResizablePanel>
                        </>
                    ) : (
                        <></>
                    )}
                </ResizablePanelGroup>
            </div>
        </>
    );
}
