//
// Timeline Vault + Achievement storage and retrieval utilities
// -- For MirrorVerse multiverse and achievement management

const VAULT_KEY = "mirrorverse_timeline_vault";
const BADGES_KEY = "mirrorverse_achievements";

// PUBLIC_INTERFACE
export function saveToVault(timelineObj) {
  // timelineObj: {id, scenario, profile, path, summaryMetrics, visuals, unlockedAchievements}
  let vault = loadVault();
  // Remove any with same id
  vault = vault.filter(entry => entry.id !== timelineObj.id);
  vault.push(timelineObj);
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  return vault;
}

// PUBLIC_INTERFACE
export function loadVault() {
  try {
    const data = localStorage.getItem(VAULT_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
}

// PUBLIC_INTERFACE
export function clearVault() {
  localStorage.removeItem(VAULT_KEY);
}

// PUBLIC_INTERFACE
export function unlockAchievement(key) {
  let badges = loadAchievements();
  if (!badges.includes(key)) {
    badges.push(key);
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  }
}

// PUBLIC_INTERFACE
export function loadAchievements() {
  try {
    const data = localStorage.getItem(BADGES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
}

// PUBLIC_INTERFACE
export function clearAchievements() {
  localStorage.removeItem(BADGES_KEY);
}
