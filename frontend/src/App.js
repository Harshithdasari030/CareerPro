import { useState } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [keywords, setKeywords] = useState([]);

  const analyzeJD = async () => {
    const res = await fetch("http://localhost:5000/analyze-jd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jd }),
    });

    const data = await res.json();
    setKeywords(data.keywords);
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
      
      {/* LEFT SIDE */}
      <div style={{ width: "50%" }}>
        <h2>Resume Input</h2>
        <textarea
          rows="10"
          style={{ width: "100%" }}
          placeholder="Paste your resume..."
          onChange={(e) => setResume(e.target.value)}
        />

        <h2>Job Description</h2>
        <textarea
          rows="10"
          style={{ width: "100%" }}
          placeholder="Paste JD..."
          onChange={(e) => setJd(e.target.value)}
        />

        <button onClick={analyzeJD}>Analyze JD</button>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "50%" }}>
        <h2>Keywords</h2>
        <ul>
          {keywords.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
