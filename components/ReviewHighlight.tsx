import React from "react";

type ReviewHighlightProps = {
    rect: DOMRect;
    issueId: string;
};

export const ReviewHighlight = React.memo(
    function ReviewHighlight({ rect, issueId }: ReviewHighlightProps) {
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
                    document.getElementById(issueId)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                    // setCurrentIssue(issue)
                }}
            ></div>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.rect === nextProps.rect;
    }
);
