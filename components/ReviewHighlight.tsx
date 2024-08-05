import type { Rect, Issue } from "@/app/page";

type ReviewHighlightProps = {
    rect: Rect;
    initialScrollPosition: number;
    reviewsScrollPosition: number;
    issue: Issue;
    onClick: (issue: Issue) => void;
};

export function ReviewHighlight({
    rect,
    initialScrollPosition,
    reviewsScrollPosition,
    issue,
    onClick,
}: ReviewHighlightProps) {
    return (
        <div
            key={`${rect.x}-x-${rect.y}-y`}
            className="bg-yellow-600/50 absolute hover:cursor-pointer"
            style={{
                left: `${rect.x}px`,
                top: `${
                    rect.y - reviewsScrollPosition + initialScrollPosition
                }px`,
                height: `${rect.height}px`,
                width: `${rect.width}px`,
            }}
            onClick={() => onClick(issue)}
        ></div>
    );
}
