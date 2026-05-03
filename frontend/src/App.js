import { useState, useEffect } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [missing, setMissing] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fade in on load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animate score
  useEffect(() => {
    if (score > 0) {
      const timer = setTimeout(() => {
        if (animatedScore < score) {
          setAnimatedScore(prev => Math.min(prev + 1, score));
        }
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(0);
    }
  }, [score, animatedScore]);

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
    <div style={{ display: "flex", padding: "20px", gap: "20px" }} className={isLoaded ? "fade-in" : ""}>
      
      {/* LEFT SIDE */}
      <div style={{ width: "50%" }} className="card">
        <h2 className="section-heading resume-input">Resume Input</h2>
        <textarea
          rows="10"
          style={{ width: "100%" }}
          placeholder="Paste your resume..."
          onChange={(e) => setResume(e.target.value)}
          className="animated-textarea"
        />

        <h2 className="section-heading job-desc">Job Description</h2>
        <textarea
          rows="10"
          style={{ width: "100%" }}
          placeholder="Paste JD..."
          onChange={(e) => setJd(e.target.value)}
          className="animated-textarea"
        />

        <button onClick={analyzeJD} disabled={loading} className="animated-button">
          {loading ? "Analyzing..." : "Analyze JD"}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "50%" }} className="card">
        <h2 className="section-heading keywords">Keywords</h2>
        {keywords.length === 0 ? (
          <p>No keywords yet</p>
        ) : (
          <ul className="animated-list">
            {keywords.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        )}

        <h2 className="section-heading missing">Missing Keywords</h2>
        {missing.length === 0 ? (
          <p>None 🎉</p>
        ) : (
          <ul style={{ color: "red" }} className="animated-list">
            {missing.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        )}

        <h2 className="section-heading ats-score">ATS Score</h2>
        <div className="progress-ring">
          <svg className="progress-ring-circle" width="120" height="120">
            <circle className="progress-ring-bg" cx="60" cy="60" r="45"></circle>
            <circle
              className="progress-ring-fill"
              cx="60"
              cy="60"
              r="45"
              style={{ strokeDashoffset: 283 - (283 * animatedScore / 100) }}
            ></circle>
          </svg>
          <div className="ats-score">{animatedScore}</div>
        </div>

        <h2 className="section-heading preview">Resume Preview</h2>
        <div
          style={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "10px",
            minHeight: "150px",
            background: "rgba(255, 255, 255, 0.03)",
          }}
          className="resume-preview"
          dangerouslySetInnerHTML={{
            __html: highlightMissing(resume),
          }}
        />
      </div>
    </div>
  );
}

export default App;
