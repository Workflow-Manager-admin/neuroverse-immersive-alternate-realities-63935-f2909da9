import React, { useState } from "react";

/*
  HomePage for MirrorVerse:
    - Central "What if..." text input for scenario
    - Dropdown selectors for Career, Relationships, Location, Education
    - Personality selector (MBTI or Enneagram)
    - "Begin Simulation" button
    - Futuristic/cinematic styling using Orbitron, Space Mono, Inter, Lato
    - Responsive central layout, ready for integration
*/

const CAREERS = [
  "Software Engineer",
  "Actor/Actress",
  "Scientist",
  "Artist",
  "Entrepreneur",
  "Doctor",
  "Teacher",
  "Explorer",
  "Other"
];
const RELATIONSHIP_STATUSES = [
  "Single",
  "Married",
  "In a relationship",
  "Divorced",
  "Widowed",
  "Polyamorous",
  "Prefer not to say",
  "Other"
];
const LOCATIONS = [
  "New York",
  "London",
  "Tokyo",
  "Paris",
  "Sydney",
  "Futuristic City",
  "Nomadic",
  "Other"
];
const EDUCATIONS = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "No Formal Education",
  "Self-Taught",
  "Other"
];
const MBTI_TYPES = [
  "INFP", "INFJ", "INTJ", "INTP",
  "ENFP", "ENFJ", "ENTJ", "ENTP",
  "ISFP", "ISFJ", "ISTJ", "ISTP",
  "ESFP", "ESFJ", "ESTJ", "ESTP"
];
const ENNEAGRAMS = [
  "Type 1 (The Reformer)",
  "Type 2 (The Helper)",
  "Type 3 (The Achiever)",
  "Type 4 (The Individualist)",
  "Type 5 (The Investigator)",
  "Type 6 (The Loyalist)",
  "Type 7 (The Enthusiast)",
  "Type 8 (The Challenger)",
  "Type 9 (The Peacemaker)"
];

// PUBLIC_INTERFACE
function HomePage({ onBeginSimulation }) {
  // Form state
  const [whatIf, setWhatIf] = useState("");
  const [career, setCareer] = useState(CAREERS[0]);
  const [relationship, setRelationship] = useState(RELATIONSHIP_STATUSES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [education, setEducation] = useState(EDUCATIONS[0]);
  const [personalityType, setPersonalityType] = useState("MBTI");
  const [mbti, setMbti] = useState(MBTI_TYPES[0]);
  const [enneagram, setEnneagram] = useState(ENNEAGRAMS[0]);
  const [loading, setLoading] = useState(false);

  // Handler for form submission
  // PUBLIC_INTERFACE
  function handleBegin(e) {
    e.preventDefault();
    setLoading(true);
    // Pass scenario details and personality to callback
    onBeginSimulation &&
      onBeginSimulation({
        whatIf,
        career,
        relationship,
        location,
        education,
        personalityType,
        mbti,
        enneagram
      });
    // Remain loading state for actual integration; reset here for stub/demo
    setLoading(false);
  }

  // Glowing border/gradient for input boxes
  const inputStyle = {
    fontFamily: 'Inter, Lato, Arial, sans-serif',
    background: "#181a36",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 19px",
    fontSize: "1.12rem",
    boxShadow: "0 0 0 2px var(--nv-accent) inset, 0 1px 5px #8000ff30",
    outline: "none",
    width: "100%",
    marginBottom: 0,
    transition: "box-shadow 0.25s"
  };

  const labelStyle = {
    color: "var(--nv-primary)",
    fontFamily: "Orbitron, Space Mono, monospace",
    fontWeight: 800,
    letterSpacing: "1.2px",
    fontSize: "1.07rem",
    marginBottom: 5
  };

  const dropdownStyle = {
    ...inputStyle,
    fontFamily: "Orbitron, Space Mono, Inter, monospace",
    padding: "10px 17px"
  };

  return (
    <div style={{
      minHeight: "100vh", minWidth: "100vw",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "none"
    }}>
      <section className="nv-landing-content" style={{
        width: "100%", maxWidth: 520, padding: "50px 34px 32px 34px",
        background: "rgba(12,14,50,0.69)",
        borderRadius: 32,
        boxShadow: "0 0 77px #8500ff88, 0 1px 60px 0 var(--nv-primary)",
        fontFamily: "Inter, Lato, Arial, sans-serif"
      }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <h1 style={{
            fontFamily: "Orbitron, Space Mono, Inter, monospace",
            color: "var(--nv-primary)",
            fontWeight: 900,
            fontSize: "2.3rem",
            margin: 0,
            letterSpacing: "2px",
            textShadow: "0 0 24px #0ff, 0 0 20px #8500ff90"
          }}>
            MirrorVerse
          </h1>
          <div style={{
            fontFamily: "Inter, Lato, Arial, sans-serif",
            color: "var(--text-secondary)",
            fontSize: "1.14rem",
            margin: "8px auto 0 auto",
            maxWidth: 330
          }}>
            What if you had made different choices? Begin your immersive simulation.
          </div>
        </div>
        <form
          style={{
            display: "flex", flexDirection: "column", gap: 20, alignItems: "center",
            marginTop: 0, width: "100%"
          }}
          onSubmit={handleBegin}
        >
          {/* What if input */}
          <div style={{ width: "100%" }}>
            <label htmlFor="whatif-input" style={labelStyle}>What if…</label>
            <input
              id="whatif-input"
              type="text"
              style={inputStyle}
              placeholder="What if you became an astronaut? Fell in love in Tokyo…"
              value={whatIf}
              onChange={e => setWhatIf(e.target.value)}
              autoFocus
              aria-label="Describe your 'What if...' scenario"
              maxLength={250}
              required
            />
          </div>
          {/* Life events dropdowns */}
          <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 13 }}>
            <div style={{ flex: 1, minWidth: 128 }}>
              <label style={labelStyle}>Career</label>
              <select
                style={dropdownStyle}
                value={career}
                onChange={e => setCareer(e.target.value)}
                aria-label="Select career"
              >
                {CAREERS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 128 }}>
              <label style={labelStyle}>Relationship</label>
              <select
                style={dropdownStyle}
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                aria-label="Select relationship status"
              >
                {RELATIONSHIP_STATUSES.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 13 }}>
            <div style={{ flex: 1, minWidth: 128 }}>
              <label style={labelStyle}>Location</label>
              <select
                style={dropdownStyle}
                value={location}
                onChange={e => setLocation(e.target.value)}
                aria-label="Select location"
              >
                {LOCATIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 128 }}>
              <label style={labelStyle}>Education</label>
              <select
                style={dropdownStyle}
                value={education}
                onChange={e => setEducation(e.target.value)}
                aria-label="Select education level"
              >
                {EDUCATIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Personality Selector */}
          <div style={{ width: "100%", marginTop: 5 }}>
            <div style={{ display: "flex", gap: 19, alignItems: "center" }}>
              <label style={labelStyle}>Personality Type</label>
              <select
                style={{
                  ...dropdownStyle, width: "auto", padding: "8px 16px",
                  minWidth: 98, fontFamily: "Space Mono, Orbitron, monospace"
                }}
                value={personalityType}
                onChange={e => setPersonalityType(e.target.value)}
                aria-label="Select personality type system"
              >
                <option value="MBTI">MBTI</option>
                <option value="Enneagram">Enneagram</option>
              </select>
            </div>
            {personalityType === "MBTI" ? (
              <select
                style={{
                  ...dropdownStyle,
                  fontFamily: "Orbitron, Space Mono, monospace",
                  marginTop: 10,
                  fontSize: "1.02rem"
                }}
                value={mbti}
                onChange={e => setMbti(e.target.value)}
                aria-label="Select MBTI type"
              >
                {MBTI_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <select
                style={{
                  ...dropdownStyle,
                  fontFamily: "Orbitron, Space Mono, monospace",
                  marginTop: 10,
                  fontSize: "1.02rem"
                }}
                value={enneagram}
                onChange={e => setEnneagram(e.target.value)}
                aria-label="Select Enneagram type"
              >
                {ENNEAGRAMS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}
          </div>
          {/* Begin Simulation Button */}
          <button
            type="submit"
            className="btn-generate"
            style={{
              width: "92%",
              margin: "0 auto",
              marginTop: 18,
              fontFamily: "Orbitron, Space Mono, Inter, monospace",
              fontWeight: 900,
              fontSize: "1.19rem",
              letterSpacing: "1.5px",
              background: "linear-gradient(94deg,var(--nv-primary),var(--nv-accent))",
              color: "#1e234e",
              boxShadow: "0 0 17px #0ff8, 0 1px 18px #ff00ff50"
            }}
            disabled={loading || whatIf.trim() === ""}
            aria-label="Begin Simulation"
          >
            {loading ? <span className="loader" /> : "Begin Simulation"}
          </button>
        </form>
        <div className="nv-footer-note" style={{ marginTop: 22, fontFamily: "Orbitron,Inter,sans-serif" }}>
          <span className="nv-glow-accent">Imagine. Simulate. Transcend.</span>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
