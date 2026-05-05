require("dotenv").config();
const analyzeJD = require("./ai/jdAnalyzer");
const express = require("express");
const cors = require("cors");

// 🔥 Orchestrator (AI layer)
const { generateSuggestions, rewriteResume } = require("./ai/orchestrator");

// 📄 PDF Generator
const generatePDF = require("./utils/pdfGenerator");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.GEMINI_API_KEY);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 🚀 AI JD Analyzer (MERGED VERSION)
app.post("/analyze-jd", async (req, res) => {
  try {
    const { jd, resume } = req.body;

    console.log("API HIT");

    let keywords = [];

    // 🔥 AI + fallback (from your friend)
    try {
      keywords = await analyzeJD(jd);
    } catch (err) {
      console.log("❌ AI ERROR:", err.message);

      keywords = [
        "react",
        "javascript",
        "html",
        "css",
        "node",
        "rest api",
        "git",
      ];
    }

    // ✅ CLEAN KEYWORDS (best practice)
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

    // ✅ SCORE
    let score = 0;
    if (cleanKeywords.length > 0) {
      score = Math.round(
        (matchedKeywords.length / cleanKeywords.length) * 100
      );
    }

    if (cleanKeywords.length < 5 && score === 100) {
      score = 80;
    }

    // 🔥 AI Suggestions (your feature)
    let suggestions = [];
    try {
      suggestions = await generateSuggestions({
        resume,
        keywords: cleanKeywords,
        missing: missingKeywords,
      });
    } catch (err) {
      console.log("⚠️ Suggestions fallback");
      suggestions = missingKeywords.map(k =>
        `Add or highlight experience related to ${k}`
      );
    }

    res.json({
      keywords: cleanKeywords,
      matched: matchedKeywords,
      missing: missingKeywords,
      score,
      suggestions,
    });

  } catch (err) {
    console.error("❌ FULL BACKEND ERROR:", err);

    // never crash frontend
    res.status(200).json({
      keywords: [],
      matched: [],
      missing: [],
      score: 0,
      suggestions: [],
      error: true,
    });
  }
});

// 📄 PDF DOWNLOAD
app.post("/download-pdf", async (req, res) => {
  try {
    const { html } = req.body;

    console.log("📥 RECEIVED HTML:", html);

    const pdf = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
    });

    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send("PDF Error");
  }
});

// ✨ Resume Rewrite
app.post("/rewrite", async (req, res) => {
  try {
    const { resume } = req.body;

    const improved = await rewriteResume(resume);

    res.json({ improved });
  } catch (err) {
    console.error(err);
    res.status(500).send("Rewrite error");
  }
});

// ✅ Test route
app.post("/test-ai", (req, res) => {
  res.json({
    skills: ["React", "Node.js"],
    keywords: ["frontend", "API"],
    summary: "This role requires a React developer with backend knowledge.",
  });
});

// ✅ Server start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});