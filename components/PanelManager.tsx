"use client";

// shadcn imports
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LoaderCircle, Save } from "lucide-react";

// custom components imports
import { UserProfile } from "@/components/UserProfile";
import { IssueCard } from "@/components/IssueCard";
import { Review } from "@/components/Review";
import { ReviewHighlight } from "@/components/ReviewHighlight";
import { ReviewHighlightTooltip } from "@/components/ReviewHighlightTooltip";
import { Tiptap } from "@/components/Tiptap";
// import { DiscussionSection } from "@/components/discussion/DiscussionSection";
// import { DiscussionCard } from "@/components/discussion/DisucssionCard";
// import { DiscussionTextarea } from "@/components/discussion/DiscussionTextarea";

import { useContext, useEffect, useRef, useState } from "react";

import { GptResponseMap } from "@/components/NewNoteForm";
import { UserContext } from "./context/UserContextProvider";
import PDFPanel from "./PDFPanel";

export type Review = {
    reviewer: string;
    content: object;
};

export type Issue = {
    _id: string;
    comment: string;
    gptResponseType?: keyof GptResponseMap;
    gptResponse?: { string: string } | string;
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

export type TodoActionItem = {
    [actionDescription: string]: string[];
};

export type TodoTopic = {
    [topicHeader: string]: TodoActionItem[];
};

// export type DiscussionComment = {
//     content: string;
//     author: string;
//     timestamp: string;
// };

// export const BASE_URL = "https://" + process.env.NEXT_PUBLIC_VERCEL_URL;
export const BASE_URL = "https://revision-support.vercel.app";
// export const BASE_URL = "http://localhost:3000/";

export default function PanelManager() {
    const { papers } = useContext(UserContext);
    const paperId: string = papers[0].toString();

    // get and store peer review data
    const [openreviewPaperId, setOpenreviewPaperId] = useState<string>("");
    const [paperTitle, setPaperTitle] = useState<string>("");
    const [paperAbstract, setPaperAbstract] = useState<string>("");
    const [paperPdfUrl, setPaperPdfUrl] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Array<Review>>([]);
    const [issuesId, setIssuesId] = useState<string>("");
    const [rebuttalId, setRebuttalId] = useState<string>("");

    useEffect(() => {
        fetch(`${BASE_URL}/papers/${paperId}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setOpenreviewPaperId(data.items.paper_id);
                setPaperTitle(data.items.title);
                setPaperAbstract(data.items.abstract);
                setReviews(data.items.reviews);
                setIssuesId(data.items.issues_id);
                setRebuttalId(data.items.rebuttal_id);
            });
    }, []);

    useEffect(() => {
        if (!openreviewPaperId) {
            return;
        }
        fetch(`${BASE_URL}/get_pdf?paper=${openreviewPaperId}`)
            .then((res) => res.blob())
            .then((blob) => {
                setPaperPdfUrl(URL.createObjectURL(blob));
            });
    }, [openreviewPaperId]);

    // get and store issues; filter issues by selected tag filters
    const [selectedTags, setSelectedTags] = useState<Tags>({
        reviewer: [],
        type: [],
        status: [],
    });

    const [allIssues, setAllIssues] = useState<Array<Issue>>([]);
    const [filteredIssues, setFilteredIssues] = useState<Array<Issue>>([]);
    const [todoListIssueIds, setTodoListIssueIds] = useState<Array<string>>([]);

    useEffect(() => {
        if (!issuesId) {
            return;
        }
        fetch(`${BASE_URL}/issues/${issuesId}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setAllIssues(data.items.notes);
            });
    }, [issuesId]);

    useEffect(() => {
        if (!rebuttalId) {
            return;
        }
        fetch(`${BASE_URL}/rebuttals/${rebuttalId}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("rebuttal data", data);
                setTodoList(data.items.todos);
                setOutline(data.items.outline);
            });
    }, [rebuttalId]);

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

    useEffect(() => {
        const filteredIssues = allIssues.filter((issue) =>
            todoListIssueIds.includes(issue._id)
        );
        setFilteredIssues(filteredIssues);
    }, [todoListIssueIds]);

    const [todoList, setTodoList] = useState();
    const [outline, setOutline] = useState();
    const [loadingTodoList, setLoadingTodoList] = useState<boolean>(false);
    const [loadingOutline, setLoadingOutline] = useState<boolean>(false);

    async function generateTodoList() {
        setLoadingTodoList(true);
        const allNotes = allIssues.map((issue) => ({
            id: issue._id,
            note: issue.comment,
            reviewContext: issue.highlight.text,
        }));
        const requestBody = {
            paperTitle: paperTitle,
            paperAbstract: paperAbstract,
            // allReviews: reviews,
            allNotes: allNotes,
        };

        console.log(requestBody);

        const response = await fetch(`${BASE_URL}/gpt/summary`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const summary = await response.json();

        console.log(summary);

        setTodoList(JSON.parse(summary));
        setLoadingTodoList(false);

        fetch(`${BASE_URL}/rebuttals/${rebuttalId}/todos`, {
            method: "PATCH",
            body: summary,
        });
    }

    useEffect(() => {
        console.log("todo list: ", todoList);
    }, [todoList]);

    useEffect(() => {
        console.log("outline: ", outline);
    }, [outline]);

    async function generateOutline() {
        setLoadingOutline(true);
        const allNotes = allIssues.map((issue) => ({
            id: issue._id,
            note: issue.comment,
            reviewContext: issue.highlight.text,
        }));
        const requestBody = {
            paperTitle: paperTitle,
            paperAbstract: paperAbstract,
            allNotes: allNotes,
            todoList: todoList,
        };

        console.log(requestBody);

        const response = await fetch(`${BASE_URL}/gpt/outline`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const outline = await response.json();

        console.log("outline: ", outline);

        setOutline(JSON.parse(outline));
        setLoadingOutline(false);

        fetch(`${BASE_URL}/rebuttals/${rebuttalId}/outline`, {
            method: "PATCH",
            body: outline,
        });
    }

    async function saveTodoList() {
        console.log("saving todo list!", todoList);
        fetch(`${BASE_URL}/rebuttals/${rebuttalId}/todos`, {
            method: "PATCH",
            body: JSON.stringify(todoList),
        });
    }

    async function saveOutline() {
        console.log(outline);
        fetch(`${BASE_URL}/rebuttals/${rebuttalId}/outline`, {
            method: "PATCH",
            body: JSON.stringify(outline),
        });
    }

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
                    console.log("Element not found:", {
                        startElement,
                        endElement,
                    });
                    return;
                }

                newRange.setStart(startElement, highlight.startOffset);
                newRange.setEnd(endElement, highlight.endOffset);

                console.log("handle resize run!");

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
                                .getElementById("scroll-container")
                                ?.children[1]?.getBoundingClientRect().width;
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
    const panelActiveClass = "bg-slate-200";

    const { username, treatment } = useContext(UserContext);

    let enableNotesSummary = false;

    if (treatment === "Full-AI") {
        enableNotesSummary = true;
    }

    return (
        <div className="flex flex-col h-screen items-center">
            <div className="flex justify-between p-2 w-1/2 min-w-[450px]">
                <Button
                    variant="outline"
                    className={`rounded-full border-slate-600 ${
                        showPDF ? panelActiveClass : ""
                    }`}
                    onClick={() => {
                        showPDF ? setShowPDF(false) : setShowPDF(true);
                    }}
                >
                    PDF Viewer
                </Button>
                <Button
                    variant="outline"
                    className={`rounded-full border-slate-600 ${
                        showReviews ? panelActiveClass : ""
                    }`}
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
                    className={`rounded-full border-slate-600 ${
                        showNotes ? panelActiveClass : ""
                    }`}
                    onClick={() => {
                        showNotes ? setShowNotes(false) : setShowNotes(true);
                    }}
                >
                    Notes
                </Button>
                <Button
                    variant="outline"
                    className={`rounded-full border-slate-600 ${
                        showRebuttal ? panelActiveClass : ""
                    }`}
                    onClick={() => {
                        showRebuttal
                            ? setShowRebuttal(false)
                            : setShowRebuttal(true);
                    }}
                >
                    Rebuttal
                </Button>
                <UserProfile username={username} />
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="w-full border rounded-lg flex-grow"
            >
                {showPDF && (
                    <>
                        <ResizablePanel
                            id={"pdf"}
                            order={1}
                            defaultSize={30}
                            minSize={20}
                        >
                            <PDFPanel paperPdfUrl={paperPdfUrl} />
                        </ResizablePanel>
                    </>
                )}
                {showReviews && (
                    <>
                        {showPDF && <ResizableHandle withHandle />}
                        <ResizablePanel
                            id={"reviews"}
                            order={2}
                            defaultSize={40}
                            minSize={20}
                            onResize={(size: number) => {
                                setReviewsPanelSize(size);
                            }}
                        >
                            <div className="flex flex-col h-full">
                                <div className=" text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                    Reviews
                                </div>
                                <div className="flex items-center justify-between bg-card rounded-t-lg px-4 py-2 border-b border-muted">
                                    <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
                                        {reviews.length > 0 &&
                                            reviews.map((review) => {
                                                return (
                                                    <Button
                                                        className="text-xs rounded-full border-none shadow-none py-1 px-3 h-5"
                                                        key={`${review.reviewer}-btn`}
                                                        onClick={() => {
                                                            document
                                                                .getElementById(
                                                                    "reviewer-" +
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
                                        reviewPanelSize={reviewsPanelSize}
                                        scrollContainer={
                                            scrollContainer.current
                                        }
                                        issuesId={issuesId}
                                        setAllIssues={setAllIssues}
                                        paperTitle={paperTitle}
                                        paperAbstract={paperAbstract}
                                        reviews={reviews}
                                    />
                                    {reviews.length > 0 &&
                                        reviews.map((review) => {
                                            return (
                                                <Review
                                                    key={review.reviewer}
                                                    reviewer={review.reviewer}
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
                                                    issueId={highlight.issueId}
                                                />
                                            ))
                                        )}
                                </div>
                            </div>
                        </ResizablePanel>
                    </>
                )}

                {showNotes && (
                    <>
                        {(showPDF || showReviews) && (
                            <ResizableHandle withHandle />
                        )}
                        <ResizablePanel
                            id={"notes"}
                            order={3}
                            defaultSize={30}
                            minSize={20}
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center mr-5">
                                    <div className=" text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                        Notes
                                    </div>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setFilteredIssues(allIssues);
                                        }}
                                    >
                                        show all
                                    </Button>
                                </div>

                                {filteredIssues.length === 0 && (
                                    <div className="text-sm mx-auto my-auto">
                                        highlight a snippet in the reviews panel
                                        to add a note
                                    </div>
                                )}

                                <div className="grid gap-4 p-6 overflow-y-auto">
                                    {filteredIssues &&
                                        filteredIssues.map((issue) => (
                                            <IssueCard
                                                key={issue._id}
                                                issue={issue}
                                                issuesId={issuesId}
                                                setAllIssues={setAllIssues}
                                            />
                                        ))}
                                    {enableNotesSummary && (
                                        <Button
                                            onClick={() => {
                                                setShowRebuttal(true);
                                                generateTodoList();
                                            }}
                                        >
                                            Summarize Notes
                                            {loadingTodoList && (
                                                <LoaderCircle className="animate-spin ml-4 w-4 h-4" />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {/* <div className="flex items-center justify-between mb-4 ps-6">
                                    <div className="flex items-center gap-2">
                                        <Searchbar
                                            selectedTags={selectedTags}
                                            setSelectedTags={setSelectedTags}
                                        />
                                    </div>
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
                                </div> */}
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
                        </ResizablePanel>
                    </>
                )}
                {showRebuttal && (
                    <>
                        {(showPDF || showReviews || showNotes) && (
                            <ResizableHandle withHandle />
                        )}
                        <ResizablePanel
                            id={"rebuttal"}
                            order={4}
                            defaultSize={25}
                            minSize={20}
                        >
                            <ResizablePanelGroup direction="vertical">
                                <ResizablePanel
                                    collapsible={true}
                                    minSize={10}
                                    className="h-full"
                                >
                                    <div className="h-full flex flex-col">
                                        <div className="flex justify-between items-center mr-5">
                                            <div className=" text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                                To Do List for Paper Revisions
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    console.log("saving!");
                                                    saveTodoList();
                                                }}
                                                className="border-none shadow-none"
                                            >
                                                <Save className="w-4 h-4 hover:bg-slate-200" />
                                            </Button>
                                        </div>
                                        <div className="flex-1 px-4 overflow-y-auto">
                                            <Tiptap
                                                type="todoList"
                                                rawContent={todoList}
                                                setRawContent={setTodoList}
                                                setFilteredIssues={
                                                    setTodoListIssueIds
                                                }
                                            />
                                            {enableNotesSummary && (
                                                <Button
                                                    onClick={() =>
                                                        generateOutline()
                                                    }
                                                    className="my-4 w-full"
                                                >
                                                    Generate Outline
                                                    {loadingOutline && (
                                                        <LoaderCircle className="animate-spin ml-4 w-4 h-4" />
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle withHandle />
                                <ResizablePanel
                                    collapsible={true}
                                    minSize={10}
                                    className="h-full"
                                >
                                    <div className="h-full flex flex-col">
                                        <div className="flex justify-between items-center mr-5">
                                            <div className=" text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                                                Rebuttal Outline
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    console.log(
                                                        "saving outline!"
                                                    );
                                                    saveOutline();
                                                }}
                                                className="border-none shadow-none"
                                            >
                                                <Save className="w-4 h-4 hover:bg-slate-200" />
                                            </Button>
                                        </div>

                                        <div className="flex-1 px-4 overflow-y-auto">
                                            <Tiptap
                                                type="outline"
                                                rawContent={outline}
                                                setRawContent={setOutline}
                                            />
                                        </div>
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
}
