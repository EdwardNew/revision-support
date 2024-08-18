import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { Issue } from "@/app/page";
import { useRef } from "react";

type DeleteIssueDialogProps = {
    issueTitle: string;
    setShowDeleteIssue: React.Dispatch<React.SetStateAction<boolean>>;
    setAllIssues: React.Dispatch<React.SetStateAction<Array<Issue>>>;
};

export function DeleteIssueDialog({
    issueTitle,
    setShowDeleteIssue,
    setAllIssues,
}: DeleteIssueDialogProps) {
    const cancelBtn = useRef<HTMLButtonElement | null>(null);

    function handleDeleteIssue() {
        setAllIssues((prevIssues) =>
            [...prevIssues].filter((issue) => issue.title !== issueTitle)
        );
    }

    return (
        <Dialog
            defaultOpen
            onOpenChange={(open) => {
                setShowDeleteIssue(open);
            }}
        >
            <DialogContent
                className="sm:max-w-[425px]"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    cancelBtn.current?.focus();
                }}
            >
                <DialogHeader>
                    <DialogTitle>Permanently Delete Comment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to permanently delete this
                        comment? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            handleDeleteIssue();
                            setShowDeleteIssue(false);
                        }}
                    >
                        Delete Comment
                    </Button>

                    <Button
                        ref={cancelBtn}
                        variant="outline"
                        onClick={() => {
                            setShowDeleteIssue(false);
                        }}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}