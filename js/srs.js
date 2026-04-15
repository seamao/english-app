import { getState } from "./storage.js";

const KEY = "web3en.srs.v1";
const DAY = 86400000;

function loadAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function saveAll(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

export function record(kind, id, grade = 3) {
  const all = loadAll();
  const key = `${kind}:${id}`;
  const prev = all[key] || { ease: 2.5, interval: 0, reps: 0 };
  let { ease, interval, reps } = prev;
  if (grade < 3) { reps = 0; interval = 1; }
  else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 3;
    else interval = Math.round(interval * ease);
    ease = Math.max(1.3, ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  }
  all[key] = { ease, interval, reps, lastAt: Date.now(), dueAt: Date.now() + interval * DAY };
  saveAll(all);
}

export function dueItems(kind, allItems, now = Date.now()) {
  const state = getState();
  const srs = loadAll();
  const learnedSet = kind === "chunk" ? new Set(state.learned)
                  : kind === "phrase" ? new Set(state.learnedPhrases) : new Set();
  const due = [], fresh = [];
  for (const item of allItems) {
    const rec = srs[`${kind}:${item.id}`];
    if (rec && rec.dueAt <= now) due.push({ item, rec });
    else if (!rec && !learnedSet.has(item.id)) fresh.push(item);
  }
  return { due: due.sort((a, b) => a.rec.dueAt - b.rec.dueAt).map(x => x.item), fresh };
}

export function getStats(kind, allItems) {
  const srs = loadAll();
  const now = Date.now();
  let dueCount = 0, trackedCount = 0;
  for (const item of allItems) {
    const rec = srs[`${kind}:${item.id}`];
    if (rec) {
      trackedCount++;
      if (rec.dueAt <= now) dueCount++;
    }
  }
  return { dueCount, trackedCount };
}
