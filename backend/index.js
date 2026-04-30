require("dotenv").config();

const express = require("express");
const cors = require("cors");

// 🔥 Orchestrator (AI layer)
const { extractKeywords, rewriteResume } = require("./ai/orchestrator");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.GEMINI_API_KEY);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 🚀 AI JD Analyzer (Improved ATS Logic)
app.post("/analyze-jd", async (req, res) => {
  try {
    const { jd, resume } = req.body;

    console.log("API HIT");

    const keywords = await extractKeywords(jd);

    const normalize = (text) => (text || "").toLowerCase();

    const resumeText = normalize(resume);

    // 🧠 Improved matching (handles "react" vs "react.js")
    const isMatch = (keyword) => {
      const k = keyword.toLowerCase().replace(/\.js/g, "").trim();
      return resumeText.includes(k);
    };

    // ✅ Matched Keywords
    const matchedKeywords = keywords.filter(isMatch);

    // ❌ Missing Keywords
    const missingKeywords = keywords.filter(
      (k) => !isMatch(k)
    );

    // 🎯 ATS Score (more realistic)
    let score = 0;

    if (keywords.length > 0) {
      score = Math.round(
        (matchedKeywords.length / keywords.length) * 100
      );
    }

    // 🔥 Prevent fake 100% if too few keywords
    if (keywords.length < 5 && score === 100) {
      score = 80;
    }

    res.json({
      keywords,
      matched: matchedKeywords,
      missing: missingKeywords,
      score,
    });

  } catch (err) {
    console.error("❌ ANALYZE ERROR:", err);
    res.status(500).send("AI Error");
  }
});

// ✨ Resume Rewrite
app.post("/rewrite", async (req, res) => {
  try {
    const { resume, keywords } = req.body;

    const output = await rewriteResume(resume, keywords);

    res.json({ output });
  } catch (err) {
    console.error("❌ REWRITE ERROR:", err);
    res.status(500).send("Rewrite Error");
  }
});

// ✅ Test route
app.post("/test-ai", (req, res) => {
  const dummyResponse = {
    skills: ["React", "Node.js"],
    keywords: ["frontend", "API"],
    summary: "This role requires a React developer with backend knowledge.",
  };

  res.json(dummyResponse);
});

// ✅ Server start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});