import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import HomePage from "./HomePage";

/**
 * Cinematic galaxy background and starfield overlay.
 * This is reused from existing App.js and MirrorVerseApp.js background logic.
 */
function GalaxyBackgroundWithStarfield() {
  // Starfield logic matching styling and animation from App.js
  const [starSeed] = useState(Math.random()); // unique for each mount, for static star positions
  const numStars = 180;
  function randomStars(seed) {
    function sfc32(a, b, c, d) {
      return function() {
        a |= 0; b |= 0; c |= 0; d |= 0;
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = c << 21 | c >>> 11;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
      }
    }
    const rand = sfc32(
      Math.floor(seed * 1e8),
      Math.floor(seed * 1e6),
      Math.floor(seed * 1e4),
      Math.floor(seed * 1e2)
    );
    return Array.from({length: numStars}, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 2.5 + 0.5,
      opacity: rand() * 0.8 + 0.3,
      anim: rand() * 20 + 6,
    }));
  }
  const stars = randomStars(starSeed);

  return (
    <div className="galaxy-bg">
      <div className="galaxy-core" />
      <div className="galaxy-accent1" />
      <div className="galaxy-accent2" />
      <div className="starfield" aria-hidden="true">
        {stars.map(star => (
          <span
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${star.anim}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Navbar with NeuroVerse logo and optional navigation.
 */
function NeuroVerseNav({ navs = [] }) {
  return (
    <nav className="nv-navbar" role="navigation" aria-label="Main">
      <div className="nv-logo"><span className="nv-logo-icon">✦</span> <span>NeuroVerse</span></div>
      <div style={{ display: "flex", gap: 22 }}>
        {navs.map(nav => (
          <NavLinkButton key={nav.route} {...nav} />
        ))}
      </div>
    </nav>
  );
}

function NavLinkButton({ label, route }) {
  const nav = useNavigate();
  return (
    <button
      style={{
        background: "var(--nv-accent)",
        color: "#fff",
        border: "none",
        borderRadius: 15,
        fontWeight: 800,
        padding: "8px 16px",
        fontFamily: "Orbitron, Inter, monospace",
        cursor: "pointer",
        fontSize: "1rem",
        marginLeft: 10,
        boxShadow: "0 0 7px #ff00ff55"
      }}
      onClick={() => nav(route)}
    >
      {label}
    </button>
  );
}

// --- Page: Home / Landing ---
function NeuroVerseHome({ onScenarioSubmit }) {
  // Compose form values for the Home Page
  return (
    <HomePage onBeginSimulation={onScenarioSubmit} />
  );
}

// --- Page: Simulation Path Selector ---
function PathSelector({ scenario, personality, onPathPicked, backToHome }) {
  // Placeholder branches for now
  const BRANCHES = [
    { id: "branch-1", name: "Revolutionary Career", desc: "A life-changing vocation" },
    { id: "branch-2", name: "Epic Romance", desc: "A love that transcends realities" },
    { id: "branch-3", name: "Infinite Journeys", desc: "Explore the unknown" }
  ];
  return (
    <main className="nv-simulation-main" style={{ alignItems: "flex-start", minHeight: "100vh" }}>
      <section className="nv-landing-content" style={{ margin: "70px auto", maxWidth: 650 }}>
        <h2 className="nv-title-glow" style={{ fontSize: "2.0rem" }}>Build Your Multiverse Path</h2>
        <p style={{ color: "var(--nv-accent)", marginTop: -12, marginBottom: 14 }}>
          Branch, fork, and select a life event as the journey diverges.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 23, justifyContent: "center" }}>
          {BRANCHES.map(branch => (
            <button
              key={branch.id}
              onClick={() => onPathPicked(branch)}
              style={{
                background: "linear-gradient(120deg,#0ff5,#ff00ffbb 95%)",
                color: "#fff",
                fontFamily: "Orbitron, Inter, monospace",
                fontWeight: 700,
                borderRadius: 16,
                border: "none",
                padding: "23px 30px",
                minWidth: 186,
                margin: "7px 3px",
                fontSize: "1.11rem",
                letterSpacing: "1.1px",
                cursor: "pointer",
                boxShadow: "0 0 18px #0ff8"
              }}
            >
              <div style={{ fontSize: "1.27rem", fontWeight: 800, color: "#ffe" }}>
                {branch.name}
              </div>
              <div style={{ opacity: 0.77, fontStyle: "italic", marginTop: 4, fontSize: "0.97rem" }}>
                {branch.desc}
              </div>
            </button>
          ))}
        </div>
        <button
          className="btn-rewind"
          style={{ marginTop: 30 }}
          onClick={backToHome}
        >Back</button>
      </section>
    </main>
  );
}

// --- Page: Multiverse Dashboard ---
function MultiverseDashboard({ branch, timelineData, setTimelineData, onStoryChamber, onBack }) {
  // Placeholder metrics and interactive controls
  const METRICS = [
    { key: "Life Fulfillment", value: 82, color: "var(--nv-primary)" },
    { key: "Stability", value: 64, color: "var(--nv-accent)" },
    { key: "Emotional Score", value: 73, color: "#ffe066" },
    { key: "Social Impact", value: 57, color: "#8458e0" },
  ];
  const [metrics, setMetrics] = useState(
    Object.fromEntries(METRICS.map(m => [m.key, m.value]))
  );
  // Sliders update chart gauges
  function handleSlider(key, val) {
    setMetrics(prev => ({ ...prev, [key]: val }));
  }

  return (
    <main className="nv-simulation-main">
      <div className="nv-sim-split">
        <aside className="nv-sim-left">
          <div className="nv-sim-section-label">YOUR CHOSEN PATH</div>
          <div className="narrative-timeline">
            <div className="timeline-step">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <span className="timeline-label">{branch?.name || "Branch"}</span>
                <p className="timeline-text">{branch?.desc || ""}</p>
              </div>
            </div>
          </div>
          <button className="btn-rewind" style={{ marginTop: 18 }} onClick={onBack}>Back</button>
        </aside>
        <section className="nv-sim-center">
          <div className="nv-sim-section-label">Metrics</div>
          <div className="metrics-dashboard" style={{ flexDirection: "column", gap: 30 }}>
            {METRICS.map(m => (
              <RadialGauge
                key={m.key}
                label={m.key}
                value={metrics[m.key]}
                color={m.color}
                onChange={val => handleSlider(m.key, val)}
              />
            ))}
          </div>
          <button className="btn-generate" style={{ marginTop: 30 }} onClick={onStoryChamber}>
            Unlock Narrative Chamber
          </button>
        </section>
        <aside className="nv-sim-right">
          <div className="nv-sim-section-label">Dashboard Controls</div>
          <div className="slider-metrics">
            {METRICS.map(m => (
              <div key={m.key} className="slider-row">
                <label>{m.key}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={metrics[m.key]}
                  onChange={e => handleSlider(m.key, Number(e.target.value))}
                  style={{ accentColor: m.color }}
                />
                <span className="slider-val">{metrics[m.key]}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

/** Circular Gauge for metric, arcade style */
function RadialGauge({ label, value, color, onChange }) {
  const r = 28, c = 2 * Math.PI * r, p = value / 100;
  return (
    <div className="radial-metric">
      <svg width="69" height="69">
        <circle cx="34.5" cy="34.5" r={r} stroke="#22284c" strokeWidth="8" fill="none" />
        <circle
          cx="34.5" cy="34.5" r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - c * p}
          style={{ transition: 'stroke-dashoffset 0.7s' }}
        />
        <text x="34.5" y="38" fontSize="15" textAnchor="middle" fill="white">{value}</text>
      </svg>
      <span className="radial-metric-label">{label}</span>
      {onChange &&
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{accentColor: color, marginTop: 7, width: "80%"}} />}
    </div>
  );
}

// --- Page: Story Chamber ---
function StoryChamber({ branch, metrics, onBackToDashboard }) {
  // Placeholder "narrative" and poem
  const bgStyle = {
    background: "radial-gradient(ellipse 120% 90% at 60% 40%, #0eeaff55 0%, transparent 68%),"
      + "radial-gradient(ellipse 89% 68% at 53% 45%, #41144dcc 0%, #180035ff 68%, transparent 96%),"
      + "linear-gradient(110deg, #180042 0%, #16004a 98%)"
  };
  return (
    <main className="nv-simulation-main" style={{ background: "none", justifyContent: "center" }}>
      {/* Adaptive dreamy background overlay (matches theme) */}
      <div style={{
        ...bgStyle,
        borderRadius: 45,
        minWidth: 370,
        maxWidth: 640,
        minHeight: 380,
        marginTop: 90,
        zIndex: 2,
        boxShadow: "0 0 77px #8500ff55, 0 0 88px #0ff8"
      }} className="nv-landing-content">
        <h2 className="nv-title-glow" style={{ fontSize: "2.13rem" }}>Story Chamber</h2>
        <div className="nv-subtitle" style={{ marginTop: -7 }}>
          <span style={{ color: "var(--nv-accent)", fontWeight: 600 }}>A Cinematic Memory:</span>
          <br />
          <span style={{ opacity: 0.6, fontStyle: "italic" }}>
            {branch?.desc || "You traverse a life you might have lived…"}
          </span>
        </div>
        <div style={{
          margin: "19px 0 12px 0",
          background: "rgba(128,0,128,0.13)",
          border: "2px solid var(--nv-accent)",
          borderRadius: 17,
          boxShadow: "0 0 20px #ff00ff60",
          padding: 18,
          color: "#fff"
        }}>
          <div>
            <strong style={{ color: "var(--nv-primary)" }}>Event: </strong>
            <span>{branch?.name || "Pathway"}</span>
          </div>
          <div style={{marginTop: 8, fontSize:"1.15rem"}}>
            <span style={{ color: "var(--nv-accent)" }}>Outcome:&nbsp;</span>
            <span>In this reality, your {branch?.name?.toLowerCase()} led to a sequence of remarkable moments. (Placeholder narrative.)</span>
          </div>
        </div>
        <div className="memory-poem" style={{marginTop:27}}>
          <h3 style={{color:"var(--nv-accent)"}}>Memory Poem</h3>
          <div className="poem-text" style={{fontSize:"1.07rem"}}>
            {"Across the starlit crossroads, memories entwine, Each branch a reality where dreams realign."}
          </div>
        </div>
        <audio controls autoPlay loop style={{marginTop:15,width:280,background:'#16004a',borderRadius:8}}>
          <source src="https://cdn.pixabay.com/audio/2022/03/15/audio_11e9853c07.mp3" type="audio/mp3" />
          Ambient music placeholder.
        </audio>
        <div style={{ margin: "21px 0 0 0", textAlign: "center", display: "flex", justifyContent: "center", gap: 18 }}>
          <button className="btn-rewind" onClick={onBackToDashboard}>Return to Dashboard</button>
        </div>
      </div>
    </main>
  );
}

/**
 * Main router for NeuroVerse routes + state branch flow logic.
 */
function NeuroVerseRouter() {
  // Page state
  const [scenario, setScenario] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [timelineData, setTimelineData] = useState([]); // Could hold events in the future
  // Routed navigation handlers
  const navigate = useNavigate();

  // Page-to-page data flow:
  function handleScenarioSubmit({ whatIf, mbti, enneagram }) {
    setScenario(whatIf);
    setPersonality(mbti || enneagram || "INFP");
    setSelectedBranch(null);
    navigate("/path-selector");
  }
  function handlePathPick(branch) {
    setSelectedBranch(branch);
    setTimelineData([]); // stub, could populate based on path
    navigate("/dashboard");
  }
  function handleUnlockStoryChamber() {
    navigate("/story-chamber");
  }
  function handleBackHome() {
    setScenario(null);
    setPersonality(null);
    setSelectedBranch(null);
    navigate("/");
  }
  // Dashboard edit/controls can be added later as needed.

  // Layout includes galaxy bg, nav bar, and page transitions.
  return (
    <div className="nv-app-root" style={{fontFamily:"Inter,Orbitron,sans-serif"}}>
      <GalaxyBackgroundWithStarfield />
      <NeuroVerseNav navs={[
        { label: "Home", route: "/" },
        { label: "Timeline", route: "/path-selector" },
        { label: "Dashboard", route: "/dashboard" },
        { label: "Story Chamber", route: "/story-chamber" },
      ]} />
      <Routes>
        <Route
          path="/"
          element={
            <NeuroVerseHome onScenarioSubmit={handleScenarioSubmit} />
          }
        />
        <Route
          path="/path-selector"
          element={
            scenario
              ? <PathSelector
                  scenario={scenario}
                  personality={personality}
                  onPathPicked={handlePathPick}
                  backToHome={handleBackHome}
                />
              : <Navigate to="/" />
          }
        />
        <Route
          path="/dashboard"
          element={
            selectedBranch
              ? <MultiverseDashboard
                  branch={selectedBranch}
                  timelineData={timelineData}
                  setTimelineData={setTimelineData}
                  onStoryChamber={handleUnlockStoryChamber}
                  onBack={() => navigate("/path-selector")}
                />
              : <Navigate to="/path-selector" />
          }
        />
        <Route
          path="/story-chamber"
          element={
            selectedBranch
              ? <StoryChamber branch={selectedBranch} onBackToDashboard={() => navigate("/dashboard")} />
              : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

// Wrap in Router for export
export default function NeuroVerseRouterRoot() {
  return (
    <Router>
      <NeuroVerseRouter />
    </Router>
  );
}
