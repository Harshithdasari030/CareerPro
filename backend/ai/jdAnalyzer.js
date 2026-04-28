const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeJD(jobDescription) {

  // 👇 REPLACE EVERYTHING INSIDE FUNCTION WITH THIS
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Say hello",
  });

  return response.text;
}

module.exports = analyzeJD;