import { useState, useEffect } from "react";

function App() {

  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");

  const [keywords, setKeywords] = useState([]);
  const [missing, setMissing] = useState([]);

  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  const [suggestions, setSuggestions] = useState([]);
  const [improvedResume, setImprovedResume] = useState("");

  const [fitLevel, setFitLevel] = useState("");

  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);


  // ===============================
  // ✅ ATS SCORE ANIMATION
  // ===============================

  useEffect(() => {

    setAnimatedScore(0);

    if (score > 0) {

      const interval = setInterval(() => {

        setAnimatedScore((prev) => {

          if (prev >= score) {
            clearInterval(interval);
            return score;
          }

          return prev + 1;
        });

      }, 15);

      return () => clearInterval(interval);
    }

  }, [score]);


  // ===============================
  // ✅ SCORE COLOR
  // ===============================

  const getScoreColor = () => {

    if (score >= 80) {
      return "from-green-400 to-emerald-500";
    }

    if (score >= 60) {
      return "from-yellow-400 to-orange-500";
    }

    return "from-red-400 to-red-600";
  };


  // ===============================
  // 🚀 UPLOAD RESUME
  // ===============================

  const uploadResume = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("resume", file);

    try {

      const res = await fetch(
        "http://localhost:5000/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResume(data.text || "");

    } catch (err) {

      console.error(err);

      alert("Upload failed");
    }
  };


  // ===============================
  // 🔍 ANALYZE JD
  // ===============================

  const analyzeJD = async () => {

    if (!jd.trim() || !resume.trim()) {

      alert(
        "Please enter both Resume and Job Description"
      );

      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/analyze-jd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            jd,
            resume,
          }),
        }
      );

      const data = await res.json();

      setKeywords(data.keywords || []);

      setMissing(data.missing || []);

      setScore(data.score || 0);

      setSuggestions(data.suggestions || []);

      setFitLevel(data.fitLevel || "");

    } catch (err) {

      console.error(err);

      alert("Backend error");
    }

    setLoading(false);
  };


  // ===============================
  // 🔴 HIGHLIGHT MISSING
  // ===============================

  const highlightMissing = (text) => {

    if (!text) return "";

    let highlighted = text;

    missing.forEach((word) => {

      const regex = new RegExp(
        `(${word})`,
        "gi"
      );

      highlighted = highlighted.replace(
        regex,
        `<span style="color:red;font-weight:bold">${word}</span>`
      );
    });

    return highlighted.replace(/\n/g, "<br/>");
  };


  // ===============================
  // 📄 DOWNLOAD PDF
  // ===============================

  const downloadPDF = async () => {

    try {

      const html = highlightMissing(resume);

      const res = await fetch(
        "http://localhost:5000/download-pdf",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            html,
          }),
        }
      );

      const blob = await res.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download = "resume.pdf";

      a.click();

    } catch (err) {

      console.error(err);

      alert("PDF download failed");
    }
  };


  // ===============================
  // 🚀 IMPROVE RESUME
  // ===============================

  const improveResume = async () => {

    if (!resume.trim()) {

      alert("Please upload resume first");

      return;
    }

    setImproving(true);

    try {

      const res = await fetch(
        "http://localhost:5000/rewrite",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resume,
            jd,
          }),
        }
      );

      const data = await res.json();

      setImprovedResume(
        data.improved ||
        "No improvements generated."
      );

    } catch (err) {

      console.error(err);

      setImprovedResume(
        "Unable to improve resume right now."
      );
    }

    setImproving(false);
  };


  // ===============================
  // ✅ UI
  // ===============================

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}

      <div className="text-center mb-10">

        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CareerPro ATS Analyzer 🚀
        </h1>

        <p className="text-slate-400 mt-3">
          AI-powered Resume Optimization Platform
        </p>

      </div>


      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* LEFT */}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">

          <h2 className="text-2xl font-semibold mb-4">
            Resume Input
          </h2>

          {/* Upload */}

          <input
            type="file"
            accept="application/pdf"
            onChange={uploadResume}
            className="mb-4 block w-full text-sm text-slate-300"
          />

          {/* Resume */}

          <textarea
            rows="12"
            value={resume}
            onChange={(e) =>
              setResume(e.target.value)
            }
            placeholder="Paste your resume..."
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-6"
          />

          <h2 className="text-2xl font-semibold mb-4">
            Job Description
          </h2>

          {/* JD */}

          <textarea
            rows="12"
            value={jd}
            onChange={(e) =>
              setJd(e.target.value)
            }
            placeholder="Paste Job Description..."
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />


          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4 mt-6">

            <button
              onClick={analyzeJD}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold"
            >
              {loading
                ? "Analyzing..."
                : "Analyze JD"}
            </button>


            <button
              onClick={downloadPDF}
              className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition font-semibold"
            >
              Download PDF
            </button>


            <button
              onClick={improveResume}
              disabled={improving}
              className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition font-semibold"
            >
              {improving
                ? "Improving..."
                : "Improve Resume 🚀"}
            </button>

          </div>
        </div>


        {/* RIGHT */}

        <div className="space-y-6">


          {/* ATS SCORE */}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">

            <h2 className="text-2xl font-semibold mb-4">
              ATS Score
            </h2>

            <div className="w-full bg-slate-800 rounded-full h-6 overflow-hidden">

              <div
                className={`h-6 rounded-full bg-gradient-to-r ${getScoreColor()} transition-all duration-700`}
                style={{
                  width: `${animatedScore}%`,
                }}
              />
            </div>

            <p className="text-4xl font-bold mt-4 text-cyan-400">
              {animatedScore}%
            </p>

            {fitLevel && (
              <p className="mt-2 text-slate-300">
                Fit Level:
                <span className="font-semibold text-cyan-300 ml-2">
                  {fitLevel}
                </span>
              </p>
            )}
          </div>


          {/* KEYWORDS */}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">

            <h2 className="text-2xl font-semibold mb-4">
              Keywords
            </h2>

            <div className="flex flex-wrap gap-2">

              {keywords.length === 0 ? (
                <p className="text-slate-400">
                  No keywords found
                </p>
              ) : (
                keywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/20"
                  >
                    {k}
                  </span>
                ))
              )}
            </div>
          </div>


          {/* MISSING */}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">

            <h2 className="text-2xl font-semibold mb-4">
              Missing Keywords
            </h2>

            {missing.length === 0 ? (

              <p className="text-green-400 font-semibold">
                None 🎉
              </p>

            ) : (

              <div className="flex flex-wrap gap-2">

                {missing.map((k, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/20"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>


          {/* SUGGESTIONS */}

          {suggestions.length > 0 && (

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">

              <h2 className="text-2xl font-semibold mb-4">
                💡 Suggestions
              </h2>

              <ul className="space-y-2">

                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="bg-slate-900 p-3 rounded-xl"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}


          {/* IMPROVED RESUME */}

          {improvedResume && (

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">

              <h2 className="text-2xl font-semibold mb-4">
                Improved Resume
              </h2>

              <pre className="whitespace-pre-wrap text-slate-300">
                {improvedResume}
              </pre>
            </div>
          )}


          {/* PREVIEW */}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-lg">

            <h2 className="text-2xl font-semibold mb-4">
              Resume Preview
            </h2>

            <div
              className="bg-slate-900 p-4 rounded-xl text-slate-300"
              dangerouslySetInnerHTML={{
                __html:
                  highlightMissing(resume),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;