import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

type ReviewProps = {
    reviewer: string;
    reviewConent: {};
};

export function Review({ reviewer, reviewConent }: ReviewProps) {
    return (
        <Card id={`reviewer-${reviewer}`} className="p-4 mx-2 my-6">
            <CardTitle className="underline mb-4 text-gray-700">
                Reviewer {reviewer}
            </CardTitle>
            <CardContent className="p-0">
                {Object.entries(reviewConent).map(([section, content]) => {
                    return (
                        <div key={`${reviewer}-${section}`} className="text-sm">
                            <p className="text-red-700 font-bold mt-1.5 mb-0.5">
                                {section}
                            </p>
                            {JSON.stringify(content)
                                .replaceAll('\\"', '"')
                                .replaceAll('"', "")
                                .split("\\n")
                                .map((line, index) => {
                                    return (
                                        <p
                                            key={`${reviewer}-${section}-${index}`}
                                        >
                                            {line}
                                        </p>
                                    );
                                })}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
