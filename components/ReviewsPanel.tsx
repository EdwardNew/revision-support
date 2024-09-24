import { Button } from "@/components/ui/button";
import { Review } from "./Review";
import { ReviewHighlight } from "./ReviewHighlight";
import { ReviewHighlightTooltip } from "./ReviewHighlightTooltip";

export default function ReviewsPanel() {
    return (
        <div className="flex flex-col h-full">
            <div className=" text-secondary-foreground px-4 py-3 font-medium rounded-t-lg">
                Reviews
            </div>
            <div className="flex items-center justify-between bg-card rounded-t-lg px-4 py-2 border-b border-muted">
                <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
                    {reviews.length > 0 &&
                        reviews.map((review) => {
                            return (
                                <Button
                                    className="text-xs rounded-full border-none shadow-none py-1 px-3 h-5"
                                    key={`${review.reviewer}-btn`}
                                    onClick={() => {
                                        document
                                            .getElementById(
                                                "reviewer-" + review.reviewer
                                            )
                                            ?.scrollIntoView({
                                                behavior: "smooth",
                                            });
                                    }}
                                    variant="outline"
                                >
                                    {review.reviewer}
                                </Button>
                            );
                        })}
                </div>
            </div>
            <div
                id="scroll-container"
                className="flex-1 p-4 overflow-auto relative selection:bg-yellow-200"
            >
                <div id="scroll-container-top-marker"></div>
                <ReviewHighlightTooltip
                    reviewPanelSize={reviewsPanelSize}
                    scrollContainer={scrollContainer.current}
                    issuesId={issuesId}
                    setAllIssues={setAllIssues}
                    paperTitle={paperTitle}
                    paperAbstract={paperAbstract}
                    reviews={reviews}
                />
                {reviews.length > 0 &&
                    reviews.map((review) => {
                        return (
                            <Review
                                key={review.reviewer}
                                reviewer={review.reviewer}
                                reviewConent={review.content}
                            />
                        );
                    })}

                {reviewHighlights &&
                    reviewHighlights.map((highlight) =>
                        highlight.rects.map((rect) => (
                            <ReviewHighlight
                                key={`${rect.x}-x-${rect.y}-y`}
                                rect={rect}
                                issueId={highlight.issueId}
                            />
                        ))
                    )}
            </div>
        </div>
    );
}
