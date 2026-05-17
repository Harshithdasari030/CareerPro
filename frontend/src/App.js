import { useState, useEffect, useRef } from "react";
import "./App.css";

// ─── SVG icons as inline components ──────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  home:         "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users:        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  data:         "M3 3h18v4H3z M3 10h18v4H3z M3 17h18v4H3z",
  apps:         "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  integrations: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  settings:     "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  search:       "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  bell:         "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  menu:         "M3 12h18 M3 6h18 M3 18h18",
  sun:          "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42 M12 5a7 7 0 100 14A7 7 0 0012 5z",
  moon:         "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  upload:       "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  download:     "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  sparkle:      "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z",
  chart:        "M18 20V10 M12 20V4 M6 20v-6",
  eye:          "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8 M12 9a3 3 0 100 6 3 3 0 000-6z",
  user:         "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  tag:          "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
};

// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",         label: "Home",         icon: "home",         section: "main" },
  { id: "users",        label: "Users",        icon: "users",        section: "main" },
  { id: "data",         label: "Data",         icon: "data",         section: "main" },
  { id: "apps",         label: "Apps",         icon: "apps",         section: "main" },
  { id: "integrations", label: "Integrations", icon: "integrations", section: "main" },
];

const NAV_BOTTOM = [
  { id: "settings", label: "Settings", icon: "settings" },
];

// ─── Score color helper ───────────────────────────────────────────────────────
function getScoreClass(score) {
  if (score >= 80) return "high";
  if (score >= 55) return "mid";
  return "low";
}

function getFitBadge(fitLevel, score) {
  if (fitLevel) return fitLevel;
  if (score >= 80) return "Strong Match";
  if (score >= 55) return "Moderate Match";
  return "Weak Match";
}

function getFitClass(score) {
  if (score >= 80) return "good";
  if (score >= 55) return "fair";
  return "low";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  // ── Theme ──
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("cp-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("cp-theme", dark ? "dark" : "light");
  }, [dark]);

  // ── Sidebar ──
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  // ── App state ──
  const [resume, setResume]               = useState("");
  const [jd, setJd]                       = useState("");
  const [keywords, setKeywords]           = useState([]);
  const [missing, setMissing]             = useState([]);
  const [score, setScore]                 = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [suggestions, setSuggestions]     = useState([]);
  const [improvedResume, setImprovedResume] = useState("");
  const [fitLevel, setFitLevel]           = useState("");
  const [loading, setLoading]             = useState(false);
  const [improving, setImproving]         = useState(false);
  const [fileName, setFileName]           = useState("No file chosen");

  // ── Score animation ──
  useEffect(() => {
    setAnimatedScore(0);
    if (score > 0) {
      const step = Math.max(1, Math.ceil(score / 60));
      const interval = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev >= score) { clearInterval(interval); return score; }
          return Math.min(prev + step, score);
        });
      }, 16);
      return () => clearInterval(interval);
    }
  }, [score]);

  // ── Handlers ──
  const fileRef = useRef(null);

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res  = await fetch("http://localhost:5000/upload-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setResume(data.text || "");
    } catch { alert("Upload failed"); }
  };

  const analyzeJD = async () => {
    if (!jd.trim() || !resume.trim()) {
      alert("Please enter both Resume and Job Description");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd, resume }),
      });
      const data = await res.json();
      setKeywords(data.keywords   || []);
      setMissing(data.missing     || []);
      setScore(data.score         || 0);
      setSuggestions(data.suggestions || []);
      setFitLevel(data.fitLevel   || "");
    } catch { alert("Backend error"); }
    setLoading(false);
  };

  const highlightMissing = (text) => {
    if (!text) return "";
    let h = text;
    missing.forEach(word => {
      const rx = new RegExp(`(${word})`, "gi");
      h = h.replace(rx, `<span style="color:var(--red);font-weight:600">${word}</span>`);
    });
    return h.replace(/\n/g, "<br/>");
  };

  const downloadPDF = async () => {
    try {
      const html = highlightMissing(resume);
      const res  = await fetch("http://localhost:5000/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = "resume.pdf"; a.click();
    } catch { alert("PDF download failed"); }
  };

  const improveResume = async () => {
    if (!resume.trim()) { alert("Please upload resume first"); return; }
    setImproving(true);
    try {
      const res  = await fetch("http://localhost:5000/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd }),
      });
      const data = await res.json();
      setImprovedResume(data.improved || "No improvements generated.");
    } catch { setImprovedResume("Unable to improve resume right now."); }
    setImproving(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`app-shell${dark ? " dark" : ""}`}>

      {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
      <nav className={`sidebar${collapsed ? " collapsed" : ""}`} aria-label="Primary navigation">

        {/* Brand */}
        <div className="sidebar-brand" onClick={() => setActiveNav("home")}>
          <div className="brand-icon">🚀</div>
          <div className="brand-text">
            <span className="brand-name">CareerPro</span>
            <span className="brand-sub">ATS Analyzer</span>
          </div>
        </div>

        {/* Nav list */}
        <div className="sidebar-nav" role="menu">
          <div className="nav-section-label">Main</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              role="menuitem"
              className={`nav-item${activeNav === item.id ? " active" : ""}`}
              onClick={() => setActiveNav(item.id)}
              tabIndex={0}
              aria-current={activeNav === item.id ? "page" : undefined}
              data-tip={collapsed ? item.label : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                <Icon d={Icons[item.icon]} size={17} />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer nav */}
        <div className="sidebar-footer">
          <hr className="divider" />
          <div className="nav-section-label" style={{ paddingTop: 8 }}>Account</div>
          {/* User row */}
          <button className="nav-item" tabIndex={0} data-tip={collapsed ? "Profile" : undefined}>
            <span className="nav-icon"><Icon d={Icons.user} size={17} /></span>
            <span className="nav-label">Profile</span>
          </button>
          {NAV_BOTTOM.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeNav === item.id ? " active" : ""}`}
              onClick={() => setActiveNav(item.id)}
              tabIndex={0}
              data-tip={collapsed ? item.label : undefined}
            >
              <span className="nav-icon"><Icon d={Icons[item.icon]} size={17} /></span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── MAIN AREA ──────────────────────────────────────────────────── */}
      <div className="main-area">

        {/* Top Bar */}
        <header className="top-bar" role="banner">
          <button
            className="topbar-hamburger"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <Icon d={Icons.menu} size={20} />
          </button>

          {/* Search */}
          <div className="topbar-search-wrap" role="search">
            <span className="topbar-search-icon" aria-hidden="true">
              <Icon d={Icons.search} size={14} />
            </span>
            <input
              type="search"
              className="topbar-search"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>

          {/* Right actions */}
          <div className="topbar-right">
            {/* Notifications */}
            <button className="topbar-icon-btn" aria-label="Notifications">
              <Icon d={Icons.bell} size={17} />
              <span className="notif-dot" aria-hidden="true" />
            </button>

            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={() => setDark(d => !d)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark
                ? <><Icon d={Icons.sun}  size={13} /> Light</>
                : <><Icon d={Icons.moon} size={13} /> Dark</>}
            </button>

            {/* Avatar */}
            <div className="avatar" role="button" tabIndex={0} aria-label="User profile">
              CP
            </div>
          </div>
        </header>

        {/* ── Content ────────────────────────────────────────────────── */}
        <main className="content-area" id="main-content" tabIndex={-1}>

          {/* Page header */}
          <div className="page-header fade-in">
            <h1 className="page-title">
              <span className="page-title-accent">CareerPro</span>&nbsp;ATS Analyzer&nbsp;🚀
            </h1>
            <p className="page-subtitle">AI-powered Resume Optimization Platform</p>
          </div>

          {/* Two-panel grid */}
          <div className="analyzer-grid">

            {/* ── LEFT PANEL ────────────────────────────────────────── */}
            <div className="left-panel">

              {/* Resume Input card */}
              <article className="card fade-in">
                <div className="card-header">
                  <span className="card-icon">📝</span>
                  <h2 className="card-title">Resume Input</h2>
                </div>

                {/* File upload */}
                <div className="file-upload-row">
                  <button
                    className="upload-btn"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Choose resume file"
                  >
                    <Icon d={Icons.upload} size={13} />
                    Choose File
                  </button>
                  <span className="file-name">{fileName}</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={uploadResume}
                  />
                </div>

                <textarea
                  id="resume-input"
                  className="ats-textarea"
                  rows={9}
                  value={resume}
                  onChange={e => setResume(e.target.value)}
                  placeholder="Paste your resume text here..."
                  aria-label="Resume text"
                />
              </article>

              {/* Job Description card */}
              <article className="card fade-in">
                <div className="card-header">
                  <span className="card-icon">📋</span>
                  <h2 className="card-title">Job Description</h2>
                </div>
                <textarea
                  id="jd-input"
                  className="ats-textarea"
                  rows={9}
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  placeholder="Paste Job Description here..."
                  aria-label="Job description text"
                />

                {/* Action buttons */}
                <div className="btn-row" style={{ marginTop: 16 }}>
                  <button
                    id="analyze-btn"
                    className="btn btn-primary"
                    onClick={analyzeJD}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? <span className="spin" aria-hidden="true" /> : <Icon d={Icons.chart} size={14} />}
                    {loading ? "Analyzing…" : "Analyze JD"}
                  </button>

                  <button
                    id="pdf-btn"
                    className="btn btn-success"
                    onClick={downloadPDF}
                  >
                    <Icon d={Icons.download} size={14} />
                    Download PDF
                  </button>

                  <button
                    id="improve-btn"
                    className="btn btn-purple"
                    onClick={improveResume}
                    disabled={improving}
                    aria-busy={improving}
                  >
                    {improving ? <span className="spin" aria-hidden="true" /> : <Icon d={Icons.sparkle} size={14} />}
                    {improving ? "Improving…" : "Improve Resume ✨"}
                  </button>
                </div>
              </article>
            </div>

            {/* ── RIGHT PANEL ───────────────────────────────────────── */}
            <div className="right-panel">

              {/* ATS Score */}
              <article className="card fade-in" aria-label="ATS Score">
                <div className="card-header">
                  <span className="card-icon">📊</span>
                  <h2 className="card-title">ATS Score</h2>
                </div>
                <div className="progress-track" role="progressbar" aria-valuenow={animatedScore} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className={`progress-fill ${getScoreClass(score)}`}
                    style={{ width: `${animatedScore}%` }}
                  />
                </div>
                <p className="score-value">{animatedScore}%</p>
                {(fitLevel || score > 0) && (
                  <span className={`fit-badge ${getFitClass(score)}`}>
                    {getFitBadge(fitLevel, score)}
                  </span>
                )}
              </article>

              {/* Keywords */}
              <article className="card fade-in">
                <div className="card-header">
                  <span className="card-icon">🔍</span>
                  <h2 className="card-title">Keywords</h2>
                </div>
                {keywords.length === 0 ? (
                  <p className="empty-state">No keywords found</p>
                ) : (
                  <div className="tags-wrap" role="list" aria-label="Matched keywords">
                    {keywords.map((k, i) => (
                      <span key={i} className="tag tag-keyword" role="listitem">{k}</span>
                    ))}
                  </div>
                )}
              </article>

              {/* Missing Keywords */}
              <article className="card fade-in">
                <div className="card-header">
                  <span className="card-icon">⚠️</span>
                  <h2 className="card-title">Missing Keywords</h2>
                </div>
                {missing.length === 0 ? (
                  <span className="none-badge">None 🎉</span>
                ) : (
                  <div className="tags-wrap" role="list" aria-label="Missing keywords">
                    {missing.map((k, i) => (
                      <span key={i} className="tag tag-missing" role="listitem">{k}</span>
                    ))}
                  </div>
                )}
              </article>

              {/* Resume Preview */}
              <article className="card fade-in">
                <div className="card-header">
                  <span className="card-icon">👁️</span>
                  <h2 className="card-title">Resume Preview</h2>
                </div>
                {resume ? (
                  <div
                    className="resume-preview-box"
                    dangerouslySetInnerHTML={{ __html: highlightMissing(resume) }}
                    aria-label="Resume preview with highlighted missing keywords"
                  />
                ) : (
                  <div className="resume-preview-box">
                    <p className="empty-state">Your resume will appear here…</p>
                  </div>
                )}
              </article>

              {/* Suggestions (conditional) */}
              {suggestions.length > 0 && (
                <article className="card fade-in">
                  <div className="card-header">
                    <span className="card-icon">💡</span>
                    <h2 className="card-title">Suggestions</h2>
                  </div>
                  <div className="suggestion-list" role="list">
                    {suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="suggestion-item"
                        role="listitem"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {/* Improved Resume (conditional) */}
              {improvedResume && (
                <article className="card fade-in">
                  <div className="card-header">
                    <span className="card-icon">✨</span>
                    <h2 className="card-title">Improved Resume</h2>
                  </div>
                  <pre className="improved-pre">{improvedResume}</pre>
                </article>
              )}

            </div>{/* end right-panel */}
          </div>{/* end analyzer-grid */}
        </main>
      </div>{/* end main-area */}
    </div>/* end app-shell */
  );
}

export default App;