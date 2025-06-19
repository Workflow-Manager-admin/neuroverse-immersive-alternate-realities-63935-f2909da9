import React, { useState, useEffect } from "react";

/*
PUBLIC_INTERFACE
PsychologicalProfileForm collects MBTI type and Big Five (OCEAN) traits.
On completion, it analyzes and persists the user's psychological profile.
Props:
  onProfileChange: function(profileObj) - called with parsed profile/result.
  initialProfile: optional object to pre-populate values.
*/
function mbtiLettersDescription(dim, letter) {
  // Helpful text for MBTI
  const dict = {
    E: "Extraversion - energized by others.",
    I: "Introversion - energized by solitude.",
    S: "Sensing - focus on details, facts.",
    N: "iNtuition - focus on patterns, possibilities.",
    T: "Thinking - logical decisions.",
    F: "Feeling - values-driven decisions.",
    J: "Judging - structured, plans ahead.",
    P: "Perceiving - flexible, adapts."
  };
  return dict[letter] || "";
}

const bigFiveTraits = [
  {
    name: "Openness",
    desc: "Inventive, curious vs. consistent, cautious"
  },
  {
    name: "Conscientiousness",
    desc: "Efficient, organized vs. easy-going, careless"
  },
  {
    name: "Extraversion",
    desc: "Outgoing, energetic vs. solitary, reserved"
  },
  {
    name: "Agreeableness",
    desc: "Friendly, compassionate vs. critical, rational"
  },
  {
    name: "Neuroticism",
    desc: "Sensitive, nervous vs. resilient, confident"
  }
];

const mbtiDims = [
  { code: "E", alt: "I", dim: "Energy" },
  { code: "S", alt: "N", dim: "Perceiving" },
  { code: "T", alt: "F", dim: "Judging" },
  { code: "J", alt: "P", dim: "Lifestyle" }
];

// LOCAL STORAGE KEY
const PSY_PROFILE_KEY = "nv_psy_profile";

function mbtiDefault() {
  return { E: false, I: true, S: true, N: false, T: true, F: false, J: true, P: false }; // Default to ISTJ
}

function getMbtiValue(mbtiState) {
  // Compose 4 letters
  return (
    (mbtiState.E ? "E" : "I") +
    (mbtiState.S ? "S" : "N") +
    (mbtiState.T ? "T" : "F") +
    (mbtiState.J ? "J" : "P")
  );
}

// PUBLIC_INTERFACE
function analyzeProfile(mbtiString, big5Obj) {
  /* Return a string summary interpretation given MBTI and big-five traits. */
  // Simple pattern rules for demo purposes
  // MBTI pattern-based archetypes
  const types = {
    ENFP: "Imaginative Pathfinder: Driven by ideas, values, and connections.",
    INTJ: "Strategic Visionary: Decisive, abstract, seeks mastery.",
    ISTJ: "Responsible Guardian: Orderly, pragmatic, values duty.",
    ISFP: "Artistic Mediator: Gentle, adaptable, sensitive to beauty.",
    ESTP: "Energetic Navigator: Bold, realistic, skilled in action.",
    INFP: "Empathic Dreamer: Loyal to ideals, values feeling.",
    ENTJ: "Commanding Architect: Organized leader, strategic mind.",
    ESFP: "Expressive Realist: Energetic, loves experience, seeks harmony."
    // ... etc, can fill all 16 types if needed
  };
  let summary = "";
  if (mbtiString in types) {
    summary = types[mbtiString];
  } else {
    summary = "Unique Mind: Your profile blends multiple perspectives.";
  }
  // Big Five dominant
  const topBig = Object.entries(big5Obj)
    .sort((a, b) => b[1] - a[1])[0][0];
  summary += ` Main trait: ${topBig}.`;
  return summary;
}

// PUBLIC_INTERFACE
export function PsychologicalProfileForm({ onProfileChange, initialProfile }) {
  // MBTI state: 4 choices
  const [mbti, setMbti] = useState(
    initialProfile?.mbti || mbtiDefault()
  );
  // Big Five: sliders 0-100
  const [big5, setBig5] = useState(
    initialProfile?.big5 || {
      Openness: 60,
      Conscientiousness: 60,
      Extraversion: 50,
      Agreeableness: 50,
      Neuroticism: 35
    }
  );

  // Persist profile in local storage and notify parent
  useEffect(() => {
    const mbtiStr = getMbtiValue(mbti);
    const profileObj = { mbti, mbtiStr, big5 };
    localStorage.setItem(PSY_PROFILE_KEY, JSON.stringify(profileObj));
    if (onProfileChange) onProfileChange(profileObj);
    // eslint-disable-next-line
  }, [mbti, big5]);

  // Reset: for forms that allow reset
  function handleReset() {
    setMbti(mbtiDefault());
    setBig5({
      Openness: 60,
      Conscientiousness: 60,
      Extraversion: 50,
      Agreeableness: 50,
      Neuroticism: 35
    });
  }

  function mbtiRadio(dim) {
    // Render radio group for each MBTI dimension
    return (
      <div className="mbti-dim-row" key={dim.code + dim.alt}>
        <label className="mbti-label">{dim.code}{/* Main */}</label>
        <input
          type="radio"
          name={`mbti_${dim.dim}`}
          checked={mbti[dim.code]}
          onChange={() =>
            setMbti((prev) => ({
              ...prev,
              [dim.code]: true,
              [dim.alt]: false
            }))
          }
          aria-label={mbtiLettersDescription(dim.dim, dim.code)}
        />
        <span className="mbti-desc">{mbtiLettersDescription(dim.dim, dim.code)}</span>
        <span style={{ margin: "0 6px" }}>—</span>
        <label className="mbti-label">{dim.alt}</label>
        <input
          type="radio"
          name={`mbti_${dim.dim}`}
          checked={mbti[dim.alt]}
          onChange={() =>
            setMbti((prev) => ({
              ...prev,
              [dim.code]: false,
              [dim.alt]: true
            }))
          }
          aria-label={mbtiLettersDescription(dim.dim, dim.alt)}
        />
        <span className="mbti-desc">{mbtiLettersDescription(dim.dim, dim.alt)}</span>
      </div>
    );
  }

  return (
    <div className="psy-profile-form">
      <div style={{ marginBottom: 18, fontWeight: 700, color: "var(--nv-accent)" }}>
        MBTI Personality Type
      </div>
      <div style={{ marginBottom: 13 }}>
        {mbtiDims.map((dim) => mbtiRadio(dim))}
      </div>
      <div style={{ margin: "16px 0 8px 0", fontWeight: 700, color: "var(--nv-primary)" }}>Big Five Personality Dimensions</div>
      <div className="bigfive-sliders">
        {bigFiveTraits.map((trait) => (
          <div className="big5-slider-row" key={trait.name} style={{ marginBottom: 10 }}>
            <div>
              <label style={{ fontWeight: 600, color: "var(--nv-secondary)", minWidth: 132 }}>{trait.name}</label>
              <span style={{ fontSize: "0.97em", color: "#aee" }}>{trait.desc}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={big5[trait.name]}
              style={{ accentColor: "var(--nv-accent)", width: "43%" }}
              onChange={e =>
                setBig5((prev) => ({ ...prev, [trait.name]: Number(e.target.value) }))
              }
            />
            <span style={{ color: "var(--nv-accent)", width: 33, textAlign: "center", marginLeft: 7 }}>
              {big5[trait.name]}
            </span>
          </div>
        ))}
      </div>
      <div className="psy-profile-summary" style={{ marginTop: 18, fontWeight: 700, color: "var(--nv-primary)" }}>
        You are: <span style={{ color: "var(--nv-accent)" }}>{analyzeProfile(getMbtiValue(mbti), big5)}</span>
      </div>
      <button style={{ margin: "13px 0 0 0", padding: "8px 24px", borderRadius: 12, border: "none", background: "var(--nv-secondary)", color: "#ffe", fontWeight: 600 }}
        type="button"
        onClick={handleReset}
        title="Reset personality profile"
      >Reset</button>
    </div>
  );
}

// UTIL
export function loadPsychologicalProfileFromStorage() {
  try {
    const data = localStorage.getItem(PSY_PROFILE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return null;
}

export { analyzeProfile, getMbtiValue, PSY_PROFILE_KEY };
