// import PDFParser from "pdf2json";

// export async function GET() {
//     const pdfParser = new PDFParser(this, true);
//     const filename = "./data/iGffRQ9jQpQ.pdf";

//     // Create a new Promise to handle the asynchronous nature of PDF parsing
//     const parsePdfPromise = new Promise((resolve, reject) => {
//         pdfParser.on("pdfParser_dataError", (errData) =>
//             reject(errData.parserError)
//         );

//         pdfParser.on("pdfParser_dataReady", () => {
//             // Resolve the promise with the raw text content from the PDF
//             resolve(pdfParser.getRawTextContent());
//         });

//         pdfParser.loadPDF(filename);
//     });

//     try {
//         // Await the promise and return the result as the response
//         const textContent = await parsePdfPromise;
//         return new Response(textContent, {
//             status: 200,
//             headers: { "Content-Type": "text/plain" },
//         });
//     } catch (error) {
//         // Handle errors and return an appropriate response
//         return new Response(`Error: ${error.message}`, { status: 500 });
//     }
// }
