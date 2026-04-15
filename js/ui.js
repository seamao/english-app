export function el(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "checked" || k === "disabled" || k === "value") n[k] = v;
    else n.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null || c === false) continue;
    n.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  }
  return n;
}

export function spinner(text = "加载中...") {
  return el("div", { class: "flex items-center gap-2 text-sm text-neutral-500 py-8 justify-center" },
    el("div", { class: "w-4 h-4 rounded-full border-2 border-neutral-300 border-t-neutral-700 animate-spin" }),
    text
  );
}

let activePopup = null;
const wordCache = new Map();
try {
  const stored = JSON.parse(localStorage.getItem("web3en.wordcache") || "{}");
  for (const [k, v] of Object.entries(stored)) wordCache.set(k, v);
} catch {}

function persistWordCache() {
  const obj = {};
  for (const [k, v] of wordCache) obj[k] = v;
  try { localStorage.setItem("web3en.wordcache", JSON.stringify(obj)); } catch {}
}

function closePopup() {
  if (activePopup) { activePopup.remove(); activePopup = null; }
}

document.addEventListener("click", (e) => {
  if (activePopup && !activePopup.contains(e.target)) closePopup();
});

async function showWordPopup(anchor, word, speakFn) {
  closePopup();
  const rect = anchor.getBoundingClientRect();
  const pop = el("div", {
    class: "fixed z-50 bg-white rounded-xl shadow-2xl border border-neutral-200 p-3 max-w-xs text-sm",
    style: `left: ${Math.min(rect.left, window.innerWidth - 320)}px; top: ${rect.bottom + 6}px;`
  });
  pop.appendChild(el("div", { class: "flex items-center justify-between gap-2 mb-2" },
    el("span", { class: "font-bold text-neutral-900" }, word),
    el("div", { class: "flex gap-1" },
      el("button", { class: "text-xs px-2 py-0.5 rounded bg-neutral-900 text-white", onclick: (e) => { e.stopPropagation(); speakFn(word); } }, "🔊"),
      el("button", { class: "text-xs px-2 py-0.5 rounded text-neutral-400 hover:text-neutral-700", onclick: (e) => { e.stopPropagation(); closePopup(); } }, "✕")
    )
  ));
  const body = el("div", { class: "space-y-1 text-neutral-700" });
  pop.appendChild(body);
  document.body.appendChild(pop);
  activePopup = pop;

  const key = word.toLowerCase();
  const cached = wordCache.get(key);
  if (cached) {
    renderWordInfo(body, cached);
    return;
  }
  body.appendChild(el("div", { class: "text-xs text-neutral-400" }, "查询中..."));
  try {
    const { lookupWord } = await import("./ai.js");
    const info = await lookupWord(word);
    wordCache.set(key, info);
    persistWordCache();
    body.innerHTML = "";
    renderWordInfo(body, info);
  } catch (e) {
    body.innerHTML = "";
    body.appendChild(el("div", { class: "text-xs text-red-600" }, `查询失败: ${e.message}`));
  }
}

function renderWordInfo(body, info) {
  if (info.ipa) body.appendChild(el("div", { class: "font-mono text-xs text-neutral-500" }, info.ipa));
  if (info.pos) body.appendChild(el("div", { class: "text-xs text-indigo-600" }, info.pos));
  if (info.zh) body.appendChild(el("div", { class: "font-medium text-neutral-900" }, info.zh));
  if (info.example) body.appendChild(el("div", { class: "pt-1 text-xs italic text-neutral-600" }, `"${info.example}"`));
  if (info.exampleZh) body.appendChild(el("div", { class: "text-xs text-neutral-500" }, info.exampleZh));
}

export function speakableText(text, speakFn, { className = "" } = {}) {
  const wrap = el("span", { class: `speakable ${className}` });
  const tokens = text.split(/(\s+|[.,!?;:"()—\-])/);
  for (const tok of tokens) {
    if (!tok) continue;
    if (/^\s+$/.test(tok) || /^[.,!?;:"()—\-]$/.test(tok)) {
      wrap.appendChild(document.createTextNode(tok));
    } else {
      const cleaned = tok.replace(/^[^\w]+|[^\w]+$/g, "");
      wrap.appendChild(el("span", {
        class: "cursor-pointer hover:bg-yellow-200 rounded transition-colors px-0.5",
        title: `单击朗读 · 双击查词`,
        onclick: (e) => { e.stopPropagation(); speakFn(cleaned); },
        ondblclick: (e) => { e.stopPropagation(); if (cleaned) showWordPopup(e.target, cleaned, speakFn); }
      }, tok));
    }
  }
  return wrap;
}

export function toast(text, type = "info") {
  const colors = {
    info: "bg-neutral-900 text-white",
    error: "bg-red-600 text-white",
    success: "bg-emerald-600 text-white"
  };
  const t = el("div", {
    class: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm ${colors[type] || colors.info}`
  }, text);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}
