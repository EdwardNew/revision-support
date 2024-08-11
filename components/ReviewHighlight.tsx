import type { Rect, Issue } from "@/app/page";
import { MutableRefObject } from "react";

type ReviewHighlightProps = {
    rect: Rect;
    initialScrollPosition: number;
    scrollContainer: MutableRefObject<HTMLElement | null>;
    issue: Issue;
    onClick: (issue: Issue) => void;
};

export function ReviewHighlight({
    rect,
    initialScrollPosition,
    scrollContainer,
    issue,
    onClick,
}: ReviewHighlightProps) {
    // console.log(scrollContainer);
    if (!scrollContainer.current) {
        return;
    }
    const scrollContainerRect = scrollContainer.current.getBoundingClientRect();

    return (
        <div
            key={`${rect.x}-x-${rect.y}-y`}
            className="bg-yellow-600/50 absolute hover:cursor-pointer"
            style={{
                left: `${rect.x - scrollContainerRect.x}px`,
                top: `${
                    rect.y - scrollContainerRect.y + initialScrollPosition
                }px`,
                height: `${rect.height}px`,
                width: `${rect.width}px`,
            }}
            onClick={() => onClick(issue)}
        ></div>
    );
}
