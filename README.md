# Web3 商务英语学习 App

Eason 的 Web3 方向商务英语练习工具。纯静态网页 + localStorage + Gemini API。

## 功能

- **每日三步走**：SRS 优先到期复习的 2 句型 + 1 场景 + 3 词块
- **句型库**：30 个 BD 万能句型 × 4 真实 Web3 例句
- **场景对练**：40 个 BD 情境（基础 + 业务），L1 跟读 → L2 填空 → L3 Gemini 批改
- **发音训练**：8 大发音坑，Gemini 多模态 AI 纠错（得分 + 逐词音标对比）
- **实战素材**：SocialData 抓高热门 Twitter + Reddit，按你学过的内容推荐
- **错题本**：所有 AI 纠错/批改自动入库，可导出 Markdown
- **PWA**：手机 Safari「添加到主屏幕」即装机

## 本地运行

```bash
cd /Users/maohaibo/biancheng/english-app
python3 -m http.server 8000
```

浏览器打开 http://localhost:8000

本地预填 Key：复制 `js/config.local.example.js` 为 `js/config.local.js` 填入 Gemini / SocialData Key（该文件被 `.gitignore` 排除，不会推到仓库）。

## 部署到 GitHub Pages

```bash
cd /Users/maohaibo/biancheng/english-app
git init && git branch -M main
git add . && git commit -m "init"
gh repo create english-app --public --source=. --push
# 然后：Settings → Pages → Source: main / root
```

访问 `https://<github用户名>.github.io/english-app/`。首次打开去设置页填 Gemini 和 SocialData Key（存 localStorage）。

## 技术栈

- HTML + Tailwind CDN + vanilla JS ES modules（零构建）
- Gemini 2.0 Flash（批改/查词/任务生成）+ Gemini 2.5 Flash Preview TTS（带情感朗读）
- Gemini 多模态（音频输入 → 发音评分）
- Web Speech API（MediaRecorder 录音，浏览器 TTS 兜底）
- SocialData.tools API（Twitter 搜索）+ Reddit 公开 JSON
- localStorage（进度 / 错题 / SRS / 设置）

## 数据文件

- `js/data/chunks.js` — 50 个 Web3 词块
- `js/data/phrases.js` — 30 个 BD 句型
- `js/data/scenarios.js` — 40 个场景剧本
- `js/data/phonetics.js` — 8 个发音坑
