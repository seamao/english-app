import { DEFAULTS as FALLBACK } from "./config.defaults.js";

let DEFAULTS = { ...FALLBACK };
try {
  const m = await import("./config.local.js");
  if (m?.DEFAULTS) DEFAULTS = { ...FALLBACK, ...m.DEFAULTS };
} catch { /* 线上无 config.local.js 是正常的 */ }

const KEY = "web3en.v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function today() { return new Date().toISOString().slice(0, 10); }

export function getState() {
  const s = load();
  return {
    learned: s.learned || [],
    learnedPhrases: s.learnedPhrases || [],
    doneScenarios: s.doneScenarios || {},
    streak: s.streak || 0,
    lastVisit: s.lastVisit || null,
    dailySeed: s.dailySeed || null,
    bugs: s.bugs || [],
    settings: s.settings || {},
    daily: s.daily || {},
    totals: s.totals || { chunks: 0, phrases: 0, scenarios: 0, tasks: 0, bugs: 0, reviews: 0 }
  };
}

export function markPhrase(id) {
  const s = getState();
  if (!s.learnedPhrases.includes(id)) {
    s.learnedPhrases.push(id);
    save(s);
    bumpStat("phrases");
  }
}

export function unmarkPhrase(id) {
  const s = getState();
  s.learnedPhrases = s.learnedPhrases.filter(x => x !== id);
  save(s);
}

export function markScenario(id, level) {
  const s = getState();
  if (!s.doneScenarios[id]) s.doneScenarios[id] = {};
  if (!s.doneScenarios[id][level]) {
    s.doneScenarios[id][level] = Date.now();
    save(s);
    bumpStat("scenarios");
  }
}

export function bumpStat(type, n = 1) {
  const s = getState();
  const d = today();
  if (!s.daily[d]) s.daily[d] = { chunks: 0, tasks: 0, bugs: 0, reviews: 0 };
  s.daily[d][type] = (s.daily[d][type] || 0) + n;
  s.totals[type] = (s.totals[type] || 0) + n;
  save(s);
}

export function getTodayStats() {
  const s = getState();
  return s.daily[today()] || { chunks: 0, tasks: 0, bugs: 0, reviews: 0 };
}

export function getActiveDays() {
  return Object.keys(getState().daily).length;
}

export function markLearned(id) {
  const s = getState();
  if (!s.learned.includes(id)) {
    s.learned.push(id);
    save(s);
    bumpStat("chunks");
    return;
  }
  save(s);
}

export function unmarkLearned(id) {
  const s = getState();
  s.learned = s.learned.filter(x => x !== id);
  save(s);
}

export function updateStreak() {
  const s = getState();
  const today = new Date().toISOString().slice(0, 10);
  if (s.lastVisit === today) return s.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  s.streak = s.lastVisit === yesterday ? s.streak + 1 : 1;
  s.lastVisit = today;
  save(s);
  return s.streak;
}

export function addBug(bug) {
  const s = getState();
  s.bugs.unshift({ ...bug, ts: Date.now() });
  save(s);
  bumpStat("bugs");
}

export function setSetting(key, value) {
  const s = getState();
  s.settings[key] = value;
  save(s);
}

export function getSetting(key) {
  const v = getState().settings[key];
  if (v !== undefined && v !== null && v !== "") return v;
  return DEFAULTS[key];
}
