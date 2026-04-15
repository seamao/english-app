// 跨设备同步：把 localStorage 的进度/错题/SRS 推到 Cloudflare Worker
import { getSetting, setSetting } from "./storage.js";

const STATE_KEY = "web3en.v1";
const SRS_KEY = "web3en.srs.v1";
const WORDCACHE_KEY = "web3en.wordcache";

let pushTimer = null;
let lastPushedAt = 0;

function readLocal() {
  const pick = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  return {
    state: pick(STATE_KEY),
    srs: pick(SRS_KEY),
    wordcache: pick(WORDCACHE_KEY)
  };
}

function writeLocal(remote) {
  if (remote?.state) localStorage.setItem(STATE_KEY, JSON.stringify(remote.state));
  if (remote?.srs) localStorage.setItem(SRS_KEY, JSON.stringify(remote.srs));
  if (remote?.wordcache) localStorage.setItem(WORDCACHE_KEY, JSON.stringify(remote.wordcache));
}

function endpoint() {
  const url = getSetting("syncUrl");
  const key = getSetting("syncKey");
  if (!url || !key) return null;
  return `${url.replace(/\/$/, "")}/sync?key=${encodeURIComponent(key)}`;
}

export function generateDeviceKey() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function pullOnce({ silent = true } = {}) {
  const ep = endpoint();
  if (!ep) return { ok: false, reason: "未配置同步" };
  try {
    const res = await fetch(ep, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = await res.json();
    if (remote.empty) return { ok: true, empty: true };
    const local = readLocal();
    const localTime = Number(local.state?._updatedAt || 0);
    const remoteTime = Number(remote.updatedAt || 0);
    if (remoteTime > localTime) {
      writeLocal(remote);
      return { ok: true, applied: true, remoteTime };
    }
    return { ok: true, applied: false };
  } catch (e) {
    if (!silent) throw e;
    return { ok: false, reason: e.message };
  }
}

export async function pushOnce({ silent = true } = {}) {
  const ep = endpoint();
  if (!ep) return { ok: false, reason: "未配置同步" };
  try {
    const payload = readLocal();
    if (payload.state) payload.state._updatedAt = Date.now();
    const res = await fetch(ep, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    lastPushedAt = Date.now();
    return { ok: true };
  } catch (e) {
    if (!silent) throw e;
    return { ok: false, reason: e.message };
  }
}

export function schedulePush(delay = 3000) {
  if (!endpoint()) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => pushOnce(), delay);
}

export function initSync() {
  if (!endpoint()) return;
  pullOnce().then(r => {
    if (r.applied) {
      window.dispatchEvent(new CustomEvent("sync:applied"));
    }
  });
  window.addEventListener("storage", (e) => {
    if ([STATE_KEY, SRS_KEY, WORDCACHE_KEY].includes(e.key)) schedulePush();
  });
  const origSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (k, v) {
    origSetItem(k, v);
    if ([STATE_KEY, SRS_KEY, WORDCACHE_KEY].includes(k)) schedulePush();
  };
  window.addEventListener("beforeunload", () => {
    if (Date.now() - lastPushedAt > 1000) {
      const ep = endpoint();
      if (ep) navigator.sendBeacon(ep, new Blob([JSON.stringify(readLocal())], { type: "application/json" }));
    }
  });
}

export { setSetting };
