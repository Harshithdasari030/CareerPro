const fs = require("fs");
const pdfParse = require("pdf-parse");

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(dataBuffer);

    console.log("📄 PDF TEXT:", data.text);

    return data.text;

  } catch (err) {
    console.error("PDF PARSE ERROR:", err);
    return "";
  }
}

module.exports = { extractTextFromPDF };