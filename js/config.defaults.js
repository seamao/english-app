// 默认值（可提交到 repo）。真实 Key 从 localStorage 读（在设置页填）。
// 需要本地预设的话，复制一份为 config.local.js（被 .gitignore 排除）。
export const DEFAULTS = {
  geminiKey: "",
  socialDataKey: "",
  ttsEngine: "gemini",
  ttsVoice: "Kore",
  ttsStyle: "bd",
  subreddits: "CryptoCurrency,ethereum,defi,ethfinance"
};
