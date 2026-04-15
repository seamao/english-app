// 8 大发音坑：中国人学英语最容易混的音 + Web3 场景高频词
export const PHONETICS = [
  {
    id: "th_s",
    title: "/θ/ vs /s/ — think ≠ sink",
    difficulty: "★★★★★",
    howTo: "发 /θ/ 时舌尖轻轻咬上下齿之间，气流从舌齿间吹出；/s/ 舌尖贴上齿龈，不咬。",
    pairs: [["think", "sink"], ["three", "see"], ["thing", "sing"], ["thank", "sank"], ["thin", "sin"]],
    web3Words: ["think", "thousand", "both", "growth", "with", "throughput", "threshold"],
    sentence: "I think the throughput growth is worth a thousand words.",
    sentenceZh: "我觉得这个吞吐量增长胜过千言万语。"
  },
  {
    id: "th_voiced",
    title: "/ð/ vs /d/ — this ≠ dis",
    difficulty: "★★★★",
    howTo: "/ð/ 舌尖咬上下齿间，带声带震动（有声版 th）；/d/ 舌尖贴上齿龈。",
    pairs: [["this", "dis"], ["they", "day"], ["those", "doze"], ["then", "den"]],
    web3Words: ["this", "that", "they", "the", "them", "there", "weather", "whether"],
    sentence: "They said that this is the path they want to take.",
    sentenceZh: "他们说这是他们想走的路。"
  },
  {
    id: "v_w",
    title: "/v/ vs /w/ — very ≠ well",
    difficulty: "★★★★★",
    howTo: "/v/ 上齿咬下唇，声带震动；/w/ 双唇收圆向前突出，不咬唇。",
    pairs: [["vest", "west"], ["vine", "wine"], ["very", "wary"], ["veil", "whale"]],
    web3Words: ["vault", "value", "volatile", "vesting", "valuation", "volume", "visible"],
    sentence: "The vault's volatile value requires careful vesting.",
    sentenceZh: "金库价格波动大，需要谨慎的解锁安排。"
  },
  {
    id: "r_l",
    title: "/r/ vs /l/ — rally ≠ lady",
    difficulty: "★★★★",
    howTo: "/r/ 舌头后卷，不碰上颚；/l/ 舌尖抵住上齿龈。",
    pairs: [["rally", "lally"], ["right", "light"], ["road", "load"], ["lead", "read"]],
    web3Words: ["retail", "rally", "rollup", "restaking", "liquidity", "listing", "launch", "leverage"],
    sentence: "The rollup launch led to a rally in liquidity.",
    sentenceZh: "Rollup 上线带动了流动性的飙升。"
  },
  {
    id: "ae_e",
    title: "/æ/ vs /e/ — bad ≠ bed",
    difficulty: "★★★★",
    howTo: "/æ/ 嘴张大，舌位低（像要咧嘴笑）；/e/ 嘴型小，舌位中。",
    pairs: [["bad", "bed"], ["cat", "ket"], ["had", "head"], ["sad", "said"]],
    web3Words: ["asset", "cap", "bag", "map", "tap", "adapt", "address"],
    sentence: "The asset cap is mapped against the bag of addresses.",
    sentenceZh: "资产上限是按地址集合来映射的。"
  },
  {
    id: "i_ii",
    title: "/ɪ/ vs /iː/ — bit ≠ beat",
    difficulty: "★★★",
    howTo: "/ɪ/ 短促、放松；/iː/ 拉长、嘴角向两边拉。",
    pairs: [["bit", "beat"], ["ship", "sheep"], ["live", "leave"], ["fit", "feet"]],
    web3Words: ["bid", "listing", "fee", "deep", "lead", "seed", "bridge"],
    sentence: "The bid fee on the bridge is deeper than the seed round price.",
    sentenceZh: "跨链桥上的出价手续费比种子轮价格还深。"
  },
  {
    id: "sh_s",
    title: "/ʃ/ vs /s/ — cash ≠ cass",
    difficulty: "★★",
    howTo: "/ʃ/ 舌位后移，双唇收圆突出（像'嘘'）；/s/ 舌尖贴齿龈。",
    pairs: [["cash", "cass"], ["ship", "sip"], ["share", "sare"]],
    web3Words: ["cash", "share", "issuance", "ratio", "negotiation", "exchange"],
    sentence: "The cash share ratio affects the token issuance.",
    sentenceZh: "现金占比影响代币发行。"
  },
  {
    id: "endings",
    title: "词尾 /-d/ /-t/ /-s/ 不能吞",
    difficulty: "★★★★★",
    howTo: "中国人最容易漏词尾辅音。listed、priced、launched 一定要读出 -d/-t；tokens、rounds、pairs 一定要读出 -s/-z。",
    pairs: [["listed", "list"], ["priced", "price"], ["tokens", "token"], ["launched", "launch"]],
    web3Words: ["listed", "priced", "launched", "pumped", "airdropped", "tokens", "rounds", "pairs", "valuations"],
    sentence: "The tokens were listed, priced, and airdropped in three rounds.",
    sentenceZh: "代币分三轮上线、定价和空投。"
  }
];
