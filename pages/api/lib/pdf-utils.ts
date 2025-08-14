import PDFParser, { Output } from "pdf2json";

export async function parsePdf(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData: Record<"parserError", Error>) => {
            console.error("PDF2JSON data error:", errData.parserError);
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: Output) => {
            let textContent = '';
            // Extract text from the JSON structure
            if (pdfData.Pages && pdfData.Pages.length > 0) {
                pdfData.Pages.forEach((page: { Texts: { R: { T: string }[] }[] }) => {
                    if (page.Texts) {
                        textContent += page.Texts.map((text: { R: { T: string }[] }) => decodeURIComponent(text.R[0].T)).join(' ');
                    }
                });
            }
            resolve(textContent);
        });

        pdfParser.parseBuffer(buffer);
    });
}
