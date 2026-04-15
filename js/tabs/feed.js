import { el, spinner, toast, speakableText } from "../ui.js";
import { getState, getSetting, addBug, bumpStat } from "../storage.js";
import { fetchReddit, DEFAULT_SUBREDDITS } from "../feed/reddit.js";
import { searchTweets, DEFAULT_QUERIES, buildPersonalQueries } from "../feed/socialdata.js";
import { CHUNKS } from "../data/chunks.js";
import { PHRASES } from "../data/phrases.js";
import { generateTasksFromContent, reviewWriting } from "../ai.js";
import { speak } from "../speech.js";

let cached = { items: [], source: null, shown: 0 };
const PAGE = 3;

function itemCard(item, onPick) {
  const text = (item.title ? item.title + "\n\n" : "") + (item.text || "");
  const preview = text.slice(0, 260) + (text.length > 260 ? "..." : "");
  return el("div", { class: "p-4 rounded-2xl bg-white border border-neutral-200 hover:border-indigo-300 cursor-pointer transition", onclick: () => onPick(item) },
    el("div", { class: "flex items-center gap-2 text-xs text-neutral-500 mb-2" },
      el("span", { class: "px-2 py-0.5 rounded-full bg-neutral-100" }, item.source === "reddit" ? `r/${item.subreddit}` : `@${item.author}`),
      el("span", {}, new Date(item.ts).toLocaleDateString()),
      item.score != null ? el("span", {}, `👍 ${item.score}`) : null,
      item.views ? el("span", {}, `👀 ${item.views}`) : null
    ),
    el("div", { class: "text-sm text-neutral-800 whitespace-pre-wrap" }, preview)
  );
}

async function openTaskView(item) {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  const back = el("button", {
    class: "text-sm text-neutral-600 hover:text-neutral-900 mb-4",
    onclick: () => renderFeed()
  }, "← 返回");

  const container = el("div", { class: "space-y-4" });
  root.appendChild(el("div", {}, back, container));

  const text = (item.title ? item.title + "\n\n" : "") + (item.text || "");

  container.appendChild(el("div", { class: "p-5 rounded-2xl bg-white border border-neutral-200 space-y-3" },
    el("div", { class: "flex items-center justify-between" },
      el("div", { class: "text-xs text-neutral-500" }, item.source === "reddit" ? `r/${item.subreddit} · u/${item.author}` : `@${item.author}`),
      el("a", { href: item.url, target: "_blank", class: "text-xs text-indigo-600 hover:underline" }, "原文 ↗")
    ),
    el("div", { class: "text-sm text-neutral-900 whitespace-pre-wrap leading-relaxed" }, speakableText(text, speak)),
    el("div", { class: "flex gap-2 pt-2 border-t border-neutral-100" },
      el("button", { class: "text-xs px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200", onclick: () => speak(text.slice(0, 400)) }, "🔊 朗读")
    )
  ));

  const taskSlot = el("div", {});
  container.appendChild(taskSlot);
  taskSlot.appendChild(spinner("Gemini 正在为你生成练习任务..."));

  try {
    const ai = await generateTasksFromContent(text, item.source === "reddit" ? `Reddit r/${item.subreddit}` : `Twitter @${item.author}`);
    taskSlot.innerHTML = "";

    taskSlot.appendChild(el("div", { class: "p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-900 space-y-2" },
      el("div", { class: "font-semibold" }, "📌 中文概括"),
      el("div", {}, ai.summary_zh),
      ai.key_chunks?.length ? el("div", { class: "pt-2 border-t border-indigo-200" },
        el("div", { class: "font-semibold mb-1" }, "🔑 关键词块"),
        el("ul", { class: "space-y-1 text-xs" },
          ...ai.key_chunks.map(k => el("li", {},
            el("span", { class: "font-mono font-semibold" }, k.en),
            " · ",
            el("span", { class: "text-indigo-700" }, k.zh)
          ))
        )
      ) : null
    ));

    (ai.tasks || []).forEach((t, idx) => {
      const writeArea = el("textarea", {
        rows: "4",
        placeholder: "用英文写在这里...",
        class: "w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      });
      const resultSlot = el("div", {});
      const submitBtn = el("button", {
        class: "text-sm px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700",
        onclick: async () => {
          const val = writeArea.value.trim();
          if (!val) return toast("先写点东西");
          submitBtn.disabled = true;
          submitBtn.textContent = "批改中...";
          resultSlot.innerHTML = "";
          resultSlot.appendChild(spinner("Gemini 正在批改..."));
          try {
            const r = await reviewWriting(val, t.prompt);
            resultSlot.innerHTML = "";
            resultSlot.appendChild(renderReview(r));
            bumpStat("tasks");
            bumpStat("reviews");
            window.refreshHero?.();
            if (r.issues?.length) {
              addBug({ ...r, context: t.prompt });
              toast(`+1 实战练习 · ${r.issues.length} 条错题已记`, "success");
            } else {
              toast("+1 实战练习 · 满分！", "success");
            }
          } catch (e) {
            resultSlot.innerHTML = "";
            resultSlot.appendChild(el("div", { class: "text-sm text-red-600 p-3 bg-red-50 rounded-lg" }, e.message));
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "提交批改";
          }
        }
      }, "提交批改");

      taskSlot.appendChild(el("div", { class: "p-4 rounded-2xl bg-white border border-neutral-200 space-y-3" },
        el("div", { class: "flex items-center gap-2" },
          el("span", { class: `text-xs px-2 py-0.5 rounded-full ${["bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"][idx]}` }, t.level),
          el("span", { class: "text-sm text-neutral-700" }, t.prompt)
        ),
        t.sample_hint ? el("div", { class: "text-xs text-neutral-500" },
          "💡 可参考：",
          Array.isArray(t.sample_hint) ? t.sample_hint.join(" / ") : t.sample_hint
        ) : null,
        writeArea,
        submitBtn,
        resultSlot
      ));
    });
  } catch (e) {
    taskSlot.innerHTML = "";
    taskSlot.appendChild(el("div", { class: "text-sm text-red-600 p-3 bg-red-50 rounded-lg" }, e.message));
  }
}

function renderReview(r) {
  return el("div", { class: "space-y-3 pt-3 border-t border-neutral-100" },
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
          el("span", { class: "font-mono" }, i.quote),
          " — ",
          i.why
        ))
      )
    ) : null,
    r.alternatives?.length ? el("div", { class: "text-sm" },
      el("div", { class: "text-neutral-500 text-xs mb-1" }, "替代表达"),
      el("ul", { class: "space-y-1 text-xs pl-4 list-disc text-neutral-700" },
        ...r.alternatives.map(a => el("li", {}, a))
      )
    ) : null
  );
}

export function renderFeed() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  const listSlot = el("div", { class: "space-y-3" });
  const subs = (getSetting("subreddits") || DEFAULT_SUBREDDITS.join(",")).split(",").map(s => s.trim()).filter(Boolean);
  const hasSocialData = !!getSetting("socialDataKey");

  function renderList() {
    listSlot.innerHTML = "";
    const items = cached.items;
    if (!items.length) {
      listSlot.appendChild(el("div", { class: "text-neutral-400 py-8 text-center text-sm" }, "无内容"));
      return;
    }
    items.slice(0, cached.shown).forEach(i => listSlot.appendChild(itemCard(i, openTaskView)));
    if (cached.shown < items.length) {
      listSlot.appendChild(el("button", {
        class: "w-full text-sm py-3 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
        onclick: () => { cached.shown = Math.min(cached.shown + PAGE, items.length); renderList(); }
      }, `加载更多（还有 ${items.length - cached.shown} 条）`));
    } else {
      listSlot.appendChild(el("div", { class: "text-xs text-neutral-400 py-2 text-center" }, `已显示全部 ${items.length} 条高热门内容`));
    }
  }

  async function loadReddit(sub) {
    listSlot.innerHTML = "";
    listSlot.appendChild(spinner(`拉取 r/${sub} 热帖...`));
    try {
      const items = await fetchReddit(sub, { limit: 30 });
      const filtered = items.filter(i => (i.score || 0) >= 200).sort((a, b) => (b.score || 0) - (a.score || 0));
      cached = { items: filtered, source: `r/${sub}`, shown: Math.min(PAGE, filtered.length) };
      renderList();
    } catch (e) {
      listSlot.innerHTML = "";
      listSlot.appendChild(el("div", { class: "text-sm text-red-600 p-3 bg-red-50 rounded-lg" }, `拉取失败: ${e.message}`));
    }
  }

  async function loadTwitter(q) {
    listSlot.innerHTML = "";
    listSlot.appendChild(spinner(`SocialData 搜索「${q.label}」...`));
    try {
      const items = await searchTweets(q.query, { type: "Top", limit: 30 });
      cached = { items, source: q.label, shown: Math.min(PAGE, items.length) };
      renderList();
    } catch (e) {
      listSlot.innerHTML = "";
      listSlot.appendChild(el("div", { class: "text-sm text-red-600 p-3 bg-red-50 rounded-lg" }, `拉取失败: ${e.message}`));
    }
  }

  const subButtons = el("div", { class: "flex gap-2 flex-wrap" },
    ...subs.map(s => el("button", {
      class: "text-xs px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100",
      onclick: () => loadReddit(s)
    }, `r/${s}`))
  );

  const personalQueries = buildPersonalQueries(getState(), CHUNKS, PHRASES);

  const personalButtons = hasSocialData && personalQueries.length ? el("div", { class: "flex gap-2 flex-wrap" },
    ...personalQueries.map(q => el("button", {
      class: "text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-medium",
      onclick: () => loadTwitter(q)
    }, q.label))
  ) : null;

  const tweetButtons = hasSocialData ? el("div", { class: "flex gap-2 flex-wrap" },
    ...DEFAULT_QUERIES.map(q => el("button", {
      class: "text-xs px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100",
      onclick: () => loadTwitter(q)
    }, `🐦 ${q.label}`))
  ) : el("div", { class: "text-xs text-neutral-400 p-3 bg-neutral-100 rounded-lg" },
    "未配置 SocialData Key。可在「设置」填入后解锁 Twitter 热点抓取，或现在只用 Reddit。"
  );

  root.appendChild(el("div", { class: "space-y-4" },
    el("div", {},
      el("h2", { class: "text-2xl font-bold" }, "实战素材"),
      el("p", { class: "text-sm text-neutral-500 mt-1" }, "选一个主题，从 Reddit / Twitter 抓当日真实内容，Gemini 生成 3 档练习任务")
    ),
    personalButtons ? el("section", { class: "space-y-2" },
      el("div", { class: "text-xs font-semibold text-emerald-700 uppercase" }, "🎯 为你推荐（基于你学过的内容）"),
      personalButtons
    ) : el("div", { class: "p-3 rounded-lg bg-neutral-50 text-xs text-neutral-500" },
      "💡 去「词块库」或「句型库」勾几个「已掌握」，这里会自动推荐相关的真实推文给你练。"
    ),
    el("section", { class: "space-y-2" },
      el("div", { class: "text-xs font-semibold text-sky-700 uppercase" }, "🐦 Twitter 通用热搜"),
      tweetButtons
    ),
    el("section", { class: "space-y-2 pt-2" },
      el("div", { class: "text-xs font-semibold text-neutral-500 uppercase" }, "Reddit 热帖（辅）"),
      subButtons
    ),
    listSlot
  ));

  if (cached.items.length) {
    renderList();
  } else if (hasSocialData && personalQueries[0]) {
    loadTwitter(personalQueries[0]);
  } else if (hasSocialData && DEFAULT_QUERIES[0]) {
    loadTwitter(DEFAULT_QUERIES[0]);
  } else if (subs[0]) {
    loadReddit(subs[0]);
  }
}
