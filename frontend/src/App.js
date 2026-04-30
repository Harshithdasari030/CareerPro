import { useState } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [missing, setMissing] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔍 Analyze JD
  const analyzeJD = async () => {
    if (!jd.trim() || !resume.trim()) {
      alert("Please enter both Resume and Job Description");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/analyze-jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jd, resume }),
      });

      const data = await res.json();

      setKeywords(data.keywords || []);
      setMissing(data.missing || []);
      setScore(data.score || 0);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    }

    setLoading(false);
  };

  // 🔴 Highlight missing keywords in resume
  const highlightMissing = (text) => {
    let highlighted = text;

    missing.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlighted = highlighted.replace(
        regex,
        `<span style="color:red;font-weight:bold">$1</span>`
      );
    });

    return highlighted.replace(/\n/g, "<br/>");
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

        <button onClick={analyzeJD} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze JD"}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "50%" }}>
        <h2>Keywords</h2>
        {keywords.length === 0 ? (
          <p>No keywords yet</p>
        ) : (
          <ul>
            {keywords.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        )}

        <h2>Missing Keywords</h2>
        {missing.length === 0 ? (
          <p>None 🎉</p>
        ) : (
          <ul style={{ color: "red" }}>
            {missing.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        )}

        <h2>ATS Score</h2>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          {score}%
        </p>

        <h2>Resume Preview</h2>
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            minHeight: "150px",
            background: "#f9f9f9",
          }}
          dangerouslySetInnerHTML={{
            __html: highlightMissing(resume),
          }}
        />
      </div>
    </div>
  );
}

export default App;