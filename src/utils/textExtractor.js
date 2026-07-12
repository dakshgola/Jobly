/**
 * Extracts raw text from a PDF file in the browser.
 * Uses dynamic imports to isolate pdfjs-dist from the main bundle and prevent TDZ / worker errors on load.
 * 
 * @param {File} file - The uploaded PDF file
 * @returns {Promise<string>} The extracted text content
 */
export async function extractTextFromPdf(file) {
  // Dynamically load pdfjs-dist in-browser to prevent initial bundle load crashes
  const pdfjsLib = await import("pdfjs-dist");
  
  // Set CDN worker path dynamically matching local version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        resolve(fullText);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extracts raw text from a DOCX file in the browser.
 * Uses dynamic imports to keep mammoth fully modular.
 * 
 * @param {File} file - The uploaded DOCX file
 * @returns {Promise<string>} The extracted text content
 */
export async function extractTextFromDocx(file) {
  // Dynamically load mammoth
  const mammoth = await import("mammoth");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
