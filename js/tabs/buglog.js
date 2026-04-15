import { el, toast } from "../ui.js";
import { getState } from "../storage.js";

function bugsToMarkdown(bugs) {
  const lines = ["# Language Bug Log", "", `导出时间：${new Date().toISOString()}`, ""];
  for (const b of bugs) {
    const d = new Date(b.ts).toISOString().slice(0, 10);
    lines.push(`## ${d} · ${b.context || "练习"}`);
    lines.push("");
    lines.push(`**原句**：${b.original}`);
    lines.push("");
    lines.push(`**修正**：${b.corrected}`);
    if (b.issues?.length) {
      lines.push("");
      lines.push("**问题**：");
      for (const i of b.issues) lines.push(`- [${i.type}] \`${i.quote}\` — ${i.why}`);
    }
    if (b.alternatives?.length) {
      lines.push("");
      lines.push("**替代表达**：");
      for (const a of b.alternatives) lines.push(`- ${a}`);
    }
    lines.push("", "---", "");
  }
  return lines.join("\n");
}

export function renderBugLog() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";
  const bugs = getState().bugs || [];

  root.appendChild(el("div", { class: "space-y-4" },
    el("div", { class: "flex items-center justify-between" },
      el("div", {},
        el("h2", { class: "text-2xl font-bold" }, "错题本"),
        el("p", { class: "text-sm text-neutral-500" }, `共 ${bugs.length} 条`)
      ),
      el("div", { class: "flex gap-2" },
        el("button", {
          class: "text-sm px-3 py-2 rounded-lg bg-neutral-900 text-white",
          disabled: !bugs.length,
          onclick: () => {
            navigator.clipboard.writeText(bugsToMarkdown(bugs)).then(() => toast("Markdown 已复制，粘回 Obsidian", "success"));
          }
        }, "复制 Markdown")
      )
    ),
    !bugs.length
      ? el("div", { class: "text-center py-16 text-neutral-400" }, "空。去「实战素材」或「每日」写一段英文被批改后，会自动入库。")
      : el("div", { class: "space-y-3" },
          ...bugs.map(b => el("div", { class: "p-4 rounded-2xl bg-white border border-neutral-200 space-y-2" },
            el("div", { class: "flex items-center justify-between text-xs text-neutral-500" },
              el("span", {}, b.context || "练习"),
              el("span", {}, new Date(b.ts).toLocaleString())
            ),
            el("div", { class: "text-sm" },
              el("span", { class: "text-neutral-500" }, "原句："),
              el("span", { class: "text-neutral-800" }, b.original)
            ),
            el("div", { class: "text-sm" },
              el("span", { class: "text-emerald-600 font-medium" }, "修正："),
              el("span", { class: "text-neutral-900" }, b.corrected)
            ),
            b.issues?.length ? el("ul", { class: "text-xs text-neutral-600 space-y-1 pl-4 list-disc" },
              ...b.issues.map(i => el("li", {}, `[${i.type}] ${i.quote} — ${i.why}`))
            ) : null
          ))
        )
  ));
}
