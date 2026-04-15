import { CHUNKS, CATEGORIES } from "./data/chunks.js";
import { PHRASES } from "./data/phrases.js";
import { SCENARIOS } from "./data/scenarios.js";
import { getState, markLearned, unmarkLearned, updateStreak, setSetting, getSetting, getTodayStats, getActiveDays } from "./storage.js";
import { speak, pausePlayback, resumePlayback, stopPlayback, onPlaybackChange } from "./speech.js";
import { el, speakableText } from "./ui.js";
import { renderFeed } from "./tabs/feed.js";
import { renderSettings } from "./tabs/settings.js";
import { renderBugLog } from "./tabs/buglog.js";
import { renderPhrases, phraseCard } from "./tabs/phrases.js";
import { renderScenarios } from "./tabs/scenarios.js";
import { renderPronunciation } from "./tabs/pronunciation.js";
import { shadowButton } from "./shadowing.js";
import { dueItems, record as srsRecord, getStats as srsStats } from "./srs.js";
import { initSync, pullOnce } from "./sync.js";

const TABS = ["daily", "phrases", "scenarios", "pronunciation", "chunks", "buglog", "feed", "settings"];

function todaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function pickDaily(n = 3) {
  const { due, fresh } = dueItems("chunk", CHUNKS);
  const picks = [...due.slice(0, n)];
  for (const f of fresh) { if (picks.length >= n) break; picks.push(f); }
  if (picks.length < n) {
    const seen = new Set(picks.map(p => p.id));
    for (const c of CHUNKS) { if (picks.length >= n) break; if (!seen.has(c.id)) picks.push(c); }
  }
  return picks;
}

function chunkCard(c, { onToggle } = {}) {
  const state = getState();
  const learned = state.learned.includes(c.id);
  return el("div", { class: "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow transition" },
    el("div", { class: "flex items-start justify-between gap-3" },
      el("div", { class: "min-w-0 flex-1" },
        el("div", { class: "flex items-center gap-2 flex-wrap" },
          el("span", { class: "text-lg font-semibold text-neutral-900" }, c.en),
          el("span", { class: "text-xs text-neutral-500 font-mono" }, c.ipa),
          el("span", { class: "text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600" }, c.category)
        ),
        el("div", { class: "text-sm text-neutral-600 mt-1" }, c.zh),
        el("div", { class: "text-sm text-neutral-800 mt-2 italic" }, "\"", speakableText(c.example, speak), "\""),
        c.exampleZh ? el("div", { class: "text-xs text-neutral-500 mt-1" }, `→ ${c.exampleZh}`) : null
      ),
      el("div", { class: "flex flex-col gap-1 shrink-0" },
        el("button", { class: "text-xs px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700", onclick: () => speak(c.en) }, "🔊 词"),
        el("button", { class: "text-xs px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-200", onclick: () => speak(c.example) }, "🔊 句"),
        shadowButton(c.example, `词块: ${c.en}`)
      )
    ),
    el("div", { class: "mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between" },
      el("label", { class: "flex items-center gap-2 text-sm text-neutral-600 cursor-pointer" },
        el("input", {
          type: "checkbox",
          checked: learned,
          onchange: (e) => {
            if (e.target.checked) { markLearned(c.id); srsRecord("chunk", c.id, 4); }
            else unmarkLearned(c.id);
            onToggle && onToggle();
          }
        }),
        "已掌握"
      ),
      el("button", {
        class: "text-xs text-neutral-500 hover:text-neutral-900",
        onclick: async () => {
          await speak(c.en);
          setTimeout(() => speak(c.example), 1200);
        }
      }, "▶ 连播")
    )
  );
}

const LEVEL_TITLES = [
  "🥚 Web3 小白", "🐣 Crypto Newbie", "🎓 BD 学徒", "🔍 Listing 侦察兵",
  "🤝 Deal Maker", "🏦 Exchange 通", "⚡ Protocol 大使", "🧠 Tokenomics 专家",
  "🌐 Crypto 外交官", "👑 Web3 Mogul"
];

function computeLevel(totalXP) {
  const level = Math.floor(totalXP / 5) + 1;
  const xpInLevel = totalXP % 5;
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  return { level, xpInLevel, xpToNext: 5, title, totalXP };
}

function motivationLine(state, todayStats) {
  const s = state.streak || 0;
  if (todayStats.chunks >= 5) return "🔥 今日目标达成！真正的 deal maker。";
  if (todayStats.chunks >= 3) return "👊 已经掌握 3 个，离今日目标只差一步。";
  if (todayStats.chunks >= 1) return "✨ 好的开始。continue crushing.";
  if (s >= 7) return `🔥 连续 ${s} 天，动量正好，别断！`;
  if (s >= 3) return `💪 连续 ${s} 天了，今天再掌握一个词块。`;
  if (s === 0 && state.learned.length > 0) return "🫡 Ready for a new run? 先攻 1 个。";
  return "🚀 开始今天的练习，从一个词块起步。";
}

function heroCard() {
  const state = getState();
  const totalXP = state.totals?.chunks || state.learned.length;
  const { level, xpInLevel, xpToNext, title } = computeLevel(totalXP);
  const progressPct = Math.round((xpInLevel / xpToNext) * 100);
  const todayStats = getTodayStats();
  const activeDays = getActiveDays();
  const masteredPct = Math.round((state.learned.length / CHUNKS.length) * 100);

  return el("div", { class: "rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6 shadow-lg" },
    el("div", { class: "flex items-start justify-between gap-3" },
      el("div", { class: "min-w-0" },
        el("div", { class: "text-xs opacity-80" }, `Lv.${level}`),
        el("div", { class: "text-xl font-bold tracking-tight" }, title),
        el("div", { class: "text-sm opacity-90 mt-1" }, motivationLine(state, todayStats))
      ),
      el("div", { class: "text-right shrink-0" },
        el("div", { class: "text-3xl" }, state.streak >= 3 ? "🔥" : "✨"),
        el("div", { class: "text-2xl font-bold leading-none" }, state.streak),
        el("div", { class: "text-xs opacity-80" }, "连续天数")
      )
    ),
    el("div", { class: "mt-4" },
      el("div", { class: "flex justify-between text-xs opacity-90 mb-1" },
        el("span", {}, `Lv.${level} 经验 ${xpInLevel}/${xpToNext}`),
        el("span", {}, `下一级：${LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] || "MAX"}`)
      ),
      el("div", { class: "h-2 bg-white/20 rounded-full overflow-hidden" },
        el("div", { class: "h-full bg-white rounded-full transition-all", style: `width: ${progressPct}%` })
      )
    ),
    el("div", { class: "grid grid-cols-4 gap-2 mt-4 text-center" },
      el("div", { class: "bg-white/15 rounded-xl py-2" },
        el("div", { class: "text-lg font-bold" }, todayStats.chunks),
        el("div", { class: "text-[10px] opacity-80" }, "今日词块")
      ),
      el("div", { class: "bg-white/15 rounded-xl py-2" },
        el("div", { class: "text-lg font-bold" }, todayStats.tasks),
        el("div", { class: "text-[10px] opacity-80" }, "今日实战")
      ),
      el("div", { class: "bg-white/15 rounded-xl py-2" },
        el("div", { class: "text-lg font-bold" }, todayStats.bugs),
        el("div", { class: "text-[10px] opacity-80" }, "今日纠错")
      ),
      el("div", { class: "bg-white/15 rounded-xl py-2" },
        el("div", { class: "text-lg font-bold" }, activeDays),
        el("div", { class: "text-[10px] opacity-80" }, "学习天数")
      )
    ),
    el("div", { class: "mt-3 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-xs opacity-95" },
      el("div", {}, "📦 词块 ", el("span", { class: "font-bold" }, `${state.learned.length}/${CHUNKS.length}`)),
      el("div", {}, "🧩 句型 ", el("span", { class: "font-bold" }, `${state.learnedPhrases.length}/${PHRASES.length}`)),
      el("div", {}, "🎬 场景 ", el("span", { class: "font-bold" }, `${Object.keys(state.doneScenarios).length}/${SCENARIOS.length}`))
    )
  );
}

function pickDailyPhrases(n = 2) {
  const { due, fresh } = dueItems("phrase", PHRASES);
  const picks = [...due.slice(0, n)];
  for (const f of fresh) { if (picks.length >= n) break; picks.push(f); }
  if (picks.length < n) {
    const seen = new Set(picks.map(p => p.id));
    for (const p of PHRASES) { if (picks.length >= n) break; if (!seen.has(p.id)) picks.push(p); }
  }
  return picks;
}

function pickDailyScenario() {
  const seed = todaySeed();
  const state = getState();
  const pool = SCENARIOS.slice().sort((a, b) => {
    const ad = Object.keys(state.doneScenarios[a.id] || {}).length;
    const bd = Object.keys(state.doneScenarios[b.id] || {}).length;
    return ad - bd;
  });
  const x = Math.sin(seed + 7) * 10000;
  return pool[Math.floor((x - Math.floor(x)) * pool.length)];
}

function renderDaily() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  const phrases = pickDailyPhrases(2);
  const scenario = pickDailyScenario();
  const chunks = pickDaily(3);
  const state = getState();
  const isNewUser = state.learned.length === 0 && state.learnedPhrases.length === 0 && !getSetting("geminiKey");

  root.appendChild(el("div", { class: "space-y-6" },
    isNewUser ? el("div", { class: "p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 space-y-3" },
      el("div", { class: "flex items-center gap-2" },
        el("span", { class: "text-2xl" }, "👋"),
        el("h2", { class: "text-lg font-bold text-indigo-900" }, "欢迎！这是 Web3 商务英语练习工具")
      ),
      el("p", { class: "text-sm text-neutral-700 leading-relaxed" },
        "为币圈 BD / 项目方设计：句型库 + 场景对练（交易所 listing、VC 电话、AMA、合作谈判等 40+ 场景）+ AI 发音纠错 + 实时 Twitter/Reddit 素材。数据完全存本机，零成本。"
      ),
      el("div", { class: "text-xs text-neutral-600 space-y-1" },
        el("div", null, "🚀 ", el("b", null, "快速开始"), "：去「设置」填个 Gemini API Key（", el("a", { href: "https://aistudio.google.com", target: "_blank", class: "text-indigo-600 underline" }, "免费申请"), "）→ 回到「每日」开练"),
        el("div", null, "📚 ", el("b", null, "怎么学"), "：每天 3 个词块 + 2 个句型 + 1 个场景，大概 30 分钟"),
        el("div", null, "📱 ", el("b", null, "装机"), "：手机 Safari 打开 → 分享 → 添加到主屏幕，当 App 用")
      ),
      el("div", { class: "flex gap-2 pt-2" },
        el("button", { class: "px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium", onclick: () => switchTab("settings") }, "⚙️ 去设置"),
        el("button", { class: "px-4 py-2 rounded-lg bg-white border border-indigo-300 text-indigo-700 text-sm", onclick: () => switchTab("phrases") }, "📖 直接逛句型库")
      )
    ) : null,

    (() => {
      const cs = srsStats("chunk", CHUNKS);
      const ps = srsStats("phrase", PHRASES);
      return el("div", { class: "p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100" },
        el("div", { class: "flex items-center justify-between" },
          el("div", { class: "text-sm font-bold text-emerald-900" }, "📅 今日三步走"),
          el("div", { class: "text-xs" },
            ps.dueCount ? el("span", { class: "px-2 py-0.5 rounded bg-amber-200 text-amber-900 mr-1" }, `🔁 ${ps.dueCount} 句型待复习`) : null,
            cs.dueCount ? el("span", { class: "px-2 py-0.5 rounded bg-amber-200 text-amber-900" }, `🔁 ${cs.dueCount} 词块待复习`) : null
          )
        ),
        el("div", { class: "text-xs text-emerald-700 mt-0.5" }, "① 2 个句型 → ② 1 个场景 → ③ 3 个词块（优先到期复习项）")
      );
    })(),

    el("div", { class: "space-y-3" },
      el("div", { class: "flex items-center justify-between" },
        el("h3", { class: "text-lg font-bold" }, "① 今日句型（2 个）"),
        el("button", { class: "text-xs text-indigo-600", onclick: () => switchTab("phrases") }, "全部 →")
      ),
      ...phrases.map(p => phraseCard(p, { onToggle: () => { renderHero(); renderDaily(); } }))
    ),

    scenario ? el("div", { class: "space-y-3" },
      el("div", { class: "flex items-center justify-between" },
        el("h3", { class: "text-lg font-bold" }, "② 今日场景"),
        el("button", { class: "text-xs text-indigo-600", onclick: () => switchTab("scenarios") }, "全部 →")
      ),
      el("div", {
        class: "rounded-2xl bg-white border border-neutral-200 p-5 space-y-2 cursor-pointer hover:border-indigo-300",
        onclick: () => switchTab("scenarios")
      },
        el("div", { class: "text-xs text-neutral-500" }, `场景 #${scenario.id}`),
        el("div", { class: "text-lg font-semibold" }, scenario.title),
        el("div", { class: "text-sm text-neutral-600" }, "📍 " + scenario.context.slice(0, 80) + "..."),
        el("div", { class: "text-xs text-indigo-600 mt-1" }, "点击进入 L1 跟读 → L2 填空 → L3 自由生成 →")
      )
    ) : null,

    el("div", { class: "space-y-3" },
      el("div", { class: "flex items-center justify-between" },
        el("h3", { class: "text-lg font-bold" }, "③ 今日词块（3 个）"),
        el("button", { class: "text-xs text-indigo-600", onclick: () => switchTab("chunks") }, "全部 →")
      ),
      ...chunks.map(c => chunkCard(c, { onToggle: () => { renderHero(); renderDaily(); } }))
    )
  ));
}

function renderHero() {
  const slot = document.getElementById("hero-slot");
  if (slot) {
    slot.innerHTML = "";
    slot.appendChild(heroCard());
  }
}

function renderChunks() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  let activeCat = "All";
  let query = "";
  let filter = "all";

  const list = el("div", { class: "space-y-3" });

  function redraw() {
    list.innerHTML = "";
    const state = getState();
    const items = CHUNKS.filter(c => {
      if (activeCat !== "All" && c.category !== activeCat) return false;
      if (filter === "learned" && !state.learned.includes(c.id)) return false;
      if (filter === "unlearned" && state.learned.includes(c.id)) return false;
      if (query && !(c.en.toLowerCase().includes(query) || c.zh.includes(query))) return false;
      return true;
    });
    if (!items.length) list.appendChild(el("div", { class: "text-neutral-400 text-center py-12" }, "没有匹配项"));
    items.forEach(c => list.appendChild(chunkCard(c, { onToggle: () => { renderHero(); redraw(); } })));
  }

  const catBtns = el("div", { class: "flex gap-2 flex-wrap" },
    ...["All", ...CATEGORIES].map(cat =>
      el("button", {
        class: "text-xs px-3 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100",
        onclick: (e) => {
          activeCat = cat;
          [...catBtns.children].forEach(b => b.className = "text-xs px-3 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100");
          e.target.className = "text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white";
          redraw();
        }
      }, cat)
    )
  );
  catBtns.firstChild.className = "text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white";

  root.appendChild(el("div", { class: "space-y-4" },
    el("h2", { class: "text-2xl font-bold" }, "词块库"),
    el("input", {
      type: "text",
      placeholder: "搜索英文或中文...",
      class: "w-full px-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500",
      oninput: (e) => { query = e.target.value.trim().toLowerCase(); redraw(); }
    }),
    catBtns,
    el("div", { class: "flex gap-2" },
      ...[["all", "全部"], ["unlearned", "未掌握"], ["learned", "已掌握"]].map(([k, label]) =>
        el("button", {
          class: "text-xs px-3 py-1 rounded-md text-neutral-600 hover:text-neutral-900",
          onclick: (e) => {
            filter = k;
            e.target.parentNode.querySelectorAll("button").forEach(b => b.className = "text-xs px-3 py-1 rounded-md text-neutral-600 hover:text-neutral-900");
            e.target.className = "text-xs px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold";
            redraw();
          }
        }, label)
      )
    ),
    list
  ));
  redraw();
}

function renderPlaceholder(title, text) {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  root.appendChild(el("div", { class: "max-w-xl mx-auto text-center py-16" },
    el("h2", { class: "text-2xl font-bold" }, title),
    el("p", { class: "text-neutral-500 mt-2" }, text),
    el("p", { class: "text-xs text-neutral-400 mt-6" }, "Phase 3+ 开放")
  ));
}

function switchTab(name) {
  renderHero();
  TABS.forEach(t => {
    const b = document.querySelector(`[data-tab="${t}"]`);
    if (b) b.className = b.dataset.tab === name
      ? "px-4 py-2 rounded-lg bg-neutral-900 text-white font-medium whitespace-nowrap"
      : "px-4 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 whitespace-nowrap";
  });
  if (name === "daily") renderDaily();
  else if (name === "chunks") renderChunks();
  else if (name === "feed") renderFeed();
  else if (name === "buglog") renderBugLog();
  else if (name === "settings") renderSettings();
  else if (name === "phrases") renderPhrases();
  else if (name === "scenarios") renderScenarios();
  else if (name === "pronunciation") renderPronunciation();
}

function initPlaybackBar() {
  const bar = document.getElementById("playback-bar");
  const status = document.getElementById("pb-status");
  const pauseBtn = document.getElementById("pb-pause");
  const resumeBtn = document.getElementById("pb-resume");
  const stopBtn = document.getElementById("pb-stop");
  if (!bar) return;
  pauseBtn.onclick = pausePlayback;
  resumeBtn.onclick = resumePlayback;
  stopBtn.onclick = stopPlayback;
  onPlaybackChange((state) => {
    if (state === "playing") {
      bar.classList.remove("hidden");
      pauseBtn.classList.remove("hidden");
      resumeBtn.classList.add("hidden");
      status.textContent = "▶ 播放中";
    } else if (state === "paused") {
      bar.classList.remove("hidden");
      pauseBtn.classList.add("hidden");
      resumeBtn.classList.remove("hidden");
      status.textContent = "⏸ 已暂停";
    } else {
      bar.classList.add("hidden");
    }
  });
}

function initSpeedSelector() {
  const sel = document.getElementById("global-speed");
  if (!sel) return;
  const cur = getSetting("ttsSpeed") ?? 1.0;
  sel.value = String(cur);
  sel.onchange = (e) => setSetting("ttsSpeed", parseFloat(e.target.value));
}

function init() {
  updateStreak();
  initSpeedSelector();
  initPlaybackBar();
  initSync();
  switchTab("daily");
  window.addEventListener("sync:applied", () => {
    switchTab(document.querySelector("[data-tab].bg-neutral-900")?.dataset.tab || "daily");
  });
}

init();
window.switchTab = switchTab;
window.refreshHero = renderHero;
