import { el, spinner, speakableText, toast } from "../ui.js";
import { PHONETICS } from "../data/phonetics.js";
import { speak } from "../speech.js";
import { reviewPronunciation } from "../ai.js";
import { addBug, bumpStat } from "../storage.js";

export function renderPronunciation() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  root.appendChild(el("div", { class: "space-y-4" },
    el("div", {},
      el("h2", { class: "text-2xl font-bold" }, "发音训练"),
      el("p", { class: "text-sm text-neutral-500 mt-1" }, "8 大发音坑 · 跟读 → 录音 → 对比自查")
    ),
    el("div", { class: "space-y-4" }, ...PHONETICS.map(p => phoneticCard(p)))
  ));
}

function phoneticCard(p) {
  const recordSlot = el("div", {});
  const reviewSlot = el("div", {});
  let mediaRecorder = null;
  let chunks = [];
  let recordedUrl = null;
  let recordedBlob = null;

  async function runAIReview() {
    if (!recordedBlob) return toast("先录一段");
    reviewSlot.innerHTML = "";
    reviewSlot.appendChild(spinner("Gemini 正在听你的录音..."));
    try {
      const r = await reviewPronunciation(recordedBlob, p.sentence);
      reviewSlot.innerHTML = "";
      reviewSlot.appendChild(renderPronReview(r, p));
      bumpStat("reviews");
      if (r.issues?.length) {
        addBug({
          original: r.transcript || "",
          corrected: p.sentence,
          issues: r.issues.map(i => ({ type: "发音", quote: i.word, why: `${i.expected_ipa} vs 你念的 ${i.heard} — ${i.tip}` })),
          alternatives: [],
          score: r.score,
          context: `发音训练: ${p.title}`
        });
        toast(`+1 纠错 · ${r.issues.length} 条发音错题已记`, "success");
      } else {
        toast("+1 纠错 · 发音很棒！", "success");
      }
      window.refreshHero?.();
    } catch (e) {
      reviewSlot.innerHTML = "";
      reviewSlot.appendChild(el("div", { class: "text-sm text-red-600 p-3 bg-red-50 rounded-lg" }, e.message));
    }
  }

  async function startRecord() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        recordedBlob = new Blob(chunks, { type: "audio/webm" });
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        recordedUrl = URL.createObjectURL(recordedBlob);
        stream.getTracks().forEach(t => t.stop());
        reviewSlot.innerHTML = "";
        renderRecordSlot("stopped");
      };
      mediaRecorder.start();
      renderRecordSlot("recording");
    } catch (e) {
      toast("无法访问麦克风：" + e.message, "error");
    }
  }

  function stopRecord() { mediaRecorder?.stop(); }

  function renderRecordSlot(state) {
    recordSlot.innerHTML = "";
    if (state === "recording") {
      recordSlot.appendChild(el("div", { class: "flex items-center gap-2" },
        el("button", { class: "text-sm px-4 py-2 rounded-lg bg-red-600 text-white animate-pulse", onclick: stopRecord }, "⏹ 停止录音"),
        el("span", { class: "text-xs text-red-600" }, "● 正在录音...")
      ));
    } else if (state === "stopped" && recordedUrl) {
      const audio = el("audio", { src: recordedUrl, controls: true, class: "h-8" });
      recordSlot.appendChild(el("div", { class: "flex items-center gap-2 flex-wrap" },
        audio,
        el("button", { class: "text-xs px-3 py-1.5 rounded-lg bg-neutral-900 text-white", onclick: () => speak(p.sentence) }, "🔊 原声"),
        el("button", { class: "text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white", onclick: startRecord }, "🎤 重录"),
        el("button", { class: "text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white", onclick: runAIReview }, "🤖 AI 纠错")
      ));
    }
  }

  return el("div", { class: "rounded-2xl bg-white border border-neutral-200 p-5 space-y-3" },
    el("div", { class: "flex items-start justify-between gap-3" },
      el("div", { class: "min-w-0" },
        el("div", { class: "text-lg font-bold text-neutral-900" }, p.title),
        el("div", { class: "text-xs text-amber-600 mt-0.5" }, `难度 ${p.difficulty}`)
      )
    ),
    el("div", { class: "text-sm text-neutral-700 p-3 rounded-lg bg-indigo-50" }, "🧠 " + p.howTo),
    el("div", {},
      el("div", { class: "text-xs text-neutral-500 mb-1" }, "最小对立对（点击朗读）"),
      el("div", { class: "flex flex-wrap gap-2" },
        ...p.pairs.map(([a, b]) => el("div", { class: "flex items-center gap-1 text-sm" },
          el("button", { class: "px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-mono", onclick: () => speak(a) }, a),
          el("span", { class: "text-neutral-400" }, "↔"),
          el("button", { class: "px-2 py-1 rounded bg-rose-50 text-rose-700 font-mono", onclick: () => speak(b) }, b)
        ))
      )
    ),
    el("div", {},
      el("div", { class: "text-xs text-neutral-500 mb-1" }, "Web3 高频词"),
      el("div", { class: "flex flex-wrap gap-1.5" },
        ...p.web3Words.map(w => el("button", {
          class: "text-xs px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 font-mono",
          onclick: () => speak(w)
        }, w))
      )
    ),
    el("div", { class: "p-3 rounded-lg bg-neutral-50 space-y-1" },
      el("div", { class: "text-sm text-neutral-800" }, speakableText(p.sentence, speak)),
      el("div", { class: "text-xs text-neutral-500" }, p.sentenceZh)
    ),
    el("div", { class: "flex gap-2 flex-wrap pt-2 border-t border-neutral-100" },
      el("button", { class: "text-sm px-4 py-2 rounded-lg bg-emerald-600 text-white", onclick: () => speak(p.sentence) }, "🔊 听原声"),
      el("button", { class: "text-sm px-4 py-2 rounded-lg bg-red-600 text-white", onclick: startRecord }, "🎤 录我的发音")
    ),
    recordSlot,
    reviewSlot
  );
}

function renderPronReview(r, p) {
  const score = r.score ?? 0;
  const color = score >= 80 ? "emerald" : score >= 60 ? "amber" : "rose";
  return el("div", { class: `p-4 rounded-xl bg-${color}-50 border border-${color}-200 space-y-2 text-sm` },
    el("div", { class: "flex items-center justify-between" },
      el("div", { class: `font-bold text-${color}-800` }, `🎯 发音得分 ${score}/100`),
      el("button", { class: "text-xs px-2 py-1 rounded bg-white", onclick: () => speak(p.sentence) }, "🔊 再听原声")
    ),
    r.transcript ? el("div", { class: "text-xs text-neutral-600" }, "Gemini 听到：「", el("span", { class: "font-mono" }, r.transcript), "」") : null,
    r.accuracy_zh ? el("div", { class: `text-${color}-900` }, r.accuracy_zh) : null,
    r.issues?.length ? el("div", { class: "pt-2 border-t border-white space-y-1" },
      el("div", { class: "text-xs font-semibold text-neutral-700" }, "需要改进"),
      ...r.issues.map(i => el("div", { class: "text-xs p-2 rounded bg-white" },
        el("span", { class: "font-mono font-semibold" }, i.word),
        " 标准 ", el("span", { class: "font-mono text-emerald-700" }, i.expected_ipa),
        " · 你念的 ", el("span", { class: "font-mono text-rose-700" }, i.heard),
        el("div", { class: "text-neutral-600 mt-0.5" }, "💡 " + i.tip)
      ))
    ) : null,
    r.strengths?.length ? el("div", { class: "text-xs text-emerald-700" }, "👍 " + r.strengths.join(" · ")) : null
  );
}
