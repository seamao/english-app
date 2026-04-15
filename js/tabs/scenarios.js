import { el, spinner, toast, speakableText } from "../ui.js";
import { SCENARIOS } from "../data/scenarios.js";
import { getState, markScenario, addBug, bumpStat } from "../storage.js";
import { speak } from "../speech.js";
import { reviewWriting } from "../ai.js";
import { shadowButton } from "../shadowing.js";

export function renderScenarios() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  root.appendChild(el("div", { class: "space-y-4" },
    el("div", {},
      el("h2", { class: "text-2xl font-bold" }, "场景对练"),
      el("p", { class: "text-sm text-neutral-500 mt-1" }, "从 L1 跟读 → L2 填空 → L3 自由生成，循序渐进")
    ),
    el("div", { class: "space-y-3" }, ...SCENARIOS.map(s => scenarioCard(s)))
  ));
}

function scenarioCard(s) {
  const done = getState().doneScenarios[s.id] || {};
  return el("div", { class: "rounded-2xl bg-white border border-neutral-200 p-5 space-y-3 cursor-pointer hover:border-indigo-300", onclick: () => openScenario(s) },
    el("div", { class: "flex items-start justify-between gap-3" },
      el("div", { class: "min-w-0" },
        el("div", { class: "text-xs text-neutral-500" }, `场景 #${s.id}`),
        el("div", { class: "text-lg font-semibold text-neutral-900" }, s.title),
        el("div", { class: "text-sm text-neutral-600 mt-1" }, s.context.slice(0, 80) + (s.context.length > 80 ? "..." : ""))
      ),
      el("div", { class: "flex gap-1 shrink-0" },
        ...["L1", "L2", "L3"].map(lv => el("span", {
          class: `text-[10px] px-1.5 py-0.5 rounded ${done[lv] ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`
        }, done[lv] ? `✓ ${lv}` : lv))
      )
    )
  );
}

function openScenario(s) {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  let activeLevel = "L1";

  const container = el("div", { class: "space-y-4" });
  const levelSlot = el("div", {});

  function renderLevel() {
    levelSlot.innerHTML = "";
    if (activeLevel === "L1") levelSlot.appendChild(levelL1(s));
    else if (activeLevel === "L2") levelSlot.appendChild(levelL2(s));
    else levelSlot.appendChild(levelL3(s));
  }

  const tabBtns = el("div", { class: "flex gap-2" },
    ...[
      ["L1", "L1 · 跟读模板", "bg-emerald-100 text-emerald-800"],
      ["L2", "L2 · 填空替换", "bg-amber-100 text-amber-800"],
      ["L3", "L3 · 自由生成", "bg-rose-100 text-rose-800"]
    ].map(([k, l, color]) => el("button", {
      class: `text-xs px-3 py-1.5 rounded-lg font-medium ${k === activeLevel ? color : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`,
      onclick: (e) => {
        activeLevel = k;
        tabBtns.querySelectorAll("button").forEach((b, i) => {
          const [kk, , c] = [["L1", , "bg-emerald-100 text-emerald-800"], ["L2", , "bg-amber-100 text-amber-800"], ["L3", , "bg-rose-100 text-rose-800"]][i];
          b.className = `text-xs px-3 py-1.5 rounded-lg font-medium ${kk === activeLevel ? c : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`;
        });
        renderLevel();
      }
    }, l))
  );

  container.appendChild(el("button", { class: "text-sm text-neutral-600 hover:text-neutral-900", onclick: renderScenarios }, "← 返回场景列表"));
  container.appendChild(el("div", { class: "p-5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2" },
    el("h3", { class: "text-lg font-bold text-indigo-900" }, s.title),
    el("div", { class: "text-sm text-indigo-800" }, "📍 " + s.context),
    s.tips ? el("ul", { class: "text-xs text-indigo-700 space-y-0.5 pl-5 list-disc" }, ...s.tips.map(t => el("li", {}, t))) : null
  ));
  container.appendChild(tabBtns);
  container.appendChild(levelSlot);
  root.appendChild(container);
  renderLevel();
}

function levelL1(s) {
  return el("div", { class: "p-5 rounded-2xl bg-white border border-neutral-200 space-y-3" },
    el("div", { class: "text-xs font-semibold text-emerald-700 uppercase" }, "L1 · 跟读模板"),
    el("div", { class: "text-sm text-neutral-500" }, "听 → 点单词查词 → 整句跟读。完全掌握再去 L2。"),
    el("div", { class: "text-base text-neutral-900 leading-relaxed p-4 rounded-xl bg-neutral-50" }, speakableText(s.L1.script, speak)),
    el("div", { class: "flex gap-2 flex-wrap items-start" },
      el("button", { class: "text-sm px-4 py-2 rounded-lg bg-emerald-600 text-white", onclick: () => speak(s.L1.script) }, "🔊 朗读整段"),
      shadowButton(s.L1.script, `场景 L1: ${s.title}`),
      el("button", {
        class: "text-sm px-4 py-2 rounded-lg bg-neutral-900 text-white",
        onclick: () => { markScenario(s.id, "L1"); window.refreshHero?.(); toast("L1 已完成 +1", "success"); }
      }, "✓ 我跟读完了")
    )
  );
}

function levelL2(s) {
  const inputs = {};
  const L2 = s.L2;
  const result = el("div", {});

  function compose() {
    let t = L2.template;
    for (const f of L2.fields) {
      const v = inputs[f]?.value?.trim() || `[${f}]`;
      t = t.replace(`[${f}]`, v);
    }
    return t;
  }

  return el("div", { class: "p-5 rounded-2xl bg-white border border-neutral-200 space-y-3" },
    el("div", { class: "text-xs font-semibold text-amber-700 uppercase" }, "L2 · 填空替换"),
    el("div", { class: "text-sm text-neutral-500" }, "在模板里填入你自己的信息，让句子变成你的版本。"),
    el("div", { class: "p-4 rounded-xl bg-neutral-50 text-sm text-neutral-700 font-mono" }, L2.template),
    el("div", { class: "grid grid-cols-2 gap-2" },
      ...L2.fields.map(f => {
        const inp = el("input", {
          type: "text",
          placeholder: f,
          class: "px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        });
        inputs[f] = inp;
        return el("label", { class: "block" },
          el("span", { class: "text-xs text-neutral-500" }, f),
          inp
        );
      })
    ),
    el("div", { class: "flex gap-2" },
      el("button", {
        class: "text-sm px-4 py-2 rounded-lg bg-amber-600 text-white",
        onclick: () => {
          const t = compose();
          result.innerHTML = "";
          result.appendChild(el("div", { class: "p-4 rounded-xl bg-amber-50 text-sm text-amber-900 space-y-2" },
            speakableText(t, speak),
            shadowButton(t, `场景 L2: ${s.title}`)
          ));
          speak(t);
        }
      }, "▶ 生成并朗读"),
      el("button", {
        class: "text-sm px-4 py-2 rounded-lg bg-neutral-900 text-white",
        onclick: () => { markScenario(s.id, "L2"); window.refreshHero?.(); toast("L2 已完成 +1", "success"); }
      }, "✓ 完成")
    ),
    result
  );
}

function levelL3(s) {
  const textarea = el("textarea", {
    rows: "5",
    placeholder: "用你自己的英文写在这里...",
    class: "w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
  });
  const resultSlot = el("div", {});

  return el("div", { class: "p-5 rounded-2xl bg-white border border-neutral-200 space-y-3" },
    el("div", { class: "text-xs font-semibold text-rose-700 uppercase" }, "L3 · 自由生成"),
    el("div", { class: "text-sm text-neutral-700 p-3 rounded-lg bg-rose-50" }, "📝 " + s.L3.prompt),
    s.L3.mustUse ? el("div", { class: "text-xs text-neutral-500" },
      "必须用到：",
      ...s.L3.mustUse.map(m => el("span", { class: "inline-block mx-1 px-2 py-0.5 rounded bg-neutral-100 font-mono" }, m))
    ) : null,
    textarea,
    el("button", {
      class: "text-sm px-4 py-2 rounded-lg bg-rose-600 text-white",
      onclick: async () => {
        const val = textarea.value.trim();
        if (!val) return toast("先写点东西");
        resultSlot.innerHTML = "";
        resultSlot.appendChild(spinner("Gemini 正在批改..."));
        try {
          const r = await reviewWriting(val, s.L3.prompt);
          resultSlot.innerHTML = "";
          resultSlot.appendChild(renderReview(r));
          bumpStat("tasks");
          bumpStat("reviews");
          markScenario(s.id, "L3");
          window.refreshHero?.();
          if (r.issues?.length) {
            addBug({ ...r, context: `场景 L3: ${s.title}` });
            toast(`+1 场景完成 · ${r.issues.length} 条错题已记`, "success");
          } else {
            toast("+1 场景完成 · 满分！", "success");
          }
        } catch (e) {
          resultSlot.innerHTML = "";
          resultSlot.appendChild(el("div", { class: "text-sm text-red-600 p-3 bg-red-50 rounded-lg" }, e.message));
        }
      }
    }, "提交 AI 批改"),
    resultSlot
  );
}

function renderReview(r) {
  return el("div", { class: "space-y-3" },
    typeof r.score === "number" ? el("div", { class: "text-xs text-neutral-500" }, `得分 ${r.score}/100`) : null,
    el("div", { class: "text-sm" },
      el("div", { class: "text-neutral-500 text-xs mb-1" }, "修正（点任意单词朗读）"),
      el("div", { class: "p-2 rounded bg-emerald-50 text-emerald-900" }, speakableText(r.corrected || "", speak))
    ),
    r.issues?.length ? el("div", { class: "text-sm" },
      el("div", { class: "text-neutral-500 text-xs mb-1" }, "问题"),
      el("ul", { class: "space-y-1 text-xs" },
        ...r.issues.map(i => el("li", { class: "p-2 rounded bg-rose-50 text-rose-900" },
          el("span", { class: "font-semibold" }, `[${i.type}] `),
          el("span", { class: "font-mono" }, i.quote), " — ", i.why
        ))
      )
    ) : null,
    r.alternatives?.length ? el("div", { class: "text-sm" },
      el("div", { class: "text-neutral-500 text-xs mb-1" }, "替代表达"),
      el("ul", { class: "space-y-1 text-xs pl-4 list-disc text-neutral-700" },
        ...r.alternatives.map(a => el("li", {}, speakableText(a, speak)))
      )
    ) : null
  );
}
