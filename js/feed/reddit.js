const PROXIES = [
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => url
];

async function fetchJSON(url) {
  let lastErr;
  for (const build of PROXIES) {
    try {
      const res = await fetch(build(url), { headers: { "Accept": "application/json" } });
      if (res.ok) return res.json();
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("fetch failed");
}

export async function fetchReddit(subreddit, { limit = 10, sort = "hot" } = {}) {
  const url = `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}&raw_json=1`;
  const data = await fetchJSON(url);
  const children = data?.data?.children || [];
  return children
    .map(c => c.data)
    .filter(p => !p.stickied && (p.selftext || p.title))
    .map(p => ({
      id: p.id,
      source: "reddit",
      subreddit: p.subreddit,
      author: p.author,
      title: p.title,
      text: p.selftext?.trim() || "",
      url: `https://reddit.com${p.permalink}`,
      score: p.score,
      comments: p.num_comments,
      ts: p.created_utc * 1000
    }));
}

export const DEFAULT_SUBREDDITS = [
  "CryptoCurrency",
  "ethereum",
  "defi",
  "ethfinance",
  "CryptoMarkets"
];
