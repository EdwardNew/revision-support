import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { LoaderCircle, Sparkles } from "lucide-react";

import { useState, useEffect, useRef, useContext } from "react";
import { computeXPath } from "compute-xpath";

import { BASE_URL } from "@/components/PanelManager";
import type { Issue } from "@/components/PanelManager";

type EmptyIssue = {
    comment: string;
    gptResponseType?: keyof GptResponseMap;
    gptResponse?: { string: string } | string | null;
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

const emptyIssue = {
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

export type GptResponseMap = {
    strategize: {
        text: string;
        textColor: string;
        bg: string;
    };
    reflect: {
        text: string;
        textColor: string;
        bg: string;
    };
    explain: {
        text: string;
        textColor: string;
        bg: string;
    };
};

export const gptResponseMap: GptResponseMap = {
    strategize: {
        text: "Strategies to consider:",
        textColor: "text-violet-600",
        bg: "bg-violet-600",
    },
    reflect: {
        text: "Questions:",
        textColor: "text-green-600",
        bg: "bg-green-600",
    },
    explain: {
        text: "",
        textColor: "text-pink-500",
        bg: "bg-pink-500",
    },
};

import type { Review } from "@/components/PanelManager";
import { UserContext } from "./context/UserContextProvider";

type NewNoteFormProps = {
    showForm: boolean;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    formPosition: Record<string, number> | undefined;
    selection: Range | null;
    scrollContainer: HTMLElement | null;
    issuesId: string;
    setAllIssues: React.Dispatch<React.SetStateAction<Array<Issue>>>;
    paperTitle: string;
    paperAbstract: string;
    reviews: Array<Review>;
};

export function NewNoteForm({
    showForm,
    setShowForm,
    formPosition,
    selection,
    issuesId,
    setAllIssues,
    paperTitle,
    paperAbstract,
    reviews,
}: NewNoteFormProps) {
    const [newIssue, setNewIssue] = useState<Issue | EmptyIssue>(emptyIssue);
    const [gptResponse, setGptResponse] = useState<
        { string: string } | string | null
    >(null);
    const [gptResponseType, setGptResponseType] = useState<
        keyof GptResponseMap | null
    >(null);
    const [loadingResponseType, setLoadingResponseType] = useState<
        keyof GptResponseMap | null
    >(null);
    const noteTextarea = useRef<HTMLTextAreaElement>(null);

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
        if (gptResponse && gptResponseType) {
            newIssue.gptResponse = gptResponse;
            newIssue.gptResponseType = gptResponseType;
        }

        fetch(`${BASE_URL}/issues/${issuesId}`, {
            method: "POST",
            body: JSON.stringify(newIssue),
        })
            .then((res) => {
                return res.json();
            })
            .then((body) => {
                (newIssue as Issue)._id = body.newNoteId;
                setAllIssues((prevIssues) => {
                    const updatedIssues = [...prevIssues, newIssue as Issue];
                    return updatedIssues;
                });
            });

        setShowForm(false);
    }

    async function fetchChatResponse(responseType: keyof GptResponseMap) {
        if (!selection) {
            return;
        }
        setLoadingResponseType(responseType);

        // WARNING for future Edward: this is hardcoding the id for reviews, if the id strucutre changes, this will break
        const reviewer = getReviewer(selection?.startContainer).split(
            "reviewer-"
        )[1];
        const review = reviews.filter((review) => review.reviewer === reviewer);

        const requestBody =
            responseType === "explain"
                ? {
                      paperTitle: paperTitle,
                      paperAbstract: paperAbstract,
                      exactHighlightContent: selection.toString(),
                  }
                : {
                      paperTitle: paperTitle,
                      paperAbstract: paperAbstract,
                      highlightContent:
                          selection?.commonAncestorContainer.nodeValue,
                      reviewConent: review[0].content,
                  };

        console.log(requestBody);

        const response = await fetch(`${BASE_URL}/gpt/${responseType}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const strategies = await response.json().finally(() => {
            setGptResponseType(responseType);
            setLoadingResponseType(null);
        });

        // const reader = response.body?.getReader();
        // const decoder = new TextDecoder();
        // let result = "";

        // while (true) {
        //     const { done, value } = await reader.read();
        //     if (done) break;
        //     result += decoder.decode(value, { stream: true });
        //     setChatStrategies(result);
        // }

        if (responseType === "explain") {
            setGptResponse(strategies);
        } else {
            setGptResponse(JSON.parse(strategies));
        }
    }

    useEffect(() => {
        if (showForm) {
            noteTextarea.current?.focus();
        }
        setNewIssue(emptyIssue);
        setGptResponse(null);
    }, [showForm]);

    const { treatment } = useContext(UserContext);
    let enableInsitu = false;
    if (treatment === "Full-AI") {
        enableInsitu = true;
    }

    return (
        <>
            {showForm && formPosition && (
                <div
                    className="bg-background rounded-md shadow-lg absolute z-10 max-w-[350px] border-[1px] border-gray-300 pl-3 p-2"
                    style={{
                        transform: `translate3d(${formPosition.x}px, ${formPosition.y}px, 0)`,
                    }}
                >
                    {gptResponse && (
                        <div className="flex items-stretch gap-4 p-2 pl-0">
                            <span
                                className={`${
                                    gptResponseType
                                        ? gptResponseMap[gptResponseType].bg
                                        : ""
                                } min-w-0.5`}
                            ></span>
                            <div
                                className={`text-sm ${
                                    gptResponseType
                                        ? gptResponseMap[gptResponseType]
                                              .textColor
                                        : ""
                                } font-semibold`}
                            >
                                {gptResponseType
                                    ? gptResponseMap[gptResponseType].text
                                    : ""}
                                {typeof gptResponse === "string" ? (
                                    <p className="text-black font-normal">
                                        {gptResponse}
                                    </p>
                                ) : (
                                    <ul className="list-disc text-black font-normal ml-4">
                                        {Object.entries(gptResponse).map(
                                            ([header, strategy], index) => {
                                                return (
                                                    <li
                                                        key={`GPT-strategy-${index}`}
                                                        className="pt-1"
                                                    >
                                                        <p>
                                                            <em className="font-semibold not-italic">
                                                                {`${header}: `}
                                                            </em>
                                                            {strategy}
                                                        </p>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                    {enableInsitu && (
                        <div className="flex gap-4 pb-2">
                            <Button
                                variant="outline"
                                className="h-6 text-xs rounded-full text-violet-600 hover:bg-violet-600 hover:text-white"
                                type="button"
                                onClick={() => fetchChatResponse("strategize")}
                            >
                                Strategize
                                {loadingResponseType === "strategize" ? (
                                    <LoaderCircle className="animate-spin ml-1 w-3 h-3" />
                                ) : (
                                    <Sparkles className="ml-1 w-3 h-3" />
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-6 text-xs rounded-full text-green-600 hover:bg-green-600 hover:text-white"
                                type="button"
                                onClick={() => fetchChatResponse("reflect")}
                            >
                                Reflect
                                {loadingResponseType === "reflect" ? (
                                    <LoaderCircle className="animate-spin ml-1 w-3 h-3" />
                                ) : (
                                    <Sparkles className="ml-1 w-3 h-3" />
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-6 text-xs rounded-full text-pink-500 hover:bg-pink-500 hover:text-white"
                                type="button"
                                onClick={() => fetchChatResponse("explain")}
                            >
                                Explain
                                {loadingResponseType === "explain" ? (
                                    <LoaderCircle className="animate-spin ml-1 w-3 h-3" />
                                ) : (
                                    <Sparkles className="ml-1 w-3 h-3" />
                                )}
                            </Button>
                        </div>
                    )}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createNewHighlight();
                        }}
                        className="flex gap-2 items-center pb-2"
                    >
                        <Textarea
                            required
                            className="min-h-[40px] shadow-none"
                            id="comment"
                            ref={noteTextarea}
                            placeholder="Add a note..."
                            rows={1}
                            value={newIssue.comment}
                            onChange={(e) =>
                                setNewIssue({
                                    ...newIssue,
                                    comment: e.target.value,
                                })
                            }
                        />
                        <Button type="submit" variant="ghost" size="icon">
                            <CheckCircledIcon className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            )}
        </>
    );
}
