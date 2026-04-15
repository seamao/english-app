import { el, toast } from "../ui.js";
import { getSetting, setSetting, getState } from "../storage.js";
import { GEMINI_VOICES, GEMINI_STYLES } from "../ai.js";
import { speak } from "../speech.js";
import { generateDeviceKey, pullOnce, pushOnce } from "../sync.js";

export function renderSettings() {
  const root = document.getElementById("tab-content");
  root.innerHTML = "";

  function field(label, key, placeholder, { help = "" } = {}) {
    return el("div", { class: "space-y-1" },
      el("label", { class: "block text-sm font-medium text-neutral-700" }, label),
      el("input", {
        type: "password",
        placeholder,
        value: getSetting(key) || "",
        class: "w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm",
        onblur: (e) => { setSetting(key, e.target.value.trim()); toast("已保存", "success"); }
      }),
      help ? el("p", { class: "text-xs text-neutral-500" }, help) : null
    );
  }

  function subField() {
    const current = getSetting("subreddits") || "CryptoCurrency,ethereum,defi";
    return el("div", { class: "space-y-1" },
      el("label", { class: "block text-sm font-medium text-neutral-700" }, "订阅 Subreddit（逗号分隔）"),
      el("input", {
        type: "text",
        value: current,
        placeholder: "CryptoCurrency,ethereum,defi",
        class: "w-full px-3 py-2 rounded-lg border border-neutral-300 font-mono text-sm",
        onblur: (e) => { setSetting("subreddits", e.target.value.trim()); toast("已保存", "success"); }
      })
    );
  }

  function exportAll() {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
    const a = el("a", { href: URL.createObjectURL(blob), download: `web3en-${new Date().toISOString().slice(0,10)}.json` });
    a.click();
  }

  function clearAll() {
    if (!confirm("确定清空所有本地数据？（进度、错题本、设置都会删除）")) return;
    localStorage.removeItem("web3en.v1");
    toast("已清空，刷新页面", "success");
  }

  root.appendChild(el("div", { class: "space-y-6 max-w-xl" },
    el("h2", { class: "text-2xl font-bold" }, "设置"),

    el("section", { class: "space-y-4 p-5 bg-white rounded-2xl border border-neutral-200" },
      el("h3", { class: "font-semibold" }, "AI 批改"),
      field("Gemini API Key", "geminiKey", "AIza...", {
        help: "在 https://aistudio.google.com 申请免费 Key。存于本机 localStorage，不上传。"
      })
    ),

    el("section", { class: "space-y-4 p-5 bg-white rounded-2xl border border-neutral-200" },
      el("h3", { class: "font-semibold" }, "语音朗读 TTS"),
      el("div", { class: "space-y-1" },
        el("label", { class: "block text-sm font-medium text-neutral-700" }, "引擎"),
        el("select", {
          class: "w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white",
          onchange: (e) => { setSetting("ttsEngine", e.target.value); toast("已保存", "success"); }
        },
          ...[
            ["browser", "浏览器自带（免费 · 机械感）"],
            ["gemini", "Gemini 2.5 TTS（有感情 · 消耗 Gemini 配额）"]
          ].map(([v, l]) => {
            const o = el("option", { value: v }, l);
            if ((getSetting("ttsEngine") || "browser") === v) o.selected = true;
            return o;
          })
        )
      ),
      el("div", { class: "space-y-1" },
        el("label", { class: "block text-sm font-medium text-neutral-700" }, "音色（仅 Gemini 生效）"),
        el("select", {
          class: "w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white",
          onchange: (e) => { setSetting("ttsVoice", e.target.value); toast("已保存", "success"); }
        },
          ...GEMINI_VOICES.map(v => {
            const o = el("option", { value: v.id }, v.label);
            if ((getSetting("ttsVoice") || "Kore") === v.id) o.selected = true;
            return o;
          })
        )
      ),
      el("div", { class: "space-y-1" },
        el("label", { class: "block text-sm font-medium text-neutral-700" }, "语气 / 情感"),
        el("select", {
          class: "w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white",
          onchange: (e) => { setSetting("ttsStyle", e.target.value); toast("已保存", "success"); }
        },
          ...GEMINI_STYLES.map(s => {
            const o = el("option", { value: s.id }, s.label);
            if ((getSetting("ttsStyle") || "neutral") === s.id) o.selected = true;
            return o;
          })
        )
      ),
      el("div", { class: "space-y-1" },
        el("label", { class: "block text-sm font-medium text-neutral-700" }, "语速"),
        el("select", {
          class: "w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm bg-white",
          onchange: (e) => { setSetting("ttsSpeed", parseFloat(e.target.value)); toast("已保存", "success"); }
        },
          ...[
            [0.5, "0.5×（很慢 · 音标精听）"],
            [0.75, "0.75×（慢 · 跟读）"],
            [0.9, "0.9×（略慢）"],
            [1.0, "1.0×（正常）"],
            [1.15, "1.15×（略快）"],
            [1.3, "1.3×（快 · 听力挑战）"],
            [1.5, "1.5×（很快）"]
          ].map(([v, l]) => {
            const o = el("option", { value: String(v) }, l);
            if ((getSetting("ttsSpeed") ?? 1.0) == v) o.selected = true;
            return o;
          })
        )
      ),
      el("button", {
        class: "text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700",
        onclick: async () => {
          try { await speak("We closed a 10 million strategic round led by Paradigm. Mainnet launch is scheduled for June tenth."); }
          catch (e) { toast(e.message, "error"); }
        }
      }, "🔊 试听当前设置")
    ),

    el("section", { class: "space-y-4 p-5 bg-white rounded-2xl border border-neutral-200" },
      el("h3", { class: "font-semibold" }, "实战素材"),
      field("SocialData API Key", "socialDataKey", "可选 · 用于抓 Twitter 热点", {
        help: "没有 Key 时只用 Reddit 作为素材源。https://socialdata.tools"
      }),
      subField()
    ),

    el("section", { class: "space-y-3 p-5 bg-white rounded-2xl border border-neutral-200" },
      el("h3", { class: "font-semibold" }, "跨设备同步（Cloudflare Worker）"),
      el("p", { class: "text-xs text-neutral-500" }, "两个设备填相同的 Worker URL + Device Key，进度自动同步。第一次在任一设备点「生成 Key」，然后在另一设备粘同一个 Key。"),
      field("Worker URL", "syncUrl", "https://web3en-sync.xxx.workers.dev", { help: "部署后得到的地址，无 /sync 路径" }),
      el("div", { class: "space-y-1" },
        el("label", { class: "block text-sm font-medium text-neutral-700" }, "Device Key（多设备共享这一串）"),
        el("div", { class: "flex gap-2" },
          (() => {
            const inp = el("input", {
              type: "text",
              value: getSetting("syncKey") || "",
              class: "flex-1 px-3 py-2 rounded-lg border border-neutral-300 font-mono text-xs",
              onblur: (e) => { setSetting("syncKey", e.target.value.trim()); toast("已保存", "success"); }
            });
            return inp;
          })(),
          el("button", {
            class: "text-xs px-3 py-2 rounded-lg bg-neutral-900 text-white",
            onclick: (e) => {
              const k = generateDeviceKey();
              setSetting("syncKey", k);
              e.target.parentNode.querySelector("input").value = k;
              toast("已生成 Key，复制到其他设备使用", "success");
            }
          }, "生成 Key")
        )
      ),
      el("div", { class: "flex gap-2 pt-2" },
        el("button", {
          class: "text-sm px-4 py-2 rounded-lg bg-emerald-600 text-white",
          onclick: async () => {
            const r = await pushOnce({ silent: false }).catch(e => ({ ok: false, reason: e.message }));
            toast(r.ok ? "☁️ 已上传到云端" : `失败: ${r.reason}`, r.ok ? "success" : "error");
          }
        }, "⬆️ 立即上传"),
        el("button", {
          class: "text-sm px-4 py-2 rounded-lg bg-sky-600 text-white",
          onclick: async () => {
            if (!confirm("从云端拉取会覆盖本地更旧的数据，确定？")) return;
            const r = await pullOnce({ silent: false }).catch(e => ({ ok: false, reason: e.message }));
            if (r.ok && r.applied) { toast("☁️ 已从云端同步，刷新中...", "success"); setTimeout(() => location.reload(), 500); }
            else if (r.ok && r.empty) toast("云端还没有数据", "info");
            else if (r.ok) toast("本地已是最新", "success");
            else toast(`失败: ${r.reason}`, "error");
          }
        }, "⬇️ 立即下载")
      )
    ),

    el("section", { class: "space-y-3 p-5 bg-white rounded-2xl border border-neutral-200" },
      el("h3", { class: "font-semibold" }, "数据"),
      el("div", { class: "flex gap-2" },
        el("button", {
          class: "px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm",
          onclick: exportAll
        }, "导出 JSON 备份"),
        el("button", {
          class: "px-4 py-2 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200",
          onclick: clearAll
        }, "清空本地数据")
      )
    )
  ));
}
