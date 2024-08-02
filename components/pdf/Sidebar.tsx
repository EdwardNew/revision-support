import React from "react";
import type { IHighlight } from "react-pdf-highlighter";

interface Props {
    highlights: Array<IHighlight>;
    resetHighlights: () => void;
}

const updateHash = (highlight: IHighlight) => {
    document.location.hash = `highlight-${highlight.id}`;
};

declare const APP_VERSION: string;

export function Sidebar({ highlights, resetHighlights }: Props) {
    return (
        <div className="sidebar" style={{ width: "25vw" }}>
            <div className="bg-secondary">tags</div>

            <ul className="sidebar__highlights">
                {highlights.map((highlight, index) => (
                    <li
                        // biome-ignore lint/suspicious/noArrayIndexKey: This is an example app
                        key={index}
                        className="sidebar__highlight"
                        onClick={() => {
                            updateHash(highlight);
                        }}
                    >
                        <div>
                            <strong>{highlight.comment.text}</strong>
                            {highlight.content.text ? (
                                <blockquote style={{ marginTop: "0.5rem" }}>
                                    {`${highlight.content.text
                                        .slice(0, 90)
                                        .trim()}…`}
                                </blockquote>
                            ) : null}
                            {highlight.content.image ? (
                                <div
                                    className="highlight__image"
                                    style={{ marginTop: "0.5rem" }}
                                >
                                    <img
                                        src={highlight.content.image}
                                        alt={"Screenshot"}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className="highlight__location">
                            Page {highlight.position.pageNumber}
                        </div>
                    </li>
                ))}
            </ul>
            {highlights.length > 0 ? (
                <div style={{ padding: "1rem" }}>
                    <button type="button" onClick={resetHighlights}>
                        Reset highlights
                    </button>
                </div>
            ) : null}
        </div>
    );
}
