require("dotenv").config();

const express = require("express");
const cors = require("cors");

console.log(process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const analyzeJD = require("./ai/jdAnalyzer");

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// const USE_AI = false; // change to true tomorrow

// app.get("/test-ai", async (req, res) => {
//   if (USE_AI) {
//     try {
//       const sampleJD = "Looking for a React developer";
//       const result = await analyzeJD(sampleJD);
//       res.send(result);
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("AI Error");
//     }

app.post("/test-ai", (req, res) => {
  const jd = req.body.jd;

  const dummyResponse = {
    skills: ["React", "Node.js"],
    keywords: ["frontend", "API"],
    summary: "This role requires a React developer with backend knowledge."
  };

  res.json(dummyResponse);
});

app.listen(5001, () => {
  console.log("Server running on port 5000");
});
app.use(express.json());

app.post("/analyze-jd", (req, res) => {
  const { jd } = req.body;

  // temporary dummy response
  res.json({
    keywords: ["React", "Node", "MongoDB"],
  });
});
