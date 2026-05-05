const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ KEYWORD EXTRACTION (rule-based)
// ✅ KEYWORD EXTRACTION
const commonSkills = [
  "react",
  "react.js",
  "javascript",
  "node",
  "node.js",
  "mongodb",
  "express",
  "html",
  "css",
  "git",
  "rest",
  "api",
  "problem solving",
  "ai",
  "machine learning",
  "typescript",
];

function extractKeywords(jd) {
  const jdText = (jd || "").toLowerCase();

  return commonSkills.filter((skill) =>
    jdText.includes(skill)
  );
}

// ✅ AI SUGGESTIONS
async function generateSuggestions({ resume, keywords, missing }) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest", // ✅ FIXED
    });

    const prompt = `
You are an ATS resume expert.

Resume:
${resume}

Keywords:
${keywords.join(", ")}

Missing:
${missing.join(", ")}

Rules:
- If no keywords are missing, DO NOT suggest adding keywords
- Give only useful improvements
- Max 5 suggestions

Return ONLY JSON:
{
  "suggestions": ["..."]
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    console.log("AI RAW:", text);

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return [];

    const parsed = JSON.parse(match[0]);

    return parsed.suggestions || [];

  } catch (err) {
    console.error("AI ERROR:", err);

    return [
      "Improve project descriptions with impact",
      "Add measurable achievements",
      "Highlight technical skills clearly",
    ];
  }
}
// ✅ EXPORT (IMPORTANT)

async function rewriteResume(resume) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a professional resume writer.

Rewrite this resume to improve clarity, ATS score, and impact.

Resume:
${resume}

Rules:
- Keep same structure
- Improve wording
- Use strong action verbs
- Add impact where possible
- Make it professional

Return ONLY plain text.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;

  } catch (err) {
    console.error("REWRITE ERROR:", err);
    return resume; // fallback
  }
}
module.exports = {
  extractKeywords,
  generateSuggestions,
  rewriteResume,
};