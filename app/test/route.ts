import { NextResponse, type NextRequest } from "next/server";
import PDFParser from "pdf2json";

// Base URL for the external API
const base_url = "https://api.openreview.net";

// Function to fetch the PDF from the external API
async function fetchPdf(paper_id: string): Promise<ArrayBuffer> {
    const res = await fetch(`${base_url}/notes?id=${paper_id}`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch note: ${res.statusText}`);
    }

    const data = await res.json();
    const pdf_url = data.notes[0].content.pdf;

    const pdfRes = await fetch(`${base_url}${pdf_url}`, { method: "GET" });

    if (!pdfRes.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfRes.statusText}`);
    }

    const pdfBlob = await pdfRes.blob();
    const pdfBuffer = await pdfBlob.arrayBuffer();
    return pdfBuffer;
}

// Function to parse the PDF content
async function parsePdf(arrayBuffer: ArrayBuffer): Promise<string> {
    const pdfParser = new PDFParser();

    return new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData) =>
            reject(new Error(errData.parserError))
        );

        pdfParser.on("pdfParser_dataReady", () => {
            resolve(pdfParser.getRawTextContent());
        });

        // Load PDF from ArrayBuffer
        pdfParser.parseBuffer(Buffer.from(arrayBuffer));
    });
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const paper_id = searchParams.get("paper");

        if (!paper_id) {
            return new NextResponse("Paper ID is missing", { status: 400 });
        }

        // Fetch the PDF
        const pdfArrayBuffer = await fetchPdf(paper_id);

        // Parse the PDF content
        const textContent = await parsePdf(pdfArrayBuffer);

        // Return the parsed text content
        return new NextResponse(textContent, {
            status: 200,
            headers: { "Content-Type": "text/plain" },
        });
    } catch (error) {
        // Handle errors and return an appropriate response
        return new NextResponse(`Error: ${error.message}`, { status: 500 });
    }
}
