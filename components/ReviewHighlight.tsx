import React from "react";
import type { Issue } from "@/app/page";

type ReviewHighlightProps = {
    rect: DOMRect;
    issue: Issue;
};

export const ReviewHighlight = React.memo(
    function ReviewHighlight({ rect, issue }: ReviewHighlightProps) {
        const scrollContainerTop = document
            .getElementById("scroll-container-top-marker")
            ?.getBoundingClientRect().y;

        return (
            <div
                key={`${rect.x}-x-${rect.y}-y`}
                className="bg-yellow-600/50 absolute hover:cursor-pointer"
                style={{
                    left: `${rect.x}px`,
                    top: `${
                        rect.y - (scrollContainerTop ?? 0) + rect.height
                    }px`,
                    height: `${rect.height}px`,
                    width: `${rect.width}px`,
                }}
                onClick={() => {
                    document.getElementById(issue.title)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                    // setCurrentIssue(issue)
                }}
            ></div>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.issue === nextProps.issue;
    }
);
