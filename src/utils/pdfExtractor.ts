/**
 * Client-side PDF text extractor using pdfjs-dist legacy build
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Dynamically import pdfjs-dist legacy build for broad browser compatibility
    // @ts-ignore
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items
        .map((item: any) => (item.str ? item.str : ''))
        .filter(Boolean);

      fullText += `\n--- Page ${pageNum} ---\n` + strings.join(' ') + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction failed:', error);
    throw new Error('Unable to parse PDF text. Please ensure the file contains readable text.');
  }
}
