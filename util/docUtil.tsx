const fs = require('fs');
const extractTextFromDoc = require('./extractTextFromDoc');

const filePath = './path/to/your/document.doc';

fs.readFile(filePath, async (err, data) => {
  if (err) {
    console.error('Error reading the .doc file:', err);
    return;
  }

  try {
    const fileContent = await extractTextFromDoc(data);
    console.log('Extracted Text:', fileContent);
  } catch (error) {
    // Handle the error appropriately
    console.error('Error extracting text from .doc file:', error);
  }
});
