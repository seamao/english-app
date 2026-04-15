import { getSetting } from "../storage.js";

const BASE = "https://api.socialdata.tools";
const PROXIES = [
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => url
];

function authHeaders() {
  let key = getSetting("socialDataKey");
  if (!key) throw new Error("请在「设置」里填入 SocialData API Key");
  key = String(key).trim().replace(/[^\x00-\x7F]/g, "");
  if (!key) throw new Error("SocialData Key 里含非 ASCII 字符，已被过滤。请到「设置」重新填一遍纯英文/数字 Key。");
  return { "Authorization": `Bearer ${key}`, "Accept": "application/json" };
}

async function fetchJSON(url) {
  const headers = authHeaders();
  let lastErr;
  for (const build of PROXIES) {
    try {
      const res = await fetch(build(url), { headers });
      if (res.ok) return res.json();
      lastErr = new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("fetch failed");
}

export async function searchTweets(query, { type = "Top", limit = 30 } = {}) {
  const url = `${BASE}/twitter/search?query=${encodeURIComponent(query)}&type=${type}`;
  const data = await fetchJSON(url);
  const tweets = data?.tweets || [];
  return tweets
    .sort((a, b) => (b.favorite_count || 0) - (a.favorite_count || 0))
    .slice(0, limit)
    .map(t => ({
    id: t.id_str || t.id,
    source: "twitter",
    author: t.user?.screen_name,
    authorName: t.user?.name,
    title: "",
    text: t.full_text || t.text || "",
    url: `https://x.com/${t.user?.screen_name}/status/${t.id_str || t.id}`,
    score: t.favorite_count,
    comments: t.reply_count,
    views: t.view_count,
    ts: t.tweet_created_at ? new Date(t.tweet_created_at).getTime() : Date.now()
  }));
}

export function buildPersonalQueries(state, chunks, phrases) {
  const learnedChunks = chunks.filter(c => state.learned.includes(c.id));
  const byCat = {};
  learnedChunks.forEach(c => { (byCat[c.category] = byCat[c.category] || []).push(c); });

  const CAT_MAP = {
    Token: "Token 话题", Fundraise: "融资话题", Exchange: "Listing 话题",
    Product: "产品/技术", BD: "BD 合作"
  };

  const queries = [];
  for (const [cat, items] of Object.entries(byCat)) {
    const terms = items.slice(0, 5).map(c => `"${c.en}"`).join(" OR ");
    if (!terms) continue;
    queries.push({
      label: `🎯 ${CAT_MAP[cat] || cat}（${items.length} 个学过的词）`,
      query: `(${terms}) lang:en min_faves:200 -filter:replies`,
      personal: true
    });
  }

  const learnedPhrases = phrases.filter(p => state.learnedPhrases.includes(p.id));
  if (learnedPhrases.length) {
    const phraseTerms = learnedPhrases.slice(0, 4).map(p => {
      const core = p.pattern.split("[")[0].trim().replace(/[^\x20-\x7E]/g, "");
      return core && core.length > 3 ? `"${core}"` : null;
    }).filter(Boolean).join(" OR ");
    if (phraseTerms) queries.push({
      label: `🎯 用到你学过的句型`,
      query: `(${phraseTerms}) lang:en min_faves:200 -filter:replies`,
      personal: true
    });
  }
  return queries;
}

export const DEFAULT_QUERIES = [
  { label: "Listing 动态", query: '("listed on" OR "listing on" OR "now live on") (Binance OR OKX OR Coinbase OR Bybit) -filter:replies lang:en min_faves:500' },
  { label: "项目融资", query: '("raised" OR "seed round" OR "series A" OR "strategic round") (million OR $) crypto -filter:replies lang:en min_faves:500' },
  { label: "Token 解锁", query: '("token unlock" OR "vesting" OR "cliff") -filter:replies lang:en min_faves:300' },
  { label: "L2 / Rollup", query: '("rollup" OR "L2" OR "layer 2") (launch OR mainnet OR testnet) -filter:replies lang:en min_faves:500' },
  { label: "BD / 合作", query: '("partnership with" OR "integrating with" OR "collaborating with") (protocol OR exchange OR chain) -filter:replies lang:en min_faves:500' }
];
