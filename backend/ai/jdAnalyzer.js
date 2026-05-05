const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeJD(jobDescription) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `
Extract important technical keywords from this job description.

Return ONLY a JSON array like:
["react", "node.js", "api"]

Job Description:
${jobDescription}
`
  });

  const text = response.text;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.log("Parsing error:", text);
    return [];
  }
}

module.exports = analyzeJD;