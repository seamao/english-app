import { el, spinner, toast } from "./ui.js";
import { speak } from "./speech.js";
import { reviewPronunciation } from "./ai.js";
import { addBug, bumpStat } from "./storage.js";

export function shadowButton(targetText, contextLabel = "") {
  let mediaRecorder = null;
  let chunks = [];
  let recordedBlob = null;
  let recordedUrl = null;
  const slot = el("div", { class: "mt-2" });

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
        render("stopped");
      };
      mediaRecorder.start();
      render("recording");
    } catch (e) {
      toast("无法访问麦克风：" + e.message, "error");
    }
  }

  async function runReview() {
    if (!recordedBlob) return;
    const reviewSlot = el("div", { class: "mt-2" });
    slot.appendChild(reviewSlot);
    reviewSlot.appendChild(spinner("Gemini 正在听..."));
    try {
      const r = await reviewPronunciation(recordedBlob, targetText);
      reviewSlot.innerHTML = "";
      reviewSlot.appendChild(renderReview(r, targetText));
      bumpStat("reviews");
      if (r.issues?.length) {
        addBug({
          original: r.transcript || "",
          corrected: targetText,
          issues: r.issues.map(i => ({ type: "发音", quote: i.word, why: `${i.expected_ipa} vs 你念的 ${i.heard} — ${i.tip}` })),
          alternatives: [], score: r.score, context: contextLabel || "跟读"
        });
      }
      window.refreshHero?.();
    } catch (e) {
      reviewSlot.innerHTML = "";
      reviewSlot.appendChild(el("div", { class: "text-xs text-red-600 p-2 bg-red-50 rounded" }, e.message));
    }
  }

  function render(state) {
    slot.innerHTML = "";
    if (state === "recording") {
      slot.appendChild(el("div", { class: "flex items-center gap-2" },
        el("button", { class: "text-xs px-3 py-1.5 rounded bg-red-600 text-white animate-pulse", onclick: () => mediaRecorder?.stop() }, "⏹ 停止"),
        el("span", { class: "text-xs text-red-600" }, "● 录音中")
      ));
    } else if (state === "stopped") {
      slot.appendChild(el("div", { class: "flex items-center gap-2 flex-wrap" },
        el("audio", { src: recordedUrl, controls: true, class: "h-7" }),
        el("button", { class: "text-xs px-2 py-1 rounded bg-red-600 text-white", onclick: startRecord }, "🎤 重录"),
        el("button", { class: "text-xs px-2 py-1 rounded bg-indigo-600 text-white", onclick: runReview }, "🤖 AI 纠错")
      ));
    }
  }

  return el("div", { class: "inline-flex flex-col items-stretch" },
    el("button", {
      class: "text-xs px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100",
      onclick: startRecord
    }, "🎤 跟读测评"),
    slot
  );
}

function renderReview(r, target) {
  const score = r.score ?? 0;
  const color = score >= 80 ? "emerald" : score >= 60 ? "amber" : "rose";
  return el("div", { class: `p-3 rounded-lg bg-${color}-50 border border-${color}-200 space-y-1.5 text-xs` },
    el("div", { class: "flex items-center justify-between" },
      el("div", { class: `font-bold text-${color}-800` }, `🎯 ${score}/100`),
      el("button", { class: "text-xs px-2 py-0.5 rounded bg-white", onclick: () => speak(target) }, "🔊 原声")
    ),
    r.transcript ? el("div", { class: "text-neutral-600" }, "听到：", el("span", { class: "font-mono" }, r.transcript)) : null,
    r.accuracy_zh ? el("div", { class: `text-${color}-900` }, r.accuracy_zh) : null,
    r.issues?.length ? el("div", { class: "space-y-1" },
      ...r.issues.map(i => el("div", { class: "p-1.5 rounded bg-white" },
        el("span", { class: "font-mono font-semibold" }, i.word), " ",
        el("span", { class: "font-mono text-emerald-700" }, i.expected_ipa), " / 你念 ",
        el("span", { class: "font-mono text-rose-700" }, i.heard),
        el("div", { class: "text-neutral-600" }, "💡 " + i.tip)
      ))
    ) : null
  );
}
