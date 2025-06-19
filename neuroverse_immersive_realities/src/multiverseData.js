//
// MirrorVerse Data Modules: Modular narrative templates, Achievements, Timeline Vault.
// For task: modular, pre-written narrative stories and related assets.
// Only placeholder/example objects provided (expand per app requirements).
//

// PUBLIC_INTERFACE
export const narrativeTemplates = [
  {
    id: "career-drift",
    name: "Career Drift",
    tags: ["career", "growth", "change"],
    template: [
      { label: "Genesis", text: "You embark on a career in a field you once dismissed as a fantasy." },
      { label: "Challenge", text: "You are confronted by a major setback that forces you to rethink your priorities." },
      { label: "Inversion", text: "A chance encounter reorients your sense of purpose." },
      { label: "Rising Action", text: "You take a risk that alters your professional arc forever." },
      { label: "Legacy", text: "Your life’s work impacts a generation, though not how you imagined." }
    ]
  },
  {
    id: "relationship-quest",
    name: "Relationship Quest",
    tags: ["relationship", "meaning", "emotion"],
    template: [
      { label: "Meeting", text: "A serendipitous encounter tilts your universe on its axis." },
      { label: "Connection", text: "Shared dreams give rise to profound connection and vulnerability." },
      { label: "Resonance", text: "You weather storms together, emerging changed and more honest." },
    ]
  },
  {
    id: "wanderlust-reality",
    name: "Wanderlust Reality",
    tags: ["travel", "exploration", "freedom"],
    template: [
      { label: "Departure", text: "You choose a life untethered, borders dissolving behind you." },
      { label: "Discovery", text: "Each new horizon brings challenge and wonder." },
      { label: "Revelation", text: "In unfamiliar places, you find pieces of yourself." }
    ]
  },
  // Add more narrative template objects here as needed
];

export const multiverseAchievements = [
  {
    key: "timeline_3",
    name: "Triad Traveler",
    description: "Experience three unique multiverse branches!",
    icon: "🪐"
  },
  {
    key: "romantic_branch",
    name: "Hearts Across Worlds",
    description: "Unlock a relationship-focused storyline.",
    icon: "💫"
  },
  {
    key: "all_badges",
    name: "Omniverse Master",
    description: "Collect all multiverse badges.",
    icon: "✨"
  },
];

// Example Timeline Vault data format (for local/session storage)
export const exampleTimelineVault = [
  {
    id: "vault_entry_01",
    scenario: "Left my hometown to become a cosmic botanist",
    profile: { mbti: "INFP", big5: { Openness: 77, Agreeableness: 66 } },
    path: [
      { label: "Genesis", text: "You leave home with nothing but hope and a star chart." },
      { label: "Challenge", text: "Isolation tests your resolve on a terraformed moon colony." },
      { label: "Breakthrough", text: "A rare flower changes your standing in the scientific community." }
    ],
    summaryMetrics: {
      Emotional: 75,
      Career: 65,
      Financial: 35,
      Relationships: 51
    },
    visuals: [],
    unlockedAchievements: ["timeline_3"]
  }
];

