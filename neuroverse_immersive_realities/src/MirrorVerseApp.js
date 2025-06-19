import React, { useState, useEffect } from "react";
import { narrativeTemplates, multiverseAchievements } from "./multiverseData";
import {
  saveToVault,
  loadVault,
  unlockAchievement,
  loadAchievements
} from "./multiverseUtils";
import "./App.css";

// --- FONT IMPORTS (Orbitron, Space Mono, Inter, Lato) ---
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Mono:wght@700&family=Inter:wght@400;700&family=Lato:wght@400;700&display=swap";
document.head.appendChild(fontLink);

// SYSTEM: Achievement badge display
function AchievementsPanel({ unlockedBadgeKeys }) {
  return (
    <section style={{textAlign:"center", marginTop:20}}>
      <div style={{color:"var(--nv-accent)",fontWeight:650,marginBottom:6}}>Achievements Unlocked</div>
      <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
        {multiverseAchievements.filter(b=>unlockedBadgeKeys.includes(b.key)).map(badge=>(
          <span
            key={badge.key}
            title={badge.name + ": " + badge.description}
            aria-label={badge.name}
            style={{
              background: "rgba(32,0,58,0.26)",
              border: "2px solid var(--nv-accent)",
              padding: "9px 16px",
              borderRadius: 18,
              color: "#ffe",
              fontFamily: "Orbitron, Inter, monospace",
              boxShadow: "0 0 11px #ff0eff40"
            }}
          >
            <span style={{fontSize:"1.52em",marginRight:7}}>{badge.icon}</span>
            {badge.name}
          </span>
        ))}
        {unlockedBadgeKeys.length === 0 && (
          <span style={{color:"#8ceeff",opacity:.6}}>No badges yet. Explore more timelines!</span>
        )}
      </div>
    </section>
  )
}

// SYSTEM: Starfield + glow particles background
function CinematicBG() {
  // responsively render stars + parallax glow (uses same classes as App.js)
  const [stars,setStars] = useState([]);
  useEffect(()=>{
    // generate at mount, responsive to screen
    const starCt = Math.round(Math.min(230, Math.max(120, window.innerWidth/7)));
    setStars(Array.from({length:starCt},(_,i)=>({
      id:i,
      x:Math.random()*100,
      y:Math.random()*100,
      size:Math.random()*2.4+.76,
      opacity:Math.random()*.68+.35,
      anim:Math.random()*16+8
    })));
  },[]);
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map(star=>(
        <span key={star.id} className="star"
          style={{
            left:`${star.x}%`,
            top:`${star.y}%`,
            width:`${star.size}px`,
            height:`${star.size}px`,
            opacity:star.opacity,
            animationDuration: `${star.anim}s`
          }} />
      ))}
    </div>
  )
}

// --- Page transition logic ---
function FramerLikeTransition({active,children}) {
  // Provides crossfade+blur
  return (
    <div className={`page-transition${active?" in":""}`}>
      {children}
    </div>
  );
}

// --- Top-level Navigation context + logic ---
const PAGES = ["Home","PathSelector","Dashboard","StoryChamber"];

function MirrorVerseApp() {
  // App-wide state
  const [page,setPage] = useState("Home");
  const [scenario, setScenario] = useState("");
  const [selectedPersonality, setSelectedPersonality] = useState("INFP");
  const [vault, setVault] = useState(loadVault());
  const [unlocked, setUnlocked] = useState(loadAchievements());
  const [chosenTemplate, setChosenTemplate] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState([]);
  const [metrics, setMetrics] = useState({Emotional:71,Career:64,Financial:52,Relationships:61});
  const [musicOn,setMusicOn] = useState(false);

  useEffect(()=>{
    setVault(loadVault());
    setUnlocked(loadAchievements());
  },[]);

  // Simulate timeline path generation from templates (AI replaced by template logic)
  function beginSimulation({prompt,personality,templateId}) {
    setScenario(prompt);
    setSelectedPersonality(personality);
    const tpl = narrativeTemplates.find(n=>n.id===templateId) || narrativeTemplates[0];
    setChosenTemplate(tpl);
    setActiveTimeline(tpl.template);
    setMetrics({
      Emotional: Math.floor(70+Math.random()*20),
      Career: Math.floor(55+Math.random()*30),
      Financial: Math.floor(30+Math.random()*45),
      Relationships: Math.floor(45+Math.random()*40)
    });
    // Award a badge if user selects a relationship story
    if (tpl.tags.includes("relationship")) unlockAchievement("romantic_branch");
    setUnlocked(loadAchievements());
    setPage("Dashboard");
  }

  function saveTimelineToVault() {
    const id = `vault_${Date.now().toString().slice(-6)}`;
    const entry = {
      id,
      scenario,
      profile: {personality:selectedPersonality},
      path: activeTimeline,
      summaryMetrics: metrics,
      visuals: [],
      unlockedAchievements: unlocked
    }
    saveToVault(entry);
    setVault(loadVault());
    if(vault.length+1>=3) unlockAchievement("timeline_3");
    setUnlocked(loadAchievements());
  }

  // Page rendering:
  return (
    <div className="nv-app-root" style={{fontFamily:"Inter,Lato,sans-serif"}}>
      {/* BG Galaxy + Starfield */}
      <div className="galaxy-bg" style={{zIndex:0}}>
        <div className="galaxy-core"/>
        <div className="galaxy-accent1"/>
        <div className="galaxy-accent2"/>
        <CinematicBG/>
      </div>
      {/* Music (ambient looping, synthwave/lofi) */}
      {musicOn && (
        <audio autoPlay loop>
          <source src="https://cdn.pixabay.com/audio/2022/03/15/audio_11e9853c07.mp3" type="audio/mp3"/>
        </audio>
      )}
      {/* Navbar */}
      <nav className="nv-navbar" style={{fontFamily: "'Orbitron', monospace"}}>
        <div className="nv-logo"><span className="nv-logo-icon">✵</span> MirrorVerse</div>
        <div>
          <button
            className={`nv-sound-btn${musicOn?" on":""}`}
            aria-label={musicOn?"Pause ambient music":"Play ambient music"}
            aria-pressed={musicOn}
            onClick={()=>setMusicOn(m=>!m)}
          >{musicOn?"🎵":"🔈"}</button>
        </div>
      </nav>
      {/* Cinematic Page Transitions */}
      <FramerLikeTransition active={page==="Home"}>
        {page==="Home" && (
          <main className="nv-main-lp">
            <section className="nv-landing-content" style={{fontFamily:"Orbitron,Inter,sans-serif"}}>
              <div className="nv-landing-header">
                <h1 className="nv-title-glow">MirrorVerse</h1>
                <div className="nv-subtitle" style={{maxWidth:340,margin:"auto"}}>
                  Simulate lifepaths in parallel worlds. Begin your multiverse journey below.
                </div>
              </div>
              <form
                style={{marginTop:8,marginBottom:0,display:"flex",flexDirection:"column",alignItems:"center",gap:18}}
                onSubmit={e=>{e.preventDefault();setPage("PathSelector");}}
              >
                <input
                  className="prompt-box"
                  style={{maxWidth:354}}
                  value={scenario}
                  placeholder="Describe your alternate scenario…"
                  maxLength={300}
                  onChange={e=>setScenario(e.target.value)}
                />
                <div>
                  <label style={{color:"var(--nv-primary)",fontWeight:700,marginRight:9}}>Personality:</label>
                  <select
                    value={selectedPersonality}
                    style={{
                      fontFamily:"Orbitron,Inter,monospace",
                      background:"#181a36",color:"#fff",borderRadius:9,padding:"5px 21px"
                    }}
                    onChange={e=>setSelectedPersonality(e.target.value)}
                  >
                    <option value="INFP">INFP</option>
                    <option value="INTJ">INTJ</option>
                    <option value="ESFP">ESFP</option>
                    <option value="ISTJ">ISTJ</option>
                  </select>
                </div>
                <button className="btn-generate" type="submit" disabled={!scenario.trim()}>
                  Begin Simulation
                </button>
              </form>
              <div className="nv-footer-note" style={{marginTop:22}}>
                Your decisions ripple across infinite realities.
              </div>
            </section>
          </main>
        )}
      </FramerLikeTransition>
      <FramerLikeTransition active={page==="PathSelector"}>
        {page==="PathSelector" && (
          <main className="nv-simulation-main" style={{alignItems:"flex-start",minHeight:"100vh"}}>
            <div style={{
              background:"rgba(20,12,38,0.72)",borderRadius:28,boxShadow:"0 0 60px #2e447c60",margin:"90px auto",
              padding:"36px 32px",maxWidth:720,width:"92vw",zIndex:2
            }}>
              <h2 style={{fontFamily:"Orbitron,monospace",fontWeight:900,textAlign:"center",color:"var(--nv-accent)"}}>Choose Your Simulation Path</h2>
              <div style={{fontFamily:"Inter,sans-serif",margin:"13px 0 18px 0",color:"#aac"}}>
                Select a narrative branch to simulate in your multiverse run:
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"30px 18px",justifyContent:"center"}}>
                {narrativeTemplates.map(tpl=>(
                  <button
                    key={tpl.id}
                    onClick={()=>beginSimulation({prompt:scenario,personality:selectedPersonality,templateId:tpl.id})}
                    style={{
                      background: "linear-gradient(120deg,#0ff5 65%,#0ff0,#ff00ff77 100%)",
                      padding:"16px 27px",border:"none",borderRadius:23,
                      fontFamily:"Space Mono,Orbitron,monospace",
                      color:"var(--nv-primary)",
                      fontWeight:700,
                      boxShadow:"0 0 28px #522e8577",
                      fontSize:"1.18rem",
                      margin:"7px 4px",
                      cursor:"pointer",
                      outline:"none"
                    }}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
              <div style={{marginTop:34,display:"flex",justifyContent:"center"}}>
                <button className="btn-rewind" onClick={()=>setPage("Home")}>Back</button>
              </div>
            </div>
          </main>
        )}
      </FramerLikeTransition>
      <FramerLikeTransition active={page==="Dashboard"}>
        {page==="Dashboard" && (
          <main className="nv-simulation-main">
            <div className="nv-sim-split">
              <aside className="nv-sim-left">
                <div className="nv-sim-section-label">Timeline</div>
                <div className="narrative-timeline">
                  {activeTimeline.map((step,idx)=>(
                    <div key={idx} className="timeline-step">
                      <div className="timeline-dot"/>
                      <div className="timeline-content">
                        <span className="timeline-label">{step.label}</span>
                        <p className="timeline-text">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:19}}>
                  <button className="btn-reroll"
                    onClick={()=>setPage("PathSelector")}
                    style={{width:"70%",fontWeight:700,fontSize:"1.04rem"}}>
                    Choose Another Path
                  </button>
                </div>
                <div style={{marginTop:8}}>
                  <button className="btn-rewind"
                    onClick={()=>setPage("Home")}
                    style={{width:"70%",fontWeight:700}}>Return Home</button>
                </div>
              </aside>
              <section className="nv-sim-center">
                <div className="nv-sim-section-label">Summary Metrics</div>
                <div className="metrics-dashboard" style={{justifyContent:"center",gap:"25px"}}>
                  {Object.keys(metrics).map(key=>(
                    <div className="radial-metric" key={key}>
                      <svg width="72" height="72"><circle
                          cx="36" cy="36" r="30"
                          stroke="#22284c" strokeWidth="8" fill="none" />
                        <circle
                          cx="36" cy="36" r="30"
                          stroke={key==="Emotional"?"var(--nv-primary)":key==="Relationships"?"var(--nv-accent)":"#8458e0"}
                          strokeWidth="8" fill="none"
                          strokeDasharray={2*Math.PI*30}
                          strokeDashoffset={2*Math.PI*30-(2*Math.PI*30 * metrics[key]/100)}
                          style={{transition:"stroke-dashoffset 0.7s"}}
                        />
                        <text x="36" y="38" fontSize="15" textAnchor="middle" fill="#fff">{metrics[key]}</text>
                      </svg>
                      <span className="radial-metric-label">{key}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:24}}>
                  <button className="btn-generate" style={{width:"85%"}} onClick={()=>{saveTimelineToVault();setPage("StoryChamber")}}>
                    Unlock Narrative Chamber
                  </button>
                </div>
              </section>
              <aside className="nv-sim-right">
                <div className="nv-sim-section-label">Timeline Vault</div>
                <div style={{fontSize:"1.08rem",color:"var(--nv-accent)",fontWeight:700}}>Saved Timelines:</div>
                <div style={{maxHeight:240,overflowY:"auto",marginTop:8}}>
                  {vault.length===0 && <div style={{color:"#acc",fontStyle:"italic"}}>No timelines saved yet.</div>}
                  {vault.map(entry=>(
                    <div
                      key={entry.id}
                      style={{
                        borderRadius:10,padding:"8px 12px",margin:"8px 0",
                        background:"rgba(8,10,40,0.28)",border:"1.2px solid var(--nv-primary)",fontFamily:"Inter,sans-serif"
                      }}>
                      <div style={{fontSize:"1.06em",fontWeight:600,color:"var(--nv-primary)"}}>{entry.scenario.slice(0,60)}</div>
                      <div style={{color:"#ffe0",fontStyle:"italic",fontSize:"0.97rem",marginBottom:3}}>{entry.profile?.personality}</div>
                      <div style={{fontSize:"0.93rem"}}>Steps: {entry.path.length}</div>
                    </div>
                  ))}
                </div>
                <AchievementsPanel unlockedBadgeKeys={unlocked}/>
              </aside>
            </div>
          </main>
        )}
      </FramerLikeTransition>
      <FramerLikeTransition active={page==="StoryChamber"}>
        {page==="StoryChamber" && (
          <main className="nv-simulation-main" style={{justifyContent:"center"}}>
            <div className="nv-landing-content" style={{
              marginTop:99,minWidth:340,maxWidth:600,width:"92vw",
              background:"rgba(12,14,60,0.75)",fontFamily:"Space Mono,Orbitron,Inter,sans-serif"
            }}>
              <h2 className="nv-title-glow" style={{fontSize:"2.13rem"}}>Narrative Chamber</h2>
              <div style={{
                fontSize:"1.19rem",color:"var(--nv-accent)",margin:"0 0 13px 0",fontWeight:650,fontFamily:"Orbitron"
              }}>
                A Cinematic Memory from your Timeline
              </div>
              <div style={{
                margin:"7px 0",background:"rgba(128,0,128,0.11)",
                border:"2.5px solid var(--nv-primary)",borderRadius:17,
                boxShadow:"0 0 30px #8458e077",padding:"18px"
              }}>
                {activeTimeline.map((step,idx)=>(
                  <div key={idx} style={{margin:"7px 0"}}>
                    <strong style={{color:"var(--nv-primary)"}}>{step.label}:</strong>
                    <span style={{color:"#fff",marginLeft:7}}>{step.text}</span>
                  </div>
                ))}
              </div>
              <div className="memory-poem" style={{marginTop:27}}>
                <h3 style={{color:"var(--nv-accent)"}}>Memory Poem</h3>
                <div className="poem-text" style={{fontSize:"1.07rem"}}>
                  {"Between starlit moments and choices unseen,\nThe paths you dared shape the worlds in between."}
                </div>
              </div>
              <AchievementsPanel unlockedBadgeKeys={unlocked}/>
              <div style={{margin:"21px 0 0 0",textAlign:"center",display:"flex",justifyContent:"center",gap:18}}>
                <button className="btn-rewind" onClick={()=>setPage("Home")}>Return Home</button>
                <button className="btn-generate" style={{fontWeight:700}} onClick={()=>setPage("Dashboard")}>View Dashboard</button>
              </div>
            </div>
          </main>
        )}
      </FramerLikeTransition>
    </div>
  );
}

export default MirrorVerseApp;

