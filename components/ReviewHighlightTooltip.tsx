type ReviewHighlightTooltipProps = {
    selectionText: string | undefined;
    position: Record<string, number> | undefined;
    createNewHighlight: () => void;
};

export function ReviewHighlightTooltip({
    selectionText,
    position,
    createNewHighlight,
}: ReviewHighlightTooltipProps) {
    return (
        <div>
            {selectionText && position && (
                <p
                    className="
            absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0
            after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
          "
                    style={{
                        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    }}
                >
                    <button
                        className="flex w-full h-full justify-between items-center px-2"
                        onClick={createNewHighlight}
                    >
                        <span id="new-issue" className="text-xs">
                            New Issue
                        </span>
                    </button>
                </p>
            )}
        </div>
    );
}
