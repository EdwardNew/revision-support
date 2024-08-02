import { NextResponse, type NextRequest } from "next/server";

const base_url = "https://api.openreview.net";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const forum_id = searchParams.get("forum");

    const res = await fetch(
        base_url + "/notes?forum=" + forum_id + "&select=content",
        {
            method: "GET",
        }
    );

    const notes = await res.json();
    console.log(notes);
    const reviews = notes.notes.filter((note: any) =>
        note.content.hasOwnProperty("main_review")
    );

    return new NextResponse(JSON.stringify(reviews));
}
