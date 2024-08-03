import { useEffect, useState } from "react";

export function ReviewHighlight() {
    const [selection, setSelection] = useState<string>();
    const [position, setPosition] = useState<Record<string, number>>();

    function onSelectStart() {
        setSelection(undefined);
    }

    function onSelectEnd() {
        const activeSelection = document.getSelection();
        const text = activeSelection?.toString();

        if (!activeSelection || !text) {
            setSelection(undefined);
            return;
        }

        setSelection(text);

        const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

        setPosition({
            x: rect.left + rect.width / 2 - 80 / 2,
            y: rect.top + window.scrollY - 30,
            width: rect.width,
            height: rect.height,
        });
    }

    useEffect(() => {
        document.addEventListener("selectstart", onSelectStart);
        document.addEventListener("mouseup", onSelectEnd);
        return () => {
            document.removeEventListener("selectstart", onSelectStart);
            document.removeEventListener("mouseup", onSelectEnd);
        };
    }, []);

    return (
        <div>
            {selection && position && (
                <p
                    className="
            absolute -top-2 left-0 w-[80px] h-[30px] bg-black text-white rounded m-0
            after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
          "
                    style={{
                        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    }}
                >
                    <button className="flex w-full h-full justify-between items-center px-2">
                        <span id="new-issue" className="text-xs">
                            New Issue
                        </span>
                    </button>
                </p>
            )}
        </div>
    );
}
