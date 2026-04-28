require("dotenv").config();

const express = require("express");
const cors = require("cors");

<<<<<<< HEAD
const analyzeJD = require("./ai/jdAnalyzer");

const app = express();

// ✅ MIDDLEWARE (always top)
=======
const app = express();

>>>>>>> df8fb63 (Setup frontend + backend with proper gitignore)
app.use(cors());
app.use(express.json());

console.log("API KEY:", process.env.GEMINI_API_KEY);

<<<<<<< HEAD
// ✅ TEST ROUTE
=======
// ✅ Root route
>>>>>>> df8fb63 (Setup frontend + backend with proper gitignore)
app.get("/", (req, res) => {
  res.send("Backend is running");
});

<<<<<<< HEAD
// ✅ JD ANALYSIS (dummy for now)
app.post("/analyze-jd", (req, res) => {
  const { jd } = req.body;

  res.json({
    keywords: ["React", "Node", "MongoDB"],
  });
});

// ✅ TEST AI ROUTE
=======
// ✅ JD Analyzer (important)
app.post("/analyze-jd", (req, res) => {
  console.log("API HIT"); // 👈 debug

  const { jd } = req.body;

  res.json({
    keywords: ["React", "Node", "MongoDB"],
  });
});

// ✅ Optional test route
>>>>>>> df8fb63 (Setup frontend + backend with proper gitignore)
app.post("/test-ai", (req, res) => {
  const dummyResponse = {
    skills: ["React", "Node.js"],
    keywords: ["frontend", "API"],
    summary: "This role requires a React developer with backend knowledge.",
  };

  res.json(dummyResponse);
});

<<<<<<< HEAD
// ✅ SERVER START (always LAST)
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
=======
// ✅ RUN SERVER (correct port)
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
>>>>>>> df8fb63 (Setup frontend + backend with proper gitignore)
