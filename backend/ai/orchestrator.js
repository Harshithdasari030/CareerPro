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
  "problem-solving",
  "ai",
  "machine learning",
  "typescript",
];

// 🔍 Keyword Extraction (Rule-based)
async function extractKeywords(jd) {
  try {
    console.log("🔥 RULE-BASED EXTRACTION");

    const jdText = (jd || "").toLowerCase();

    const keywords = commonSkills.filter((skill) =>
      jdText.includes(skill)
    );

    console.log("✅ KEYWORDS:", keywords);

    return keywords;
  } catch (err) {
    console.error("❌ ERROR:", err);
    return [];
  }
}

// ✨ Resume Rewrite (keep AI here only)
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function rewriteResume(resume, keywords) {
  try {
    console.log("✨ REWRITE RUNNING");

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const prompt = `
Rewrite this resume professionally and include these keywords naturally:

${keywords.join(", ")}

Resume:
${resume}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (err) {
    console.error("❌ REWRITE ERROR:", err);
    return "Error rewriting resume";
  }
}

module.exports = {
  extractKeywords,
  rewriteResume,
};