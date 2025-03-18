const express = require('express');
const cors = require('cors');
const pdfjsLib = require('pdfjs-dist');
const app = express();

app.use(express.json({limit: '10mb'}));
app.use(cors());

app.post('/extract-text', async (req, res) => {
  try {
    const pdfData = Uint8Array.from(Buffer.from(req.body.base64, 'base64'));
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    
    let extractedText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map(item => item.str).join(' ') + ' ';
    }
    
    res.json({ text: extractedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

