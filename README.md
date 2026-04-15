# Web3 商务英语学习 App

Eason 的 Web3 方向商务英语练习工具。纯静态网页 + localStorage + Gemini API + Cloudflare Worker 跨设备同步。

**在线版本**：https://seamao.github.io/english-app/

## 功能

- **每日三步走**：SRS 优先到期复习的 2 句型 + 1 场景 + 3 词块
- **句型库**：30 个 BD 万能句型 × 4 真实 Web3 例句
- **场景对练**：40 个 BD 情境（基础 + 业务），L1 跟读 → L2 填空 → L3 Gemini 批改
- **发音训练**：8 大发音坑，Gemini 多模态 AI 纠错（得分 + 逐词音标对比）
- **实战素材**：SocialData 抓高热门 Twitter + Reddit，按你学过的内容推荐
- **错题本**：所有 AI 纠错/批改自动入库，可导出 Markdown
- **跨设备同步**：Cloudflare Worker + KV，多台设备进度/错题/SRS 实时同步
- **PWA**：手机 Safari「添加到主屏幕」即装机

---

## 快速开始（给朋友：直接用）

1. 打开 https://seamao.github.io/english-app/
2. 进「设置」→ 填 Gemini API Key（[aistudio.google.com](https://aistudio.google.com) 免费申请）
3. 想用实战素材：再填 SocialData Key（可选）
4. 开始学！数据存你自己浏览器，跟作者无关。

**不需要**任何账号、安装、命令行。

---

## 跨设备同步（可选）

如果你想在手机 + 电脑之间同步进度，**需要自己部署一个 Cloudflare Worker**（免费，3 行命令），见下方「部署 Cloudflare Worker」。

部署完后，在「设置」页填自己的 Worker URL → 点「生成 Key」→ 在另一台设备粘同一个 Key 即可。

不需要跨设备同步的话跳过，其他功能不受影响。

---

## 本地开发

```bash
git clone https://github.com/seamao/english-app.git
cd english-app
python3 -m http.server 8000
```

浏览器打开 http://localhost:8000

**本地预填 Key**（免去每次手填）：
```bash
cp js/config.local.example.js js/config.local.js
# 编辑 js/config.local.js，填你的 Gemini / SocialData Key
```

`js/config.local.js` 已在 `.gitignore`，不会被推到仓库。

---

## 部署到 GitHub Pages

```bash
cd english-app
git init && git branch -M main
git add . && git commit -m "init"
gh repo create english-app --public --source=. --push
gh api -X POST repos/<你的用户名>/english-app/pages --input - <<'JSON'
{"source":{"branch":"main","path":"/"}}
JSON
```

1-2 分钟后访问 `https://<你的用户名>.github.io/english-app/`。

---

## 部署 Cloudflare Worker（自用同步后端）

**前置**：Cloudflare 账号（免费）+ 本机 Node.js。

```bash
# 1. 装 wrangler
npm i -g wrangler
wrangler login   # 浏览器授权

# 2. 创建 KV namespace（存用户数据）
cd worker
wrangler kv namespace create SYNC
# 输出会给你一行 id = "xxxx..."，把它填到 wrangler.toml 里

# 3. 部署
wrangler deploy
# 得到 URL：https://web3en-sync.<你的子域>.workers.dev

# 4. 设置白名单（可选但强烈推荐，防止别人刷你的 KV 额度）
# 先在 App 设置页点「生成 Key」拿到 Device Key，然后：
wrangler secret put ALLOWED_KEY
# 粘贴你的 Device Key，回车。之后 Worker 只接受这一个 Key 的请求
```

在 App 设置页「Worker URL」填这个地址即可。

**成本**：Cloudflare Workers 免费额度 **10 万请求/天**，KV 免费 **1GB 存储 + 10 万读 + 1000 写/天**。一个人日常用连 1% 都打不到，3-5 个朋友共用也不会超。

---

## 技术栈

- HTML + Tailwind CDN + vanilla JS ES modules（零构建）
- Gemini 2.0 Flash（批改/查词/任务生成）+ Gemini 2.5 Flash Preview TTS（带情感朗读）
- Gemini 多模态（音频输入 → 发音评分）
- Web Speech API（MediaRecorder 录音，浏览器 TTS 兜底）
- SocialData.tools API（Twitter 搜索）+ Reddit 公开 JSON
- localStorage（进度 / 错题 / SRS / 设置）
- Cloudflare Workers + KV（跨设备同步后端，可选）

## 数据文件

- `js/data/chunks.js` — 50 个 Web3 词块
- `js/data/phrases.js` — 30 个 BD 句型
- `js/data/scenarios.js` — 40 个场景剧本
- `js/data/phonetics.js` — 8 个发音坑

## 安全 & 隐私

- API Key 只存你自己的浏览器 `localStorage`，不上传作者服务器
- 跨设备同步走你配置的 Worker，**作者看不到数据**（除非你用作者的 Worker URL —— 这种情况理论上作者能从 Cloudflare KV 读到，只是不会去看）
- Device Key 24 字节随机，不可暴力破解；别公开分享即可
- 完全开源，所有网络请求可审（`js/ai.js`、`js/sync.js`、`js/feed/*.js`）

## License

MIT
