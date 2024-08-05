import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import type { discussionComment } from "@/app/page";

type DiscussionCardProps = {
    comment: discussionComment;
};

export function DiscussionCard({ comment }: DiscussionCardProps) {
    return (
        <div className="rounded-md border bg-background p-4 shadow-sm">
            <div className="max-h-[400px] overflow-auto">
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border">
                            <AvatarImage
                                src="/placeholder-user.jpg"
                                alt="@shadcn"
                            />
                            <AvatarFallback>LS</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1.5">
                            <div className="flex items-center gap-2">
                                <div className="font-semibold">
                                    {`@${comment.author}`}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {comment.timestamp}
                                </div>
                            </div>
                            <div>{comment.content}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
