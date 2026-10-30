import JSZip from 'jszip';

/**
 * Extracts plain text from an uploaded PowerPoint presentation (.pptx)
 */
export async function extractTextFromPptx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Find all slide XML files (ppt/slides/slide1.xml, slide2.xml, etc.)
    const slideFileNames = Object.keys(zip.files).filter((fileName) =>
      fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml')
    );

    // Sort slides numerically: slide1, slide2, slide3...
    slideFileNames.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });

    let fullText = '';
    for (let i = 0; i < slideFileNames.length; i++) {
      const fileName = slideFileNames[i];
      const xmlContent = await zip.files[fileName].async('text');

      // Match all text nodes <a:t>...</a:t>
      const textMatches = xmlContent.match(/<a:t[^>]*>(.*?)<\/a:t>/gi) || [];
      const slideText = textMatches
        .map((tag) => tag.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
        .join(' ');

      if (slideText) {
        fullText += `\n--- Slide ${i + 1} ---\n${slideText}\n`;
      }
    }

    return fullText.trim();
  } catch (error) {
    console.error('PPTX extraction failed:', error);
    throw new Error('Could not extract text from this PowerPoint file.');
  }
}
