"use client";

import React, { useEffect, useState } from "react";

import {
    AreaHighlight,
    Highlight,
    PdfHighlighter,
    PdfLoader,
    Popup,
} from "react-pdf-highlighter";

import type {
    Content,
    IHighlight,
    NewHighlight,
    ScaledPosition,
} from "react-pdf-highlighter";

import Tip from "./Tip";
import { Spinner } from "./Spinner";
import { testHighlights as _testHighlights } from "./test-highlights";

// import "./style/App.css";

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

interface State {
    url: string;
    highlights: Array<IHighlight>;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

const resetHash = () => {
    document.location.hash = "";
};

const HighlightPopup = ({
    comment,
}: {
    comment: { text: string; emoji: string };
}) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

const searchParams = new URLSearchParams(document.location.search);

interface PdfProps {
    highlights: Array<IHighlight>;
    setHighlights: React.Dispatch<React.SetStateAction<Array<IHighlight>>>;
}

export function Pdf({ highlights, setHighlights }: PdfProps) {
    const [pdfUrl, setPdfUrl] = useState("");
    const [pdfRawText, setPdfRawText] = useState("");
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        const fetchPdf = async () => {
            const response = await fetch(
                "http://localhost:3000/get_pdf?paper=iGffRQ9jQpQ"
            );
            const blob = await response.blob();
            setPdfUrl(URL.createObjectURL(blob));
        };
        fetchPdf();
    }, []);

    const resetHighlights = () => {
        setHighlights([]);
    };

    const scrollViewerTo = (highlight: IHighlight) => {};

    const scrollToHighlightFromHash = () => {
        if (highlights.length == 0) return;
        const highlight = getHighlightById(parseIdFromHash());

        if (highlight) {
            scrollViewerTo(highlight);
        }
    };

    useEffect(() => {
        window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    }, [scrollViewerTo, highlights]);

    useEffect(() => {
        if (shouldScroll) {
            const scrollBottom = document.querySelector(".scrollBottom");
            scrollBottom?.scrollIntoView({ behavior: "smooth" });
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    const getHighlightById = (id: string) => {
        return highlights.find((highlight) => highlight.id === id);
    };

    const addHighlight = async (newHighlight: NewHighlight) => {
        console.log("Saving highlight", newHighlight);

        setHighlights((prevHighlights) => {
            return [...prevHighlights, { ...newHighlight, id: getNextId() }];
        });

        setShouldScroll(true);

        // const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/addHighlight`;
        // const highlightData = {
        //     userId: user.id,
        //     newHighlight: highlight,
        // };
        // const response = await fetch(API_URL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(highlightData),
        // });

        // const data = await response.json();
    };

    const updateHighlight = (
        highlightId: string,
        position: Object,
        content: Object
    ) => {
        setHighlights((prev) => {
            return prev.map((h) => {
                const {
                    id,
                    position: originalPosition,
                    content: originalContent,
                    ...rest
                } = h;
                return id === highlightId
                    ? {
                          id,
                          position: { ...originalPosition, ...position },
                          content: { ...originalContent, ...content },
                          ...rest,
                      }
                    : h;
            });
        });
    };

    return (
        <div className="App" style={{ display: "flex", height: "100vh" }}>
            <div
                style={{
                    height: "100vh",
                    width: "75vw",
                    position: "relative",
                }}
            >
                <PdfLoader url={pdfUrl} beforeLoad={<Spinner />}>
                    {(pdfDocument) => (
                        <PdfHighlighter
                            pdfDocument={pdfDocument}
                            enableAreaSelection={(event) => event.altKey}
                            onScrollChange={resetHash}
                            // pdfScaleValue="page-width"
                            scrollRef={(scrollTo) => {
                                const scrollViewerTo = scrollTo;
                                scrollToHighlightFromHash();
                            }}
                            onSelectionFinished={(
                                position,
                                content,
                                hideTipAndSelection,
                                transformSelection
                            ) => (
                                <Tip
                                    onOpen={transformSelection}
                                    onConfirm={(comment) => {
                                        addHighlight({
                                            content,
                                            position,
                                            comment,
                                        });
                                        hideTipAndSelection();
                                    }}
                                />
                            )}
                            highlightTransform={(
                                highlight,
                                index,
                                setTip,
                                hideTip,
                                viewportToScaled,
                                screenshot,
                                isScrolledTo
                            ) => {
                                const isTextHighlight =
                                    !highlight.content?.image;

                                const component = isTextHighlight ? (
                                    <Highlight
                                        isScrolledTo={isScrolledTo}
                                        position={highlight.position}
                                        comment={highlight.comment}
                                    />
                                ) : (
                                    <AreaHighlight
                                        isScrolledTo={isScrolledTo}
                                        highlight={highlight}
                                        onChange={(boundingRect) => {
                                            updateHighlight(
                                                highlight.id,
                                                {
                                                    boundingRect:
                                                        viewportToScaled(
                                                            boundingRect
                                                        ),
                                                },
                                                {
                                                    image: screenshot(
                                                        boundingRect
                                                    ),
                                                }
                                            );
                                        }}
                                    />
                                );

                                return (
                                    <Popup
                                        popupContent={
                                            <HighlightPopup {...highlight} />
                                        }
                                        onMouseOver={(popupContent) =>
                                            setTip(
                                                highlight,
                                                (highlight) => popupContent
                                            )
                                        }
                                        onMouseOut={hideTip}
                                        key={index}
                                    >
                                        {component}
                                    </Popup>
                                );
                            }}
                            highlights={highlights}
                        />
                    )}
                </PdfLoader>
            </div>
        </div>
    );
}