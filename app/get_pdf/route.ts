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
    const paper_id = searchParams.get("paper");

    const res = await fetch(base_url + "/notes?id=" + paper_id, {
        method: "GET",
    });

    const data = await res.json();

    let pdf_url = "";

    if (api_version === 1) {
        pdf_url = data.notes[0].content.pdf;
    } else {
        pdf_url = data.notes[0].content.pdf.value;
    }

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
