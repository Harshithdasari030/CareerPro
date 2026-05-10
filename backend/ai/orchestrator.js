const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ KEYWORD EXTRACTION (rule-based)
// ✅ KEYWORD EXTRACTION


function extractKeywords(jd) {

  if (!jd) return [];

  const text = jd.toLowerCase();

  // common tech terms to detect dynamically
  const techWords = [
    "react",
    "react.js",
    "javascript",
    "typescript",
    "node",
    "node.js",
    "mongodb",
    "express",
    "express.js",
    "html",
    "css",
    "git",
    "rest api",
    "api",
    "machine learning",
    "ai",
    "firebase",
    "socket.io",
    "docker",
    "aws",
    "tailwind",
    "redux",
    "figma",
    "next.js",
    "mysql",
    "python",
    "java",
    "c++",
    "networking",
  "platform testing",
  "automation",
  "automation testing",
  "testing",
  "regression testing",
  "interoperability",
  "ci/cd",
  "firmware",
  "hardware",
  "infrastructure",
  "ethernet",
  "poe",
  "switch",
  "network interfaces",
  "validation",
  "selenium",
  "pytest",
  "linux",
  ];

  const found = techWords.filter((skill) =>
    text.includes(skill.toLowerCase())
  );

  return [...new Set(found)];
}

// ✅ AI SUGGESTIONS
async function generateSuggestions({ resume, keywords, missing }) {
  const shortResume = (resume || "").slice(0, 3000);
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // ✅ FIXED
    });

    const prompt = `
You are a professional ATS resume optimizer.

Rewrite this resume specifically for the given job description.

JOB DESCRIPTION:
${jd}

RESUME:
${shortResume}

Rules:
- Improve ATS alignment
- Highlight relevant technical skills
- Emphasize Python, backend, automation, APIs
- Improve project descriptions
- Use stronger action verbs
- Make achievements more impactful
- Keep professional formatting
- Return ONLY plain text
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
   console.log("⚠️ Gemini unavailable. Using fallback suggestions.");

    return [
      "Improve project descriptions with impact",
      "Add measurable achievements",
      "Highlight technical skills clearly",
    ];
  }
}
// ✅ EXPORT (IMPORTANT)

async function rewriteResume(resume, jd) {

  try {

    const shortResume = resume.slice(0, 3000);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are a professional ATS resume writer.

Rewrite this resume specifically for the given job description.

JOB DESCRIPTION:
${jd}

RESUME:
${shortResume}

Rules:
- Improve ATS alignment
- Highlight relevant technical skills
- Use stronger action verbs
- Improve project descriptions
- Keep professional formatting
- Return ONLY plain text
`;

    const result =
      await model.generateContent(prompt);

    return result.response.text();

  } catch (err) {

   console.log(
  "⚠️ Gemini unavailable. Using smart fallback."
);

const lowerJD = jd.toLowerCase();

let improved =
  "Suggested Resume Improvements:\n\n";

// ==================================
// FRONTEND ROLE
// ==================================

if (
  lowerJD.includes("react") ||
  lowerJD.includes("frontend")
) {

  improved +=
`• Use stronger frontend impact statements
• Highlight scalable React application development
• Mention responsive UI optimization and performance improvements

`;
}

// ==================================
// TESTING / AUTOMATION ROLE
// ==================================

if (
  lowerJD.includes("testing") ||
  lowerJD.includes("automation") ||
  lowerJD.includes("ci/cd")
) {

  improved +=
`• Mention backend testing and debugging experience
• Highlight automation workflows and API validation
• Add exposure to CI/CD pipelines if applicable

`;
}

// ==================================
// NETWORKING ROLE
// ==================================

if (
  lowerJD.includes("network") ||
  lowerJD.includes("infrastructure") ||
  lowerJD.includes("hardware")
) {

  improved +=
`• Emphasize networking and infrastructure interests
• Highlight scalable backend and distributed systems
• Mention system integration and problem-solving abilities

`;
}

// ==================================
// PYTHON / AI ROLE
// ==================================

if (
  lowerJD.includes("python") ||
  lowerJD.includes("ai") ||
  lowerJD.includes("machine learning")
) {

  improved +=
`• Highlight Python and AI project experience
• Mention TensorFlow and Computer Vision projects
• Add measurable AI project outcomes where possible

`;
}

// ==================================
// GENERAL IMPROVEMENTS
// ==================================

improved +=
`• Use stronger action verbs consistently
• Add measurable achievements in projects
• Quantify internship and project impact
`;

return improved;
  }
}
module.exports = {
  extractKeywords,
  generateSuggestions,
  rewriteResume,
};