const mammoth = require('mammoth');
const fs = require('fs');

async function extractText() {
  try {
    const result = await mammoth.extractRawText({ path: 'Struktur-Website-Desa-Cikahuripan.docx' });
    fs.writeFileSync('C:/Users/tezow/.gemini/antigravity-ide/brain/79f62d24-0da3-46d1-9426-a3c331971ec6/docx-content.txt', result.value);
    console.log('Extraction complete!');
  } catch (err) {
    console.error('Error:', err);
  }
}

extractText();
