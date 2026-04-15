import { getSetting } from "./storage.js";
import { synthesizeSpeech } from "./ai.js";

let voicesReady = false;
let cachedVoice = null;
let currentAudio = null;
let currentUtter = null;
const ttsCache = new Map();
const listeners = new Set();

function emit(state) {
  for (const fn of listeners) {
    try { fn(state); } catch {}
  }
}

export function onPlaybackChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isPlaying() {
  if (currentAudio && !currentAudio.paused) return true;
  if (speechSynthesis?.speaking && !speechSynthesis.paused) return true;
  return false;
}

export function isPaused() {
  if (currentAudio?.paused && currentAudio.currentTime > 0 && !currentAudio.ended) return true;
  if (speechSynthesis?.paused) return true;
  return false;
}

export function pausePlayback() {
  if (currentAudio && !currentAudio.paused) currentAudio.pause();
  if (speechSynthesis?.speaking && !speechSynthesis.paused) speechSynthesis.pause();
  emit("paused");
}

export function resumePlayback() {
  if (currentAudio && currentAudio.paused) currentAudio.play();
  if (speechSynthesis?.paused) speechSynthesis.resume();
  emit("playing");
}

export function stopPlayback() {
  stopAll();
  emit("stopped");
}

function loadVoices() {
  return new Promise(resolve => {
    const v = speechSynthesis.getVoices();
    if (v.length) return resolve(v);
    speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
  });
}

async function pickBrowserVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = await loadVoices();
  cachedVoice =
    voices.find(v => v.lang === "en-US" && /Samantha|Ava|Google US/.test(v.name)) ||
    voices.find(v => v.lang === "en-US") ||
    voices.find(v => v.lang.startsWith("en")) ||
    voices[0];
  return cachedVoice;
}

function stopAll() {
  if (speechSynthesis?.speaking || speechSynthesis?.paused) speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentUtter = null;
}

function currentSpeed() {
  const s = parseFloat(getSetting("ttsSpeed"));
  return isFinite(s) && s > 0 ? s : 1.0;
}

async function speakBrowser(text, rate) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = await pickBrowserVoice();
  utter.rate = rate;
  utter.pitch = 1;
  utter.onend = () => emit("stopped");
  utter.onerror = () => emit("stopped");
  currentUtter = utter;
  speechSynthesis.speak(utter);
  emit("playing");
}

async function speakGemini(text, speed) {
  const voice = getSetting("ttsVoice") || "Kore";
  const styleId = getSetting("ttsStyle") || "neutral";
  const cacheKey = `${voice}|${styleId}|${text}`;
  let blob = ttsCache.get(cacheKey);
  if (!blob) {
    blob = await synthesizeSpeech(text, { voice, styleId });
    if (ttsCache.size > 30) ttsCache.clear();
    ttsCache.set(cacheKey, blob);
  }
  const url = URL.createObjectURL(blob);
  currentAudio = new Audio(url);
  currentAudio.playbackRate = speed;
  currentAudio.preservesPitch = true;
  currentAudio.onended = () => { URL.revokeObjectURL(url); emit("stopped"); };
  currentAudio.onpause = () => { if (!currentAudio?.ended) emit("paused"); };
  currentAudio.onplay = () => emit("playing");
  await currentAudio.play();
}

export async function speak(text) {
  stopAll();
  const speed = currentSpeed();
  const engine = getSetting("ttsEngine") || "browser";
  if (engine === "gemini" && getSetting("geminiKey")) {
    try {
      await speakGemini(text, speed);
      return;
    } catch (e) {
      console.warn("Gemini TTS 失败，回退浏览器 TTS:", e.message);
    }
  }
  if (!("speechSynthesis" in window)) {
    alert("你的浏览器不支持语音合成");
    return;
  }
  await speakBrowser(text, speed);
}

export async function recordAudio(maxMs = 8000) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  const chunks = [];
  return new Promise((resolve, reject) => {
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      resolve(new Blob(chunks, { type: "audio/webm" }));
    };
    rec.onerror = reject;
    rec.start();
    setTimeout(() => rec.state !== "inactive" && rec.stop(), maxMs);
  });
}
