require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  extractKeywords,
  generateSuggestions,
  rewriteResume,
} = require("./ai/orchestrator");

const generatePDF = require("./utils/pdfGenerator");
const { extractTextFromPDF } = require("./utils/pdfParser");

const app = express();


// ===============================
// ✅ Uploads Folder
// ===============================

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}


// ===============================
// ✅ Multer Config
// ===============================

const upload = multer({
  dest: uploadPath,
});


// ===============================
// ✅ Middleware
// ===============================

app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.GEMINI_API_KEY);


// ===============================
// ✅ Root Route
// ===============================

app.get("/", (req, res) => {
  res.send("Backend is running");
});


// ===============================
// 🚀 Upload Resume
// ===============================

app.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }

      const filePath = req.file.path;

      console.log("📄 FILE RECEIVED:", filePath);

      const text = await extractTextFromPDF(filePath);

      // delete uploaded file
      fs.unlinkSync(filePath);

      console.log("📄 PDF TEXT:", text?.slice(0, 200));

      // validate extracted text
      if (!text || text.trim().length < 20) {

        return res.status(400).json({
          error:
            "Could not extract text. Please upload a text-based PDF.",
        });
      }

      res.json({
        text,
      });

    } catch (err) {

      console.error("UPLOAD ERROR:", err);

      res.status(500).json({
        error: "File processing failed",
      });
    }
  }
);


// ===============================
// 🚀 ATS Analyzer
// ===============================

app.post("/analyze-jd", async (req, res) => {

  try {

    const { jd, resume } = req.body;

    // ✅ Extract keywords dynamically from JD
    const keywords = extractKeywords(jd);

    const cleanKeywords = [
      ...new Set(
        keywords.map((k) =>
          k.toLowerCase().replace(/\.js/g, "").trim()
        )
      ),
    ];

    const resumeText = (resume || "").toLowerCase();

    // ✅ Match checker
    const isMatch = (keyword) => {

      const k = keyword
        .toLowerCase()
        .replace(/\.js/g, "")
        .trim();

      return resumeText.includes(k);
    };

    // ✅ Matched + Missing
    const matchedKeywords =
      cleanKeywords.filter(isMatch);

    const missingKeywords =
      cleanKeywords.filter((k) => !isMatch(k));

    // ===============================
    // ✅ Better ATS Score
    // ===============================

    let score = 0;

    if (cleanKeywords.length > 0) {

      const matchPercentage =
        matchedKeywords.length /
        cleanKeywords.length;

      score = Math.round(matchPercentage * 100);

      // avoid fake perfect scores
      if (
        score === 100 &&
        cleanKeywords.length < 8
      ) {
        score = 85;
      }

      // realistic cap
      if (score > 95) {
        score = 95;
      }
    }

    // ===============================
    // ✅ Fit Level
    // ===============================

    let fitLevel = "";

    if (score >= 85) {
      fitLevel = "Excellent Match";
    }
    else if (score >= 70) {
      fitLevel = "Good Match";
    }
    else if (score >= 50) {
      fitLevel = "Moderate Match";
    }
    else {
      fitLevel = "Low Match";
    }

    // ===============================
    // ✅ Suggestions
    // ===============================

    let suggestions = [];

    try {

      suggestions =
        await generateSuggestions({
          resume,
          keywords: cleanKeywords,
          missing: missingKeywords,
        });

    } catch (err) {

      console.log(
        "⚠️ Suggestions fallback"
      );

      // dynamic fallback suggestions
      suggestions =
        missingKeywords.map(
          (k) =>
            `Add or improve skills related to ${k}`
        );
    }

    // ===============================
    // ✅ Response
    // ===============================

    res.json({
      keywords: cleanKeywords,
      matched: matchedKeywords,
      missing: missingKeywords,
      score,
      fitLevel,
      suggestions,
    });

  } catch (err) {

    console.error("❌ ATS ERROR:", err);

    res.status(200).json({
      keywords: [],
      matched: [],
      missing: [],
      score: 0,
      fitLevel: "Unknown",
      suggestions: [],
    });
  }
});


// ===============================
// 📄 Download PDF
// ===============================

app.post("/download-pdf", async (req, res) => {

  try {

    const { html } = req.body;

    const pdf = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        "attachment; filename=resume.pdf",
    });

    res.send(pdf);

  } catch (err) {

    console.error(err);

    res.status(500).send("PDF Error");
  }
});


// ===============================
// ✨ Rewrite Resume
// ===============================

app.post("/rewrite", async (req, res) => {

  try {

    const { resume, jd } = req.body;

   const improved =
  await rewriteResume(resume, jd);

    res.json({
      improved,
    });

  } catch (err) {

    console.error(err);

    res.status(500).send("Rewrite error");
  }
});


// ===============================
// ✅ Server Start
// ===============================

app.listen(5000, () => {
  console.log(
    "Server running on http://localhost:5000"
  );
});