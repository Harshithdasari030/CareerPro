import { useState, useEffect } from "react";

function App() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [missing, setMissing] = useState([]);
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [improvedResume, setImprovedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fade in
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animate score
  useEffect(() => {
    if (score > 0) {
      const timer = setTimeout(() => {
        if (animatedScore < score) {
          setAnimatedScore((prev) => Math.min(prev + 1, score));
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
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    }

    setLoading(false);
  };

  // 🔴 Highlight missing
  const highlightMissing = (text) => {
    if (!text) return "";

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

  // 📄 Download PDF
  const downloadPDF = async () => {
    try {
      const cleanHTML = resume.replace(/\n/g, "<br/>");

      const res = await fetch("http://localhost:5000/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: cleanHTML }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
    } catch (err) {
      console.error(err);
      alert("PDF download failed");
    }
  };

  // 🔥 Improve Resume
  const improveResume = async () => {
    if (!resume.trim()) {
      alert("Please enter resume first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume }),
      });

      const data = await res.json();
      setImprovedResume(data.improved || "");
    } catch (err) {
      console.error(err);
      alert("Rewrite failed");
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }} className={isLoaded ? "fade-in" : ""}>

      {/* LEFT */}
      <div style={{ width: "50%" }} className="card">
        <h2>Resume Input</h2>
        <textarea
          rows="10"
          style={{ width: "100%" }}
          placeholder="Paste your resume..."
          onChange={(e) => {
            setResume(e.target.value);
            setSuggestions([]);
            setImprovedResume("");
          }}
        />

        <h2>Job Description</h2>
        <textarea
          rows="10"
          style={{ width: "100%" }}
          placeholder="Paste JD..."
          onChange={(e) => {
            setJd(e.target.value);
            setSuggestions([]);
          }}
        />

        <button onClick={analyzeJD} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze JD"}
        </button>

        <br /><br />

        <button onClick={downloadPDF}>
          Download Resume PDF
        </button>

        <br /><br />

        <button onClick={improveResume}>
          Improve Resume 🚀
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ width: "50%" }} className="card">

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

        <h2>💡 Suggestions</h2>
        {suggestions.length === 0 ? (
          <p>No suggestions yet</p>
        ) : (
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}

        <h2>ATS Score</h2>
        <h1>{animatedScore}%</h1>

        <h2>Resume Preview</h2>
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            minHeight: "150px",
          }}
          dangerouslySetInnerHTML={{
            __html: highlightMissing(resume),
          }}
        />

        <h2>Improved Resume</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {improvedResume || "Click 'Improve Resume'"}
        </pre>
      </div>
    </div>
  );
}

export default App;