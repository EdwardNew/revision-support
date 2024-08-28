import { NextResponse, type NextRequest } from "next/server";

const api_version: number = 2; // openreview API version 1 or 2

let base_url = "";

if (api_version === 1) {
    base_url = "https://api.openreview.net";
} else {
    base_url = "https://api2.openreview.net";
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const forum_id = searchParams.get("forum");

    const res = await fetch(
        base_url + "/notes?forum=" + forum_id + "&select=content,signatures",
        {
            method: "GET",
        }
    );

    const notes = await res.json();
    const reviews = notes.notes.filter((note: any) => {
        if (api_version === 1) {
            return note.content.hasOwnProperty("main_review");
        } else {
            return (
                note.content.hasOwnProperty("summary") ||
                note.content.hasOwnProperty("metareview")
            );
        }
    });

    reviews.map((review: any) => {
        for (const key in review.content) {
            if (
                review.content[key] &&
                review.content[key].hasOwnProperty("value")
            ) {
                review.content[key] = review.content[key].value;
            }
        }
        review["reviewer"] = review.signatures[0].split("Reviewer_")[1];
        delete review.signatures;
    });

    return new NextResponse(JSON.stringify(reviews));
}
