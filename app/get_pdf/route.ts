import { NextResponse, type NextRequest } from "next/server";

const base_url = "https://api.openreview.net";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const forum_id = searchParams.get("forum");
    const paper_id = searchParams.get("paper");

    const res = await fetch(base_url + "/notes?id=" + paper_id, {
        method: "GET",
    });

    const data = await res.json();
    const pdf_url = data.notes[0].content.pdf;

    const pdfRes = await fetch(base_url + pdf_url, { method: "GET" });

    const pdfBlob = await pdfRes.blob();
    const arrayBuffer = await pdfBlob.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${paper_id}.pdf`,
            "Access-Control-Allow-Origin": "*",
        },
    });
}
