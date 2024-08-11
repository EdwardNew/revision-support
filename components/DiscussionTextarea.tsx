import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import type { DiscussionComment } from "@/app/page";

type DiscussionTextareaProps = {
    setCurrentComments: React.Dispatch<
        React.SetStateAction<Array<DiscussionComment>>
    >;
};

export function DiscussionTextarea({
    setCurrentComments,
}: DiscussionTextareaProps) {
    const [newCommentContent, setNewCommentContent] = useState<string>("");

    function submitComment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newComment = {
            content: newCommentContent,
            author: "NewCommentAuthor",
            timestamp: new Date().toISOString().slice(0, -5) + "Z",
        };

        setCurrentComments((prevIssues) => [...prevIssues, newComment]);

        setNewCommentContent("");
    }

    function handleCTRLENTER(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.ctrlKey && e.key === "Enter") {
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) {
                form.requestSubmit();
            }
        }
    }

    return (
        <div className="mt-4">
            <form className="grid gap-4" onSubmit={submitComment}>
                <div className="grid gap-2">
                    <Label htmlFor="comment">Add a comment</Label>
                    <Textarea
                        id="comment"
                        placeholder="Write your comment..."
                        className="min-h-[100px]"
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        onKeyDown={handleCTRLENTER}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Post Comment
                </Button>
            </form>
        </div>
    );
}
