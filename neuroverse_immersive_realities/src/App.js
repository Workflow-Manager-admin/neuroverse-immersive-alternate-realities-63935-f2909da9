import React, { useState, useRef, useEffect } from 'react';
import './App.css';
// Psychological profiling UI/component
import {
  PsychologicalProfileForm,
  analyzeProfile,
  getMbtiValue,
  loadPsychologicalProfileFromStorage,
  PSY_PROFILE_KEY
} from './PsychologicalProfileForm';

// ---- Integration: LangChain-like Orchestrator ---- //
import {
  buildSimulationChain,
  runChain
} from './langchainOrchestrator';

// PUBLIC_INTERFACE
function Starfield({ numStars = 180 }) {
  // Starfield animation for background effect.
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

// PUBLIC_INTERFACE
function GalaxyBackground() {
  // Cine-style galaxy background with animated gradients and glows.
  return (
    <div className="galaxy-bg">
      {/* Large radial gradients for galaxy core and accents */}
      <div className="galaxy-core" />
      <div className="galaxy-accent1" />
      <div className="galaxy-accent2" />
      <Starfield />
    </div>
  );
}

// PUBLIC_INTERFACE
function AmbientMusicPlayer({ playing }) {
  // Simple ambient audio with sci-fi and binaural feel (placeholder file)
  const audioRef = useRef();
  React.useEffect(() => {
    if (playing) {
      audioRef.current && audioRef.current.play();
    } else {
      audioRef.current && audioRef.current.pause();
      audioRef.current && (audioRef.current.currentTime = 0);
    }
  }, [playing]);
  return (
    <audio ref={audioRef} loop>
      <source src="https://cdn.pixabay.com/audio/2022/03/15/audio_11e9853c07.mp3" type="audio/mp3" />
      {/* Placeholder: put proper sci-fi, binaural track here */}
    </audio>
  );
}

// PUBLIC_INTERFACE
function PromptInput({ onSubmit, loading, value, setValue }) {
  // Prompt input field for scenario with generate button.
  return (
    <form className="prompt-input" onSubmit={e => { e.preventDefault(); !loading && onSubmit(); }}>
      <input
        className="prompt-box"
        type="text"
        placeholder="Describe an alternate life scenario…"
        value={value}
        maxLength={400}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <button
        type="submit"
        className={`btn-generate${loading ? ' loading' : ''}`}
        disabled={loading || !value.trim()}
      >
        {loading ? (
          <span className="loader" />
        ) : (
          <span>Generate</span>
        )}
      </button>
    </form>
  );
}

// PUBLIC_INTERFACE
function NarrativeTimeline({ narrativeSteps }) {
  // Display split timeline from AI narrative with fade in.
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

// PUBLIC_INTERFACE
function VisualRenderPanel({ visuals }) {
  // Display generated images of the simulation (placeholder)
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

// PUBLIC_INTERFACE
function MetricsDashboard({ metrics, setMetrics, disabled }) {
  // Scifi metrics with radial and sliders for profile.
  const onMetricChange = (key, val) => {
    setMetrics(m => ({ ...m, [key]: val }));
  };
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

// PUBLIC_INTERFACE
function RadialMetric({ label, value, accent }) {
  // Radial metric component with circular SVG
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

// PUBLIC_INTERFACE
function MirrorChat({ messages, onSend, disabled }) {
  // Chat interface with focus on immersive AI. No actual voices due to scope.
  const [value, setValue] = useState('');
  const msgEndRef = useRef(null);

  React.useEffect(() => {
    msgEndRef.current && msgEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="mirror-chat">
      <div className="chat-title">MirrorChat</div>
      <div className="chat-history">
        {messages.length === 0 && (
          <div className="chat-empty">Here you'll chat with your alternate self…</div>
        )}
        {messages.map((msg, idx) => (
          <div className={`chat-msg ${msg.role}`} key={idx}>
            <div className="chat-avatar">{msg.role === "user" ? "🧑" : "🤖"}</div>
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
        }}>
        <input
          type="text"
          className="chat-input"
          value={value}
          placeholder="Talk to your alternate self…"
          onChange={e => setValue(e.target.value)}
          disabled={disabled}
        />
        <button className="btn-chat" disabled={disabled || !value.trim()} type="submit">Send</button>
      </form>
    </div>
  );
}

// PUBLIC_INTERFACE
function MemoryPoem({ text }) {
  // Displays a poetic, stylized summary from simulation.
  if (!text) return null;
  return (
    <div className="memory-poem">
      <h3>Memory Poem</h3>
      <div className="poem-text">"{text}"</div>
    </div>
  );
}

// PUBLIC_INTERFACE
function PageTransition({ inProp, children }) {
  // Fluid dreamlike transition using css and fade/blur (framer-motion would require npm install)
  return (
    <div className={`page-transition${inProp ? ' in' : ''}`}>
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
function RewindReroll({ onRewind, onReroll, disabled }) {
  // Lets user re-explore scenarios.
  return (
    <div className="rewind-controls">
      <button className="btn-rewind" onClick={onRewind} disabled={disabled} title="Rewind">⏪ Rewind</button>
      <button className="btn-reroll" onClick={onReroll} disabled={disabled} title="Reroll">🎲 Reroll</button>
    </div>
  );
}

/*
 * ---- Placeholder functions for API calls -----
 */

/**
 * PUBLIC_INTERFACE
 * Calls the OpenAI GPT-4o API to generate a life narrative based on user prompt and metrics/personality profile.
 * This is a CLIENT-SIDE fetch to the OpenAI API, meant as a template—inject your API key securely server-side
 * in production.
 * 
 * Example payload: {
 *   model: "gpt-4o",
 *   messages: [{role: "system", content: "You are a life simulation narrative generator..."}, {...}],
 *   max_tokens: 900,
 *   stream: false
 * }
 * 
 * For privacy, do NOT commit a real API key; leave the field as a placeholder. CORS may block this if run from frontend directly.
 */
// PUBLIC_INTERFACE
async function fetchNarrativeGPT4o(prompt, metrics) {
  // Construct a profile summary from the provided metrics.
  const profileSummary = Object.entries(metrics)
    .map(([trait, val]) => `${trait}: ${val}/100`)
    .join(', ');
  // Build the system and user messages.
  const messages = [
    {
      role: "system",
      content:
        "You are an AI specializing in personalized alternate reality narratives, focusing on meaning and emotion. " +
        "Given a user's scenario description and psychological metrics (like Curiosity, Empathy, Resilience), " +
        "generate a compelling life story in 3-5 labelled stages, each as an object {label, text}, suitable for displaying as a timeline. " +
        "Each stage should be brief (1-2 sentences), evocative, and plausible in a sci-fi, speculative, or contemporary context."
    },
    {
      role: "user",
      content:
        `SCENARIO: ${prompt}\n` +
        `PERSONALITY PROFILE: ${profileSummary}\n` +
        `Output as JSON: [ { "label": "...", "text": "..." } ] (3-5 steps)`
    }
  ];
  // You should supply your OpenAI API KEY in production via a secure backend proxy or .env (never directly in browser).
  // This is only a demonstration.
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE'; // TODO: Replace securely in real code
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 900,
        temperature: 0.9,
        stream: false
      })
    });
    if (!response.ok) {
      throw new Error("OpenAI API error: " + response.status);
    }
    const data = await response.json();
    // Extract the raw text and try parsing as JSON.
    let text = data.choices?.[0]?.message?.content || '';
    let json = [];
    try {
      // Sometimes the response contains extra text, try to extract JSON array.
      const match = text.match(/\[.*\]/s); // Match first [] array
      json = match ? JSON.parse(match[0]) : [];
    } catch (e) {
      json = [];
    }
    // Fall back to a single stage if parse fails.
    if (json.length === 0) {
      json = [{
        label: 'Narrative',
        text: typeof text === 'string' ? text.slice(0, 320) : '[Could not parse GPT narrative]'
      }];
    }
    return json;
  } catch (err) {
    // Return fallback narrative on API failure.
    return [
      { label: 'Genesis', text: 'A new adventure unfolds in an alternate reality (GPT-4o unreachable).' },
    ];
  }
}

/**
 * PUBLIC_INTERFACE
 * Uses GPT-4o narrative generation when in production; fallback to placeholder otherwise.
 */
// PUBLIC_INTERFACE
async function fetchNarrative(prompt, metrics) {
  // Toggle here to enable/disable real GPT-4o calls.
  const useGpt4o = true;
  if (useGpt4o) {
    return fetchNarrativeGPT4o(prompt, metrics);
  }
  // FALLBACK: Placeholder narrative
  return [
    { label: 'Genesis', text: 'A new adventure unfolds in an alternate reality…' },
    { label: 'Challenge', text: 'Unexpected events test your resolve and heart.' },
    { label: 'Breakthrough', text: 'You unlock paths that transform your being.' },
    { label: 'Revelation', text: 'A lesson echoes across the stars.' },
  ];
}

/**
 * PUBLIC_INTERFACE
 * Calls a Stable Diffusion API to generate images based on the user's scenario and psychological metrics/personality profile.
 * Replace the dummy STABLE_DIFFUSION_API_KEY and API endpoint (apiUrl) for real usage or proxy via secure backend.
 * The function returns an array of URLs (either direct images or data URLs, depending on backend).
 */
 // PUBLIC_INTERFACE
async function fetchVisuals(prompt, metrics) {
  const profileSummary = Object.entries(metrics)
    .map(([trait, val]) => `${trait}: ${val}/100`)
    .join(', ');
  // Example: payload for text2img endpoint (common for SD APIs)
  const payload = {
    prompt: `Cinematic, hi-res, atmospheric illustration of: ${prompt}. Psychological traits: ${profileSummary}. Science fiction, alternate universe, evocative realism, concept art.`,
    num_images: 2,
    steps: 23,
    guidance_scale: 7.5,
    width: 512,
    height: 384
  };

  // DUMMY API KEY: In real code, NEVER commit real API key, use secure backend proxy.
  const STABLE_DIFFUSION_API_KEY = 'YOUR_STABLE_DIFFUSION_API_KEY_HERE';
  // You may use a proxy or 3rd party SD API, e.g., replicate.com, stability.ai, etc.
  // For demo, this endpoint is not real and will return fallback visuals.
  const apiUrl = 'https://api.stable-diffusion-api-example.com/v1/generate'; // <-- Needs real or proxied endpoint

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABLE_DIFFUSION_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Stable Diffusion API error: " + response.status);
    const data = await response.json();

    // Common API shape: { images: ['https://...jpg', ...] } or { images: ['data:image/png;base64,...', ...] }
    if (Array.isArray(data.images)) {
      return data.images;
    }
    // fallback if expected field not found
    return [];
  } catch (err) {
    // FALLBACK: Return unsplash-style images if SD integration fails or is unreachable
    return [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80"
    ];
  }
}

// PUBLIC_INTERFACE
async function fetchPoem(narrativeSteps) {
  // Placeholder for memory poem/generative summary.
  return (
    "The stars whisper futures, untold, " +
    "Across memories relived, reborn in cold, " +
    "You dared imagine, you dared to try, " +
    "And danced with fate in a galaxy sky."
  );
}

// PUBLIC_INTERFACE
function psychologicalProfile(metrics) {
  // Simple psychological profiling (stub).
  const { Curiosity, Empathy, Resilience } = metrics;
  if (Curiosity > 70 && Empathy > 70)
    return "Visionary Explorer: driven by wonder and compassion.";
  if (Resilience > 80)
    return "Galactic Survivor: persistent in all adversities.";
  return "Dreamer: open to possibilities across realities.";
}

/* ---- Main Container and Profile Flow Integration ---- */

// PUBLIC_INTERFACE
function App() {
  // State management
  const [screen, setScreen] = useState("landing");
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState([]);
  const [visuals, setVisuals] = useState([]);
  const [metrics, setMetrics] = useState({ Curiosity: 60, Empathy: 40, Resilience: 75 });
  const [profileSummary, setProfileSummary] = useState('');
  const [profileObj, setProfileObj] = useState(null); // Holds full {mbti, mbtiStr, big5}
  const [poem, setPoem] = useState('');
  const [mirrorChat, setMirrorChat] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [transition, setTransition] = useState(false);

  // On first load, restore profile from localStorage if any
  useEffect(() => {
    const saved = loadPsychologicalProfileFromStorage();
    if (saved && saved.mbti && saved.big5) {
      setProfileObj(saved);
      // Analyze and store summary
      setProfileSummary(analyzeProfile(getMbtiValue(saved.mbti), saved.big5));
    }
    // eslint-disable-next-line
  }, []);

  // When profileObj changes, update summary
  useEffect(() => {
    if (profileObj && profileObj.mbti && profileObj.big5) {
      setProfileSummary(analyzeProfile(getMbtiValue(profileObj.mbti), profileObj.big5));
    }
  }, [profileObj]);

  // --- Expose "metrics" and "profile" as context for AI/simulation logic
  // Combine MetricsDashboard + profileObj (MBTI, OCEAN) for downstream logic
  // For now, keep landing "metrics" and mbti/big5 decoupled, but on simulation, surface both

  // Handle page transition animation
  const handleTransition = nextScreen => {
    setTransition(true);
    setTimeout(() => {
      setScreen(nextScreen);
      setTransition(false);
    }, 750); // Match CSS transition duration
  };

  // Simulate "generate" logic (use both psychological profiles and metrics)
  async function handleGenerate() {
    setLoading(true);
    setNarrative([]);
    setVisuals([]);
    setPoem('');
    setProfileSummary('');
    // Prepare orchestrator/chain context
    let ctxInit = {
      prompt,
      profile: profileObj,
      mbti: profileObj?.mbtiStr,
      big5: profileObj?.big5,
      metrics
    };
    // Compose minimal API adapter for the chain (wraps existing functions)
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
    // Build the simulation logic chain
    const chain = buildSimulationChain(api);
    // Run orchestrated multi-step logic flow
    const resultCtx = await runChain(chain, "gather", ctxInit);
    setNarrative(resultCtx.aiNarrative);
    setVisuals(resultCtx.visuals);
    setProfileSummary(
      profileObj
        ? analyzeProfile(profileObj.mbtiStr, profileObj.big5)
        : "No profile set"
    );
    setPoem(await fetchPoem(resultCtx.aiNarrative));
    setLoading(false);
    handleTransition("simulation");
  }

  // MirrorChat send
  function handleChatSend(text) {
    setMirrorChat(msgs => [
      ...msgs,
      { role: "user", text },
      { role: "ai", text: "🤖 (Alternate you): " + text.split('').reverse().join('') }
    ]);
  }

  // Rewind resets
  function handleRewind() {
    setMirrorChat([]);
    setNarrative([]);
    setVisuals([]);
    setPoem('');
    setProfileSummary('');
    handleTransition("landing");
  }

  // Reroll: regenerate new reality
  async function handleReroll() {
    setLoading(true);
    setNarrative([]);
    setVisuals([]);
    setPoem('');
    setProfileSummary('');
    // Use orchestrator chain to rerun simulation flow with existing prompt/profile
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
        ? analyzeProfile(profileObj.mbtiStr, profileObj.big5)
        : "No profile set"
    );
    setPoem(await fetchPoem(resultCtx.aiNarrative));
    setLoading(false);
  }

  // -- Render --
  return (
    <div className="nv-app-root">
      <GalaxyBackground />
      <AmbientMusicPlayer playing={audioEnabled} />

      {/* Cinematic nav bar */}
      <nav className="nv-navbar">
        <div className="nv-logo"><span className="nv-logo-icon">✦</span> <span>NeuroVerse</span></div>
        <button className={`nv-sound-btn${audioEnabled ? ' on' : ''}`} onClick={() => setAudioEnabled(a => !a)} title="Ambient Music">
          {audioEnabled ? "🔊" : "🔈"}
        </button>
      </nav>

      {/* Page transition wrapper */}
      <PageTransition inProp={transition}>
        {screen === "landing" && (
          <main className="nv-main-lp">
            <section className="nv-landing-content">
              <div className="nv-landing-header">
                <div className="nv-title-glow">Immersive Alternate Realities</div>
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
              <div className="nv-metrics-section">
                <div className="nv-metrics-title">Gameplay (Curiosity, Empathy, Resilience)</div>
                <MetricsDashboard
                  metrics={metrics}
                  setMetrics={setMetrics}
                  disabled={loading}
                />
              </div>
              <div className="nv-footer-note">
                <span className="nv-glow-accent">Explore. Reflect. Transcend.</span>
              </div>
            </section>
          </main>
        )}
        {screen === "simulation" && (
          <main className="nv-simulation-main">
            <div className="nv-sim-split">
              <section className="nv-sim-left">
                <div className="nv-sim-section-label">AI NARRATIVE</div>
                <NarrativeTimeline narrativeSteps={narrative} />
                <MemoryPoem text={poem} />
                <RewindReroll onRewind={handleRewind} onReroll={handleReroll} disabled={loading} />
              </section>
              <section className="nv-sim-center">
                <div className="nv-sim-section-label">VISUALS</div>
                <VisualRenderPanel visuals={visuals} />
              </section>
              <section className="nv-sim-right">
                <div className="nv-sim-section-label">MirrorChat</div>
                <MirrorChat
                  messages={mirrorChat}
                  onSend={handleChatSend}
                  disabled={loading}
                />
                <div className="nv-metrics-profile small">Profile: {profileSummary}</div>
              </section>
            </div>
          </main>
        )}
      </PageTransition>
    </div>
  );
}

export default App;
