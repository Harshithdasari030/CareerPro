require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeJD = require("./ai/jdAnalyzer");

const app = express();

// ✅ MIDDLEWARE (always top)
app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.GEMINI_API_KEY);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ✅ JD ANALYSIS (dummy for now)
app.post("/analyze-jd", (req, res) => {
  const { jd } = req.body;

  res.json({
    keywords: ["React", "Node", "MongoDB"],
  });
});

// ✅ TEST AI ROUTE
app.post("/test-ai", (req, res) => {
  const jd = req.body.jd;

  const dummyResponse = {
    skills: ["React", "Node.js"],
    keywords: ["frontend", "API"],
    summary: "This role requires a React developer with backend knowledge.",
  };

  res.json(dummyResponse);
});

// ✅ SERVER START (always LAST)
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
