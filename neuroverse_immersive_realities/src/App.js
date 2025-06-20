import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import PsychologicalProfileForm, { analyzeProfile, getMbtiValue, loadPsychologicalProfileFromStorage, PSY_PROFILE_KEY } from './PsychologicalProfileForm';
import Dashboard from "./Dashboard";
import { buildSimulationChain, runChain } from "./langchainOrchestrator";

/**
 * MAIN CONTAINER for NeuroVerse: Immersive Alternate Realities.
 * Cinematic landing, interactive simulation prompt, split AI simulation (timeline & visuals),
 * immersive charts, MirrorChat (AI chat), memory poem, reroll/rewind, music and full logic.
 */

/* --- Galaxy & Cinematic BG Elements --- */
function Starfield({ numStars = 180 }) {
  // Starfield animation for galaxy BG.
  const stars = Array.from({ length: numStars }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.8 + 0.3,
    anim: Math.random() * 20 + 6,
  }));
  return (
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
  );
}

function GalaxyBackground() {
  // Cine-style galaxy background with animated gradients and glows.
  return (
    <div className="galaxy-bg">
      <div className="galaxy-core" />
      <div className="galaxy-accent1" />
      <div className="galaxy-accent2" />
      <Starfield />
    </div>
  );
}

/* --- Ambient Music --- */
function AmbientMusicPlayer({ playing }) {
  // Simple ambient audio (placeholder sci-fi loop)
  const audioRef = useRef();
  useEffect(() => {
    if (playing) {
      audioRef.current && audioRef.current.play();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [playing]);
  return (
    <audio ref={audioRef} loop>
      <source src="https://cdn.pixabay.com/audio/2022/03/15/audio_11e9853c07.mp3" type="audio/mp3" />
    </audio>
  );
}

/* --- Simulation Dashboard / Timeline Demo Data --- */
const mockTimelineMetrics = [
  { label: "Genesis", emotional: 72, career: 55, financial: 40, relationships: 82 },
  { label: "Challenge", emotional: 65, career: 58, financial: 43, relationships: 79 },
  { label: "Breakthrough", emotional: 80, career: 78, financial: 61, relationships: 88 },
  { label: "Revelation", emotional: 90, career: 83, financial: 75, relationships: 94 },
];

function DashboardTimelineNavigator({ current, max, setTimelineStep }) {
  return (
    <div style={{ margin: "6px 0" }}>
      <button
        style={{
          background: "var(--nv-accent)", color: "#fff", border: "none",
          borderRadius: 12, padding: "6px 15px", marginRight: 6, cursor: "pointer",
          fontWeight: 700, boxShadow: "0 0 7px #ff00ff77", opacity: current > 0 ? 1 : 0.5
        }}
        disabled={current === 0}
        onClick={() => setTimelineStep(curr => Math.max(0, curr - 1))}
      >⏪ Prev</button>
      <span style={{ color: "var(--nv-accent)", fontWeight: 600, margin: "0 9px", fontSize: "1.06em" }}>
        Step {current + 1} / {max + 1}
      </span>
      <button
        style={{
          background: "var(--nv-primary)", color: "#12122a", border: "none",
          borderRadius: 12, padding: "6px 15px", marginLeft: 6, cursor: "pointer",
          fontWeight: 700, boxShadow: "0 0 7px #0fffff77", opacity: current < max ? 1 : 0.5
        }}
        disabled={current === max}
        onClick={() => setTimelineStep(curr => Math.min(max, curr + 1))}
      >Next ⏩</button>
    </div>
  );
}

function PageTransition({ inProp, children }) {
  return (
    <div className={`page-transition${inProp ? ' in' : ''}`}>
      {children}
    </div>
  );
}

/* --- Simulation Prompt Input --- */
function PromptInput({ onSubmit, loading, value, setValue }) {
  return (
    <form
      className="prompt-input"
      onSubmit={e => { e.preventDefault(); !loading && onSubmit(); }}
      aria-label="Prompt input"
      role="search"
    >
      <label htmlFor="alt-scenario-prompt" className="sr-only">
        Describe an alternate life scenario
      </label>
      <input
        className="prompt-box"
        type="text"
        id="alt-scenario-prompt"
        placeholder="Describe an alternate life scenario…"
        value={value}
        maxLength={400}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        autoFocus
        aria-required="true"
        aria-label="Describe an alternate life scenario"
      />
      <button
        type="submit"
        className={`btn-generate${loading ? ' loading' : ''}`}
        disabled={loading || !value.trim()}
        aria-label={loading ? "Generating..." : "Generate scenario"}
      >
        {loading ? (
          <span className="loader" aria-live="polite" />
        ) : (
          <span>Generate</span>
        )}
      </button>
    </form>
  );
}

/* --- Narrative Timeline Display --- */
function NarrativeTimeline({ narrativeSteps }) {
  return (
    <div className="narrative-timeline">
      {narrativeSteps.map((step, idx) => (
        <div className="timeline-step" key={idx}>
          <div className="timeline-dot" />
          <div className="timeline-content">
            <span className="timeline-label">{step.label}</span>
            <p className="timeline-text">{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* --- Visual Render (AI images) --- */
function VisualRenderPanel({ visuals }) {
  return (
    <div className="visual-render-panel">
      {visuals.length === 0 && (
        <div className="visual-placeholder">
          <span className="visual-placeholder-text">Visuals from alternate reality will appear here…</span>
        </div>
      )}
      <div className="visual-grid">
        {visuals.map((url, idx) => (
          <img src={url} alt={`Sim visual ${idx + 1}`} className="visual-img" key={idx} />
        ))}
      </div>
    </div>
  );
}

/* --- Metrics Dashboard for Gameplay/Personality --- */
function MetricsDashboard({ metrics, setMetrics, disabled }) {
  // Show radial metrics and sliders for Curiosity, Empathy, Resilience
  const onMetricChange = (key, val) => setMetrics(m => ({ ...m, [key]: val }));
  return (
    <div className="metrics-dashboard">
      <div className="radial-metrics">
        {Object.keys(metrics).map(key => (
          <RadialMetric
            key={key}
            label={key}
            value={metrics[key]}
            accent={key === 'Curiosity' ? 'var(--nv-accent)' : key === 'Empathy' ? 'var(--nv-primary)' : 'var(--nv-secondary)'}
          />
        ))}
      </div>
      <div className="slider-metrics">
        {Object.keys(metrics).map(key => (
          <div key={key} className="slider-row">
            <label>{key}</label>
            <input
              type="range"
              min="0" max="100"
              value={metrics[key]}
              onChange={e => onMetricChange(key, Number(e.target.value))}
              disabled={disabled}
              style={{ accentColor: 'var(--nv-accent)' }}
            />
            <span className="slider-val">{metrics[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Radial Metric for Dashboard and Sim --- */
function RadialMetric({ label, value, accent }) {
  // Circular metric value
  const r = 30, c = 2 * Math.PI * r, p = value / 100;
  return (
    <div className="radial-metric">
      <svg width="72" height="72">
        <circle cx="36" cy="36" r={r} stroke="#22284c" strokeWidth="8" fill="none" />
        <circle
          cx="36" cy="36" r={r}
          stroke={accent}
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - c * p}
          style={{ transition: 'stroke-dashoffset 0.7s' }}
        />
        <text x="36" y="38" fontSize="15" textAnchor="middle" fill="white">{value}</text>
      </svg>
      <span className="radial-metric-label">{label}</span>
    </div>
  );
}

/* --- MirrorChat: Immersive Chat With AI (no audio for brevity) --- */
function MirrorChat({ messages, onSend, disabled }) {
  const [value, setValue] = useState('');
  const msgEndRef = useRef(null);

  useEffect(() => {
    msgEndRef.current && msgEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="mirror-chat" aria-label="MirrorChat conversation" role="region" tabIndex={0}>
      <div className="chat-title" id="chat-title" tabIndex={-1}>MirrorChat</div>
      <div
        className="chat-history"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        {messages.length === 0 && (
          <div className="chat-empty" tabIndex={0}>Here you'll chat with your alternate self…</div>
        )}
        {messages.map((msg, idx) => (
          <div
            className={`chat-msg ${msg.role}`}
            key={idx}
            role="listitem"
            aria-label={msg.role === "user" ? "You said" : "Mirror AI said"}
            tabIndex={0}
          >
            <div className="chat-avatar" aria-hidden="true">{msg.role === "user" ? "🧑" : "🤖"}</div>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={msgEndRef} />
      </div>
      <form
        className="chat-input-row"
        onSubmit={e => {
          e.preventDefault();
          if (value.trim()) {
            onSend(value);
            setValue('');
          }
        }}
        aria-label="Send a message to your alternate self"
        role="search"
      >
        <label htmlFor="chat-msg-field" className="sr-only">Type a message for MirrorChat</label>
        <input
          id="chat-msg-field"
          type="text"
          className="chat-input"
          value={value}
          placeholder="Talk to your alternate self…"
          onChange={e => setValue(e.target.value)}
          disabled={disabled}
          aria-label="Chat message input"
          autoComplete="off"
          autoCorrect="off"
        />
        <button
          className="btn-chat"
          disabled={disabled || !value.trim()}
          type="submit"
          aria-label="Send chat message"
        >Send</button>
      </form>
    </section>
  );
}

/* --- Memory Poem: Lyric-Style AI Summary --- */
function MemoryPoem({ text }) {
  if (!text) return null;
  return (
    <div className="memory-poem">
      <h3>Memory Poem</h3>
      <div className="poem-text">"{text}"</div>
    </div>
  );
}

/* --- Rewind / Reroll Controls --- */
function RewindReroll({ onRewind, onReroll, disabled }) {
  return (
    <div className="rewind-controls">
      <button className="btn-rewind" onClick={onRewind} disabled={disabled} title="Rewind">⏪ Rewind</button>
      <button className="btn-reroll" onClick={onReroll} disabled={disabled} title="Reroll">🎲 Reroll</button>
    </div>
  );
}

/* --- API Placeholders for GPT-4o / Stable Diffusion --- */
async function fetchNarrative(prompt, metrics) {
  // Placeholder: replace with real GPT-4o API/proxy in production!
  // Simulate a delay and return demo format.
  await new Promise(r => setTimeout(r, 600));
  return [
    { label: 'Genesis', text: 'A new adventure unfolds in an alternate reality…' },
    { label: 'Challenge', text: 'Unexpected events test your resolve and heart.' },
    { label: 'Breakthrough', text: 'You unlock paths that transform your being.' },
    { label: 'Revelation', text: 'A lesson echoes across the stars.' },
  ];
}
async function fetchVisuals(prompt, metrics) {
  // Placeholder: replace with real Stable Diffusion API/proxy in production!
  await new Promise(r => setTimeout(r, 450));
  return [
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80"
  ];
}
async function fetchPoem(narrativeSteps) {
  await new Promise(r => setTimeout(r, 300));
  return (
    "The stars whisper futures, untold, " +
    "Across memories relived, reborn in cold, " +
    "You dared imagine, you dared to try, " +
    "And danced with fate in a galaxy sky."
  );
}
function psychologicalProfile(metrics) {
  // Simple "profile archetype" by metrics.
  const { Curiosity, Empathy, Resilience } = metrics;
  if (Curiosity > 70 && Empathy > 70)
    return "Visionary Explorer: driven by wonder and compassion.";
  if (Resilience > 80)
    return "Galactic Survivor: persistent in all adversities.";
  return "Dreamer: open to possibilities across realities.";
}

/* --- GPT-powered AI chat, mock version for local demo --- */
async function fetchAIChatMessage(message, history = []) {
  await new Promise(r => setTimeout(r, 400));
  // Alternate between "You" and "AI" for effect
  return "Reflecting from another universe, I'd choose compassion every time. 💫";
}

/* --- Main Container --- */
function App() {
  // State
  const [screen, setScreen] = useState("landing");
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState([]);
  const [visuals, setVisuals] = useState([]);
  const [metrics, setMetrics] = useState({ Curiosity: 60, Empathy: 40, Resilience: 75 });
  const [profileSummary, setProfileSummary] = useState('');
  const [profileObj, setProfileObj] = useState(null);
  const [poem, setPoem] = useState('');
  const [mirrorChat, setMirrorChat] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [transition, setTransition] = useState(false);

  // Restore profile from localStorage (if present) on load
  useEffect(() => {
    const saved = loadPsychologicalProfileFromStorage();
    if (saved && saved.mbti && saved.big5) {
      setProfileObj(saved);
      setProfileSummary(analyzeProfile(getMbtiValue(saved.mbti), saved.big5));
    }
  }, []);
  // On profileObj update, update summary
  useEffect(() => {
    if (profileObj && profileObj.mbti && profileObj.big5) {
      setProfileSummary(analyzeProfile(getMbtiValue(profileObj.mbti), profileObj.big5));
    }
  }, [profileObj]);

  const [dashboardTimelineStep, setDashboardTimelineStep] = useState(0);

  // Page transition animation (uses .page-transition CSS duration)
  const handleTransition = nextScreen => {
    setTransition(true);
    setTimeout(() => {
      setScreen(nextScreen);
      setTransition(false);
    }, 750);
  };

  // Simulation "generate" logic (uses orchestrator pattern)
  async function handleGenerate() {
    setLoading(true);
    setNarrative([]);
    setVisuals([]);
    setPoem('');
    setProfileSummary('');
    // Compose chain context
    let ctxInit = {
      prompt,
      profile: profileObj,
      mbti: profileObj?.mbtiStr,
      big5: profileObj?.big5,
      metrics
    };
    // Compose API adapters - ready for real and mock integration
    const api = {
      gptNarrative: async (pmt, profileSummary, met) =>
        fetchNarrative(`${pmt}\nPersonality Profile: ${profileSummary || ''}`, {
          ...met,
          ...((profileObj && profileObj.big5) ? profileObj.big5 : {}),
          mbti: (profileObj && profileObj.mbtiStr) || ""
        }),
      sdVisuals: async (pmt, profileSummary, met) =>
        fetchVisuals(`${pmt}\nPersonality Profile: ${profileSummary || ''}`, {
          ...met,
          ...((profileObj && profileObj.big5) ? profileObj.big5 : {}),
          mbti: (profileObj && profileObj.mbtiStr) || ""
        }),
    };
    // Create & Run chain
    const chain = buildSimulationChain(api);
    const resultCtx = await runChain(chain, "gather", ctxInit);
    setNarrative(resultCtx.aiNarrative);
    setVisuals(resultCtx.visuals);
    setProfileSummary(
      profileObj
        ? analyzeProfile(getMbtiValue(profileObj.mbti), profileObj.big5)
        : "No profile set"
    );
    setPoem(await fetchPoem(resultCtx.aiNarrative));
    setLoading(false);
    handleTransition("simulation");
  }

  // MirrorChat logic
  async function handleChatSend(text) {
    // Add user message
    setMirrorChat(msgs => [...msgs, { role: "user", text }]);
    // Prepare history for AI (include new message)
    const previous = [...mirrorChat, { role: "user", text }];

    // Add a "thinking" pending assistant message
    setMirrorChat(msgs => [...msgs, { role: "assistant", text: "[Reflecting...]" }]);
    try {
      // Real API would use OpenAI GPT-4o or similar
      const aiReply = await fetchAIChatMessage(text, previous);
      setMirrorChat(msgs => {
        const lastIdx = msgs.length - 1;
        if (
          lastIdx >= 0 &&
          msgs[lastIdx].role === "assistant" &&
          msgs[lastIdx].text === "[Reflecting...]"
        ) {
          return [
            ...msgs.slice(0, lastIdx),
            { role: "assistant", text: aiReply }
          ];
        } else {
          return [...msgs, { role: "assistant", text: aiReply }];
        }
      });
    } catch (err) {
      setMirrorChat(msgs => {
        const lastIdx = msgs.length - 1;
        const errorMsg = "Sorry, I couldn't reflect back just now. (AI unreachable)";
        if (
          lastIdx >= 0 &&
          msgs[lastIdx].role === "assistant" &&
          msgs[lastIdx].text === "[Reflecting...]"
        ) {
          return [
            ...msgs.slice(0, lastIdx),
            { role: "assistant", text: errorMsg }
          ];
        }
        return [...msgs, { role: "assistant", text: errorMsg }];
      });
    }
  }

  // Rewind: reset simulation to landing
  function handleRewind() {
    setMirrorChat([]);
    setNarrative([]);
    setVisuals([]);
    setPoem('');
    setProfileSummary('');
    handleTransition("landing");
  }

  // Reroll: rerun simulation, preserve prompt/profile
  async function handleReroll() {
    setLoading(true);
    setNarrative([]);
    setVisuals([]);
    setPoem('');
    setProfileSummary('');
    let ctxInit = {
      prompt,
      profile: profileObj,
      mbti: profileObj?.mbtiStr,
      big5: profileObj?.big5,
      metrics
    };
    const api = {
      gptNarrative: async (pmt, profileSummary, met) =>
        fetchNarrative(`${pmt}\nPersonality Profile: ${profileSummary || ''}`, {
          ...met,
          ...((profileObj && profileObj.big5) ? profileObj.big5 : {}),
          mbti: (profileObj && profileObj.mbtiStr) || ""
        }),
      sdVisuals: async (pmt, profileSummary, met) =>
        fetchVisuals(`${pmt}\nPersonality Profile: ${profileSummary || ''}`, {
          ...met,
          ...((profileObj && profileObj.big5) ? profileObj.big5 : {}),
          mbti: (profileObj && profileObj.mbtiStr) || ""
        }),
    };
    const chain = buildSimulationChain(api);
    const resultCtx = await runChain(chain, "gather", ctxInit);
    setNarrative(resultCtx.aiNarrative);
    setVisuals(resultCtx.visuals);
    setProfileSummary(
      profileObj
        ? analyzeProfile(getMbtiValue(profileObj.mbti), profileObj.big5)
        : "No profile set"
    );
    setPoem(await fetchPoem(resultCtx.aiNarrative));
    setLoading(false);
  }

  /* Main render */
  return (
    <div className="nv-app-root">
      <GalaxyBackground />
      <AmbientMusicPlayer playing={audioEnabled} />

      {/* Cinematic nav bar */}
      <nav className="nv-navbar" role="navigation" aria-label="Main">
        <div className="nv-logo"><span className="nv-logo-icon">✦</span> <span>NeuroVerse</span></div>
        <button
          className={`nv-sound-btn${audioEnabled ? ' on' : ''}`}
          onClick={() => setAudioEnabled(a => !a)}
          title="Ambient Music Toggle"
          aria-pressed={audioEnabled}
          aria-label={audioEnabled ? "Turn ambient music off" : "Turn ambient music on"}
          tabIndex={0}
        >
          {audioEnabled ? "🔊" : "🔈"}
        </button>
      </nav>

      {/* Page transition wrapper */}
      <PageTransition inProp={transition}>
        {screen === "landing" && (
          <main className="nv-main-lp" role="main" tabIndex={-1}>
            <section className="nv-landing-content" aria-labelledby="lp-title">
              <div className="nv-landing-header">
                <h1 className="nv-title-glow" id="lp-title">Immersive Alternate Realities</h1>
                <div className="nv-subtitle">
                  Envision your life in another universe. Describe a scenario and dive into your mind’s multiverse.
                </div>
              </div>
              <PromptInput
                onSubmit={handleGenerate}
                loading={loading}
                value={prompt}
                setValue={setPrompt}
              />
              {/* --- Psychological profile UI --- */}
              <div style={{ margin: "16px 0" }}>
                <PsychologicalProfileForm
                  onProfileChange={obj => setProfileObj(obj)}
                  initialProfile={profileObj}
                />
              </div>
              <section className="nv-metrics-section" aria-label="Profile Metrics">
                <div className="nv-metrics-title">Gameplay (Curiosity, Empathy, Resilience)</div>
                <MetricsDashboard
                  metrics={metrics}
                  setMetrics={setMetrics}
                  disabled={loading}
                />
              </section>
              <div className="nv-footer-note">
                <span className="nv-glow-accent">Explore. Reflect. Transcend.</span>
              </div>
            </section>
          </main>
        )}
        {screen === "simulation" && (
          <main className="nv-simulation-main" role="main" tabIndex={-1}>
            <div className="nv-sim-split" role="region" aria-label="Simulation Output">
              <aside className="nv-sim-left" aria-label="AI Narrative Timeline" tabIndex={0}>
                <div className="nv-sim-section-label">AI NARRATIVE</div>
                <NarrativeTimeline narrativeSteps={narrative} />
                <MemoryPoem text={poem} />
                <RewindReroll onRewind={handleRewind} onReroll={handleReroll} disabled={loading} />
              </aside>
              <section className="nv-sim-center" aria-label="Simulation Timeline Metrics" tabIndex={0}>
                <div className="nv-sim-section-label">TIMELINE METRICS</div>
                <Dashboard
                  data={mockTimelineMetrics}
                  currentStep={dashboardTimelineStep}
                />
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 6, marginBottom: 0, fontSize: "0.97rem" }}>
                  <DashboardTimelineNavigator
                    current={dashboardTimelineStep}
                    max={mockTimelineMetrics.length - 1}
                    setTimelineStep={setDashboardTimelineStep}
                  />
                </div>
                <div className="nv-sim-section-label" style={{ marginTop: 18 }}>VISUALS</div>
                <VisualRenderPanel visuals={visuals} />
              </section>
              <aside className="nv-sim-right" aria-label="MirrorChat" tabIndex={0}>
                <div className="nv-sim-section-label">MirrorChat</div>
                <MirrorChat
                  messages={mirrorChat}
                  onSend={handleChatSend}
                  disabled={loading}
                />
                <div className="nv-metrics-profile small">Profile: {profileSummary}</div>
              </aside>
            </div>
          </main>
        )}
      </PageTransition>
    </div>
  );
}

export default App;
