require("dotenv").config();
const analyzeJD = require("./ai/jdAnalyzer");
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

    let keywords = [];

    try {
      // keywords = await extractKeywords(jd);
      keywords = await analyzeJD(jd);
    } catch (err) {
      // console.log("⚠️ AI failed, using fallback");
      console.log("❌ AI ERROR:", err.message);
      console.log(err);

      keywords = [
        "react",
        "javascript",
        "html",
        "css",
        "node",
        "rest api",
        "git"
      ];
    }

    // ✅ CLEAN KEYWORDS
    const cleanKeywords = [...new Set(
      keywords.map(k => k.toLowerCase().replace(".js", "").trim())
    )];

    const normalize = (text) => (text || "").toLowerCase();
    const resumeText = normalize(resume);

    const isMatch = (keyword) => {
      const k = keyword.toLowerCase().replace(/\.js/g, "").trim();
      return resumeText.includes(k);
    };

    // ✅ MATCHING
    const matchedKeywords = cleanKeywords.filter(isMatch);
    const missingKeywords = cleanKeywords.filter(k => !isMatch(k));

    // ✅ SCORE (FIXED: use cleanKeywords, not keywords)
    let score = 0;
    if (cleanKeywords.length > 0) {
      score = Math.round(
        (matchedKeywords.length / cleanKeywords.length) * 100
      );
    }

    if (cleanKeywords.length < 5 && score === 100) {
      score = 80;
    }

    // ✅ SUGGESTIONS (your feature 👇🔥)
    const suggestions = missingKeywords.map(k =>
      `Add or highlight experience related to ${k}`
    );

    res.json({
      keywords: cleanKeywords,
      matched: matchedKeywords,
      missing: missingKeywords,
      score,
      suggestions
    });

  } catch (err) {
    console.error("❌ FULL BACKEND ERROR:", err);

    // ✅ IMPORTANT: never crash frontend
    res.status(200).json({
      keywords: [],
      matched: [],
      missing: [],
      score: 0,
      suggestions: [],
      error: true
    });
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