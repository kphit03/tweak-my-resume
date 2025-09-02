import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"; //getDocument is a function that loads a pdf
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"; // Vite gives you a URL string

GlobalWorkerOptions.workerSrc = workerUrl; // tell PDF.js where the worker lives

export async function extractPdfText(input) {//input being the pdf file passed
    //if file already an ArrayBuffer(raw bytes), use it, otherwise use BlobAPI (arrayBuffer()) to read the file's bytes
    const data = input instanceof ArrayBuffer ? input : await input.arrayBuffer();

    // "load the pdf from these bytes(data) and give me the pdf object when ready"
    const pdf = await getDocument({ data }).promise; //pass our data const to pdfJS ( with getDocument method )
    let text = "";

    //start at page 1 and loop until last page(pdf.js pages are 1-based)
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); //store current pdfjs page to in-scope page var
        const content = await page.getTextContent(); //extract text from the curr pdfjs page

        // from all text items from content, give a clean list of actual strings, dropping the blanks
        const strings = content.items.map(it => ("str" in it ? it.str : "")).filter(Boolean);
        //add this page's text to the overall text
        text += strings.join(" ") + "\n";
    }

    return text.trim(); //return and remove whitespace from start and end of string
}
