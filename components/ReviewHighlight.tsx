// import type { Issue } from "@/app/page";
// import { MutableRefObject } from "react";

// type ReviewHighlightProps = {
//     rect: DOMRect;
//     initialScrollPosition: number;
//     scrollContainer: MutableRefObject<HTMLElement | null>;
//     scrollContainerScrollTop: number;
//     issue: Issue;
//     onClick: (issue: Issue) => void;
// };

// export function ReviewHighlight({
//     rect,
//     initialScrollPosition,
//     scrollContainer,
//     scrollContainerScrollTop,
//     issue,
//     onClick,
// }: ReviewHighlightProps) {
//     console.log(document.getElementById("test")?.getBoundingClientRect());
//     // console.log("highlight rerendered!");
//     if (!scrollContainer.current) {
//         return;
//     }
//     // TODO: this getboudningclientrect each time is a bit wasteful...
//     const scrollContainerRect = scrollContainer.current.getBoundingClientRect();
//     // console.log(scrollContainerRect, scrollContainer.current.scrollTop);

//     let test = document.getElementById("test")?.getBoundingClientRect().y;

//     // if (rect.y === 0 && scrollContainerScrollTop > initialScrollPosition) {
//     //     test = scrollContainerScrollTop - initialScrollPosition;
//     // }

//     return (
//         <div
//             key={`${rect.x}-x-${rect.y}-y`}
//             className="bg-yellow-600/50 absolute hover:cursor-pointer"
//             style={{
//                 left: `${rect.x - scrollContainerRect.x}px`,
//                 top: `${rect.y - (test ?? 0)  16}px`,
//                 height: `${rect.height}px`,
//                 width: `${rect.width}px`,
//             }}
//             onClick={() => onClick(issue)}
//         ></div>
//     );
// }

import React, { MutableRefObject } from "react";
import type { Issue } from "@/app/page";

type ReviewHighlightProps = {
    rect: DOMRect;
    initialScrollPosition?: number;
    scrollContainer: MutableRefObject<HTMLElement | null>;
    scrollContainerScrollTop: number;
    issue: Issue;
    onClick: (issue: Issue) => void;
};

const ReviewHighlight = React.memo(
    function ReviewHighlight({
        rect,
        scrollContainer,
        scrollContainerScrollTop,
        issue,
        onClick,
    }: ReviewHighlightProps) {
        // console.log(document.getElementById("test")?.getBoundingClientRect());
        // console.log("highlight rerendered!");
        if (!scrollContainer.current) {
            return null;
        }
        // TODO: this getBoundingClientRect each time is a bit wasteful...
        const scrollContainerRect =
            scrollContainer.current.getBoundingClientRect();

        let test = document.getElementById("test")?.getBoundingClientRect().y;

        return (
            <div
                key={`${rect.x}-x-${rect.y}-y`}
                className="bg-yellow-600/50 absolute hover:cursor-pointer"
                style={{
                    left: `${rect.x - scrollContainerRect.x}px`,
                    top: `${rect.y - (test ?? 0) + 16}px`,
                    height: `${rect.height}px`,
                    width: `${rect.width}px`,
                }}
                onClick={() => onClick(issue)}
            ></div>
        );
    },
    (prevProps, nextProps) => {
        // Optional: Custom comparison function for further optimization
        return (
            prevProps.rect.x === nextProps.rect.x &&
            prevProps.rect.y === nextProps.rect.y &&
            prevProps.rect.width === nextProps.rect.width &&
            prevProps.rect.height === nextProps.rect.height &&
            prevProps.initialScrollPosition ===
                nextProps.initialScrollPosition &&
            prevProps.scrollContainerScrollTop ===
                nextProps.scrollContainerScrollTop &&
            prevProps.issue === nextProps.issue
        );
    }
);

export { ReviewHighlight };
