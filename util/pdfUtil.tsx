const extractTextFromPDF = async (file) => {
    try {

      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      const pdfWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


      const pdfData = new Uint8Array(await file.arrayBuffer());

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      let text = '';
  
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const pageText = await page.getTextContent();
        const pageTextArray = pageText.items.map((item) => item.str);
        text += pageTextArray.join(' ');
      }
  
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  };
  
  export default extractTextFromPDF;
  