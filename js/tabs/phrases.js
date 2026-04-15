import { el, speakableText } from "../ui.js";
import { PHRASES, PHRASE_CATEGORIES } from "../data/phrases.js";
import { getState, markPhrase, unmarkPhrase } from "../storage.js";
import { speak } from "../speech.js";
import { shadowButton } from "../shadowing.js";
import { record as srsRecord } from "../srs.js";

export function phraseCard(p, { onToggle } = {}) {
  const learned = getState().learnedPhrases.includes(p.id);
  return el("div", { class: "rounded-2xl border border-neutral-200 bg-white p-5 space-y-3" },
    el("div", { class: "flex items-start justify-between gap-3" },
      el("div", { class: "min-w-0" },
        el("div", { class: "flex items-center gap-2" },
          el("span", { class: "text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700" }, p.category),
          el("span", { class: "text-xs text-neutral-400" }, `#${p.id}`)
        ),
        el("div", { class: "text-sm text-neutral-500 mt-2" }, "骨架：" + p.skeleton),
        el("div", { class: "text-lg font-semibold text-neutral-900 mt-1" }, speakableText(p.pattern, speak)),
        el("div", { class: "text-xs text-neutral-400 font-mono" }, p.ipa)
      ),
      el("div", { class: "flex flex-col gap-1 shrink-0" },
        el("button", { class: "text-xs px-3 py-1.5 rounded-lg bg-neutral-900 text-white", onclick: () => speak(p.pattern) }, "🔊"),
        shadowButton(p.pattern, `句型 #${p.id}`)
      )
    ),
    el("div", { class: "space-y-2 pt-3 border-t border-neutral-100" },
      el("div", { class: "text-xs font-semibold text-neutral-500" }, "真实场景例句（4 个变体）"),
      ...p.examples.map((e, i) => el("div", { class: "group" },
        el("div", { class: "flex items-start gap-2" },
          el("span", { class: "text-xs text-neutral-400 mt-1" }, `${i + 1}.`),
          el("div", { class: "flex-1" },
            el("div", { class: "text-sm text-neutral-800" }, speakableText(e.en, speak)),
            el("div", { class: "text-xs text-neutral-500" }, e.zh)
          ),
          el("button", { class: "text-xs text-neutral-400 hover:text-neutral-900 opacity-0 group-hover:opacity-100", onclick: () => speak(e.en) }, "🔊")
        )
      ))
    ),
    el("div", { class: "flex items-center justify-between pt-3 border-t border-neutral-100" },
      el("label", { class: "flex items-center gap-2 text-sm text-neutral-600 cursor-pointer" },
        el("input", {
          type: "checkbox",
          checked: learned,
          onchange: (e) => {
            if (e.target.checked) { markPhrase(p.id); srsRecord("phrase", p.id, 4); }
            else unmarkPhrase(p.id);
            window.refreshHero?.();
            onToggle && onToggle();
          }
        }),
        "已掌握这个句型"
      ),
      el("button", {
        class: "text-xs text-indigo-600 hover:text-indigo-800",
        onclick: async () => {
          await speak(p.pattern);
          for (let i = 0; i < p.examples.length; i++) {
            await new Promise(r => setTimeout(r, 1500));
            await speak(p.examples[i].en);
          }
        }
      }, "▶ 全部连播")
    )
  );
}

export function renderPhrases() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  let activeCat = "All";
  let filter = "all";
  const list = el("div", { class: "space-y-4" });

  function redraw() {
    list.innerHTML = "";
    const state = getState();
    const items = PHRASES.filter(p => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (filter === "learned" && !state.learnedPhrases.includes(p.id)) return false;
      if (filter === "unlearned" && state.learnedPhrases.includes(p.id)) return false;
      return true;
    });
    if (!items.length) list.appendChild(el("div", { class: "text-neutral-400 text-center py-12" }, "没有匹配项"));
    items.forEach(p => list.appendChild(phraseCard(p, { onToggle: redraw })));
  }

  const catBtns = el("div", { class: "flex gap-2 flex-wrap" },
    ...["All", ...PHRASE_CATEGORIES].map(cat => el("button", {
      class: "text-xs px-3 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100",
      onclick: (e) => {
        activeCat = cat;
        [...catBtns.children].forEach(b => b.className = "text-xs px-3 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100");
        e.target.className = "text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white";
        redraw();
      }
    }, cat))
  );
  catBtns.firstChild.className = "text-xs px-3 py-1.5 rounded-full bg-neutral-900 text-white";

  root.appendChild(el("div", { class: "space-y-4" },
    el("div", {},
      el("h2", { class: "text-2xl font-bold" }, "BD 句型库"),
      el("p", { class: "text-sm text-neutral-500 mt-1" }, "30 个万能句型，覆盖 80% BD 对话。每个句型带 4 个真实 Web3 场景例句")
    ),
    catBtns,
    el("div", { class: "flex gap-2" },
      ...[["all", "全部"], ["unlearned", "未掌握"], ["learned", "已掌握"]].map(([k, label]) => el("button", {
        class: "text-xs px-3 py-1 rounded-md text-neutral-600 hover:text-neutral-900",
        onclick: (e) => {
          filter = k;
          e.target.parentNode.querySelectorAll("button").forEach(b => b.className = "text-xs px-3 py-1 rounded-md text-neutral-600 hover:text-neutral-900");
          e.target.className = "text-xs px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold";
          redraw();
        }
      }, label))
    ),
    list
  ));
  redraw();
}
