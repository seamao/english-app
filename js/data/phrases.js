// 30 个 BD 万能句型 —— 覆盖 80% 日常商务对话
// 结构：骨架（中文意思）→ 英文模板 → 4 个真实 Web3 BD 场景例句

export const PHRASES = [
  // === 开场 Opening ===
  { id: 1, category: "开场", skeleton: "我主动联系你是因为...", pattern: "I'm reaching out because [reason]", ipa: "/aɪm ˈriːtʃɪŋ aʊt bɪˈkɔːz/",
    examples: [
      { en: "I'm reaching out because I saw your team just closed a seed round.", zh: "我联系你是因为看到你们刚完成种子轮。" },
      { en: "I'm reaching out because we think there's a strong synergy between our products.", zh: "我联系你是觉得我们俩产品协同性很强。" },
      { en: "I'm reaching out because a friend at Paradigm recommended you.", zh: "Paradigm 的一个朋友推荐我联系你的。" },
      { en: "I'm reaching out because we'd love to explore a listing on your exchange.", zh: "我想聊一下在你们交易所上币的可能性。" }
    ]
  },
  { id: 2, category: "开场", skeleton: "我是 X 项目的 Y（自我介绍）", pattern: "I'm [name], [role] at [project]", ipa: "/aɪm neɪm roʊl ət ˈprɑːdʒekt/",
    examples: [
      { en: "I'm Eason, Head of BD at RNS.", zh: "我是 Eason，RNS 的 BD 负责人。" },
      { en: "I'm Alex, leading growth at a new L2 we're building.", zh: "我是 Alex，负责我们新 L2 项目的增长。" },
      { en: "I'm Sarah from the tokenomics side at Paradigm.", zh: "我是 Paradigm 这边负责代币经济的 Sarah。" },
      { en: "I'm Tom, co-founder of a DeFi protocol launching next month.", zh: "我是 Tom，一个下个月上线的 DeFi 协议的联创。" }
    ]
  },
  { id: 3, category: "开场", skeleton: "简单自我介绍一下我们在做什么", pattern: "In short, we're building [one-liner]", ipa: "/ɪn ʃɔːrt wɪər ˈbɪldɪŋ/",
    examples: [
      { en: "In short, we're building a decentralized identity layer for Web3.", zh: "简单说，我们在做 Web3 的去中心化身份层。" },
      { en: "In short, we're building an L2 focused on payments.", zh: "简单说，我们在做一个专注支付的 L2。" },
      { en: "In short, we're building the Stripe of crypto for emerging markets.", zh: "简单说，我们在做新兴市场的加密 Stripe。" },
      { en: "In short, we're building restaking infrastructure for validators.", zh: "简单说，我们在做面向验证者的再质押基础设施。" }
    ]
  },

  // === 表达意图 Intent ===
  { id: 4, category: "意图", skeleton: "我想跟你聊一下...", pattern: "I'd love to explore [topic] with you", ipa: "/aɪd lʌv tuː ɪkˈsplɔːr/",
    examples: [
      { en: "I'd love to explore a listing opportunity with you.", zh: "我想跟你聊一下上币的可能性。" },
      { en: "I'd love to explore a co-marketing campaign with your team.", zh: "我想跟你们团队聊一下联合营销。" },
      { en: "I'd love to explore how we can integrate with your bridge.", zh: "我想聊聊怎么跟你们的跨链桥集成。" },
      { en: "I'd love to explore an investment round together.", zh: "我想聊一下一起跟投的可能。" }
    ]
  },
  { id: 5, category: "意图", skeleton: "能不能约个简短的通话", pattern: "Would you be open to a quick call [when]?", ipa: "/wʊd juː biː ˈoʊpən tuː ə kwɪk kɔːl/",
    examples: [
      { en: "Would you be open to a quick 20-min call next week?", zh: "下周能不能约个 20 分钟的简短通话？" },
      { en: "Would you be open to a quick call this Thursday afternoon?", zh: "这周四下午能不能约个通话？" },
      { en: "Would you be open to a quick sync over Telegram?", zh: "可以在 TG 上简短对一下吗？" },
      { en: "Would you be open to a quick intro call sometime?", zh: "找个时间约个简单介绍 call 方便吗？" }
    ]
  },
  { id: 6, category: "意图", skeleton: "我们的目标是...", pattern: "Our goal is to [outcome]", ipa: "/aʊər ɡoʊl ɪz tuː/",
    examples: [
      { en: "Our goal is to list on a tier-one CEX by Q3.", zh: "我们的目标是 Q3 前上一家一线 CEX。" },
      { en: "Our goal is to onboard 10,000 active users this quarter.", zh: "本季度目标是新增 1 万活跃用户。" },
      { en: "Our goal is to close a $5M strategic round by end of month.", zh: "目标是月底前完成 500 万战略轮。" },
      { en: "Our goal is to build the default wallet for the Asia market.", zh: "我们的目标是成为亚洲市场的默认钱包。" }
    ]
  },

  // === 询问 Asking ===
  { id: 7, category: "询问", skeleton: "能告诉我一下... 吗", pattern: "Could you walk me through [thing]?", ipa: "/kʊd juː wɔːk miː θruː/",
    examples: [
      { en: "Could you walk me through your listing process?", zh: "能介绍下你们的上币流程吗？" },
      { en: "Could you walk me through the timeline on your side?", zh: "能讲下你们这边的时间节奏吗？" },
      { en: "Could you walk me through your tokenomics?", zh: "能介绍一下你们的代币经济吗？" },
      { en: "Could you walk me through the DD checklist?", zh: "能过一下尽调清单吗？" }
    ]
  },
  { id: 8, category: "询问", skeleton: "你们什么时候可以... ？", pattern: "What's your timeline on [thing]?", ipa: "/wʌts jʊər ˈtaɪmˌlaɪn ɑːn/",
    examples: [
      { en: "What's your timeline on the integration?", zh: "集成的时间节奏大概什么样？" },
      { en: "What's your timeline on mainnet launch?", zh: "主网上线时间大概是？" },
      { en: "What's your timeline on closing this round?", zh: "这轮大概什么时候能 close？" },
      { en: "What's your timeline on the listing decision?", zh: "上币决定大概什么时候能定？" }
    ]
  },
  { id: 9, category: "询问", skeleton: "有没有可能...", pattern: "Is there any chance we could [action]?", ipa: "/ɪz ðer ˈeni tʃæns wiː kʊd/",
    examples: [
      { en: "Is there any chance we could fast-track the review?", zh: "有没有可能加快一下审核？" },
      { en: "Is there any chance we could get a better allocation?", zh: "有没有可能多拿一点额度？" },
      { en: "Is there any chance we could move the call to Friday?", zh: "有没有可能把 call 挪到周五？" },
      { en: "Is there any chance we could do a joint AMA?", zh: "有没有可能搞个联合 AMA？" }
    ]
  },

  // === 转场/连接 Transition ===
  { id: 10, category: "转场", skeleton: "就...而言", pattern: "In terms of [topic], ...", ipa: "/ɪn tɜːrmz əv/",
    examples: [
      { en: "In terms of tokenomics, we have a 4-year vesting schedule.", zh: "代币经济方面，我们是 4 年解锁。" },
      { en: "In terms of the partnership, here's what we have in mind.", zh: "合作方面，我们的想法是这样。" },
      { en: "In terms of timing, we're flexible on our end.", zh: "时间方面我们这边比较灵活。" },
      { en: "In terms of budget, we can allocate $50k for co-marketing.", zh: "预算方面联合营销我们能出 5 万美元。" }
    ]
  },
  { id: 11, category: "转场", skeleton: "那也就是说...", pattern: "That said, [statement]", ipa: "/ðæt sed/",
    examples: [
      { en: "That said, we're still open to adjustments.", zh: "话虽如此，我们还可以调整。" },
      { en: "That said, the DD process usually takes 4-6 weeks.", zh: "话是这么说，但尽调一般要 4-6 周。" },
      { en: "That said, we don't want to rush the decision.", zh: "不过我们不想仓促决定。" },
      { en: "That said, let me check with the team first.", zh: "不过让我先跟团队确认一下。" }
    ]
  },
  { id: 12, category: "转场", skeleton: "问得好/这个问题很重要", pattern: "That's a great question. [answer]", ipa: "/ðæts ə ɡreɪt ˈkwestʃən/",
    examples: [
      { en: "That's a great question. Let me pull up the numbers.", zh: "这个问题很好，我把数据调出来。" },
      { en: "That's a great question. It actually depends on the region.", zh: "问得好，其实要看地区。" },
      { en: "That's a great question. We've thought about this a lot.", zh: "这个问题不错，我们考虑过很多。" },
      { en: "That's a great question, and honestly, we're still figuring it out.", zh: "问得好，说实话我们还在摸索。" }
    ]
  },

  // === 表态 Position ===
  { id: 13, category: "表态", skeleton: "说实话我不是很确定", pattern: "Honestly, I'm not sure [about X]", ipa: "/ˈɑːnɪstli aɪm nɑːt ʃʊr/",
    examples: [
      { en: "Honestly, I'm not sure about the exact timeline.", zh: "说实话具体时间我不太确定。" },
      { en: "Honestly, I'm not sure we can commit to that allocation.", zh: "老实说那个额度我们不一定能承诺。" },
      { en: "Honestly, I'm not sure that's the right path for us.", zh: "说实话我不确定这是不是适合我们的路线。" },
      { en: "Honestly, I'm not sure the numbers work on our end.", zh: "说实话这个数我们这边算不过来。" }
    ]
  },
  { id: 14, category: "表态", skeleton: "完全同意 / 确实是这样", pattern: "That makes total sense. [optional follow-up]", ipa: "/ðæt meɪks ˈtoʊtl sens/",
    examples: [
      { en: "That makes total sense. Let me see what I can do.", zh: "这完全有道理，我看看我能做什么。" },
      { en: "That makes total sense given your timeline.", zh: "考虑到你们的时间，这完全说得通。" },
      { en: "That makes total sense. Happy to accommodate.", zh: "有道理，我们可以配合。" },
      { en: "That makes total sense from a compliance perspective.", zh: "从合规角度完全说得通。" }
    ]
  },
  { id: 15, category: "表态", skeleton: "我倾向于...", pattern: "I'm leaning toward [option]", ipa: "/aɪm ˈliːnɪŋ tɔːrd/",
    examples: [
      { en: "I'm leaning toward waiting for the next market cycle.", zh: "我倾向于等下一个市场周期。" },
      { en: "I'm leaning toward the strategic round over the KOL round.", zh: "我更倾向于战略轮而不是 KOL 轮。" },
      { en: "I'm leaning toward Binance as the first listing.", zh: "我倾向于币安作为首发。" },
      { en: "I'm leaning toward a smaller, tighter cap.", zh: "我倾向于一个更小、更紧凑的总量。" }
    ]
  },

  // === 跟进 Follow-up ===
  { id: 16, category: "跟进", skeleton: "回头跟你对一下", pattern: "Let me circle back after [event]", ipa: "/let miː ˈsɜːrkl bæk ˈæftər/",
    examples: [
      { en: "Let me circle back after I sync with the team.", zh: "我和团队对完再回来跟你讲。" },
      { en: "Let me circle back after our board meeting tomorrow.", zh: "明天董事会之后我再来跟你对。" },
      { en: "Let me circle back after I check the cap table.", zh: "我查完股权表再来跟你说。" },
      { en: "Let me circle back after legal reviews the terms.", zh: "法务看完条款我再回来。" }
    ]
  },
  { id: 17, category: "跟进", skeleton: "简单跟你更新一下进展", pattern: "Just a quick update on [topic]", ipa: "/dʒʌst ə kwɪk ʌpˈdeɪt ɑːn/",
    examples: [
      { en: "Just a quick update on the listing timeline.", zh: "简单更新下上币时间。" },
      { en: "Just a quick update on our funding progress.", zh: "简单更新下融资进展。" },
      { en: "Just a quick update — we've onboarded the market maker.", zh: "快速更新一下 —— 做市商已经接入。" },
      { en: "Just a quick update on the integration status.", zh: "简单更新下集成状态。" }
    ]
  },
  { id: 18, category: "跟进", skeleton: "礼貌催一下", pattern: "Just wanted to follow up on [thing]", ipa: "/dʒʌst ˈwɑːntɪd tuː ˈfɑːloʊ ʌp/",
    examples: [
      { en: "Just wanted to follow up on the proposal I sent last week.", zh: "礼貌催下上周发的那份提案。" },
      { en: "Just wanted to follow up on our conversation from Monday.", zh: "跟进下周一聊的事情。" },
      { en: "Just wanted to follow up in case this got buried.", zh: "怕邮件被淹了，跟进一下。" },
      { en: "Just wanted to follow up on the DD materials.", zh: "跟进下尽调资料。" }
    ]
  },
  { id: 19, category: "跟进", skeleton: "把某人加进来", pattern: "Looping in [person] for [reason]", ipa: "/ˈluːpɪŋ ɪn/",
    examples: [
      { en: "Looping in our BD lead for next steps.", zh: "把 BD 负责人加进来推进后续。" },
      { en: "Looping in our CTO to answer the technical questions.", zh: "把 CTO 拉进来回答技术问题。" },
      { en: "Looping in legal to review the term sheet.", zh: "把法务加进来看下条款。" },
      { en: "Looping in our market maker for the liquidity plan.", zh: "把做市商加进来聊流动性方案。" }
    ]
  },

  // === 谈判 Negotiation ===
  { id: 20, category: "谈判", skeleton: "我们这边可以... 作为交换", pattern: "We can offer [X] in exchange for [Y]", ipa: "/wiː kæn ˈɔːfər/",
    examples: [
      { en: "We can offer a 30% revenue share in exchange for exclusive promotion.", zh: "我们可以给 30% 分成换独家推广。" },
      { en: "We can offer extra vesting in exchange for a lower round price.", zh: "我们可以延长解锁换取更低估值。" },
      { en: "We can offer marketing support in exchange for fast-track review.", zh: "我们可以提供营销支持换快速审核。" },
      { en: "We can offer token allocation in exchange for advisory services.", zh: "我们可以给代币额度换顾问服务。" }
    ]
  },
  { id: 21, category: "谈判", skeleton: "这个有没有商量余地", pattern: "Is there any flexibility on [term]?", ipa: "/ɪz ðer ˈeni ˌfleksəˈbɪləti/",
    examples: [
      { en: "Is there any flexibility on the listing fee?", zh: "上币费有没有商量余地？" },
      { en: "Is there any flexibility on the vesting period?", zh: "解锁期能不能商量？" },
      { en: "Is there any flexibility on the timeline?", zh: "时间有没有弹性？" },
      { en: "Is there any flexibility on the allocation size?", zh: "额度大小有没有商量余地？" }
    ]
  },
  { id: 22, category: "谈判", skeleton: "这对我们来说有点难/做不到", pattern: "That's a bit of a stretch for us on [aspect]", ipa: "/ðæts ə bɪt əv ə stretʃ/",
    examples: [
      { en: "That's a bit of a stretch for us on the timeline.", zh: "这个时间对我们来说有点紧。" },
      { en: "That's a bit of a stretch for us on the vesting terms.", zh: "这个解锁条款对我们偏紧。" },
      { en: "That's a bit of a stretch for us on the commitment size.", zh: "这个承诺量级对我们有点大。" },
      { en: "That's a bit of a stretch for us on the marketing spend.", zh: "这个营销预算对我们有点吃力。" }
    ]
  },

  // === 收尾 Closing ===
  { id: 23, category: "收尾", skeleton: "很高兴聊完", pattern: "Great chatting — let's [next step]", ipa: "/ɡreɪt ˈtʃætɪŋ/",
    examples: [
      { en: "Great chatting — let's sync again next week.", zh: "聊得很好，下周再对一下。" },
      { en: "Great chatting — let's take this to a follow-up call.", zh: "聊得不错，咱们下次 call 里继续。" },
      { en: "Great chatting — let's pull in our teams on email.", zh: "聊得很好，咱们把两边团队拉到邮件里。" },
      { en: "Great chatting — let's revisit this after TGE.", zh: "聊得不错，TGE 之后再聊这个。" }
    ]
  },
  { id: 24, category: "收尾", skeleton: "下一步我们...", pattern: "As next steps, let's [action]", ipa: "/æz nekst steps/",
    examples: [
      { en: "As next steps, let's exchange the materials by Friday.", zh: "下一步周五之前交换资料。" },
      { en: "As next steps, let's set up a deeper tech call.", zh: "下一步约一次更深入的技术 call。" },
      { en: "As next steps, let's align on the term sheet draft.", zh: "下一步先把条款草案对齐。" },
      { en: "As next steps, let's get our legal teams connected.", zh: "下一步把两边法务接上。" }
    ]
  },
  { id: 25, category: "收尾", skeleton: "我会在今天之前把...发给你", pattern: "I'll send over [thing] by [time]", ipa: "/aɪl send ˈoʊvər/",
    examples: [
      { en: "I'll send over the deck by end of day.", zh: "我今天之内把 deck 发给你。" },
      { en: "I'll send over the DD checklist by tomorrow.", zh: "尽调清单我明天之前发你。" },
      { en: "I'll send over the draft term sheet this week.", zh: "条款草案本周发你。" },
      { en: "I'll send over the tokenomics overview later today.", zh: "代币经济概览今天晚些时候发你。" }
    ]
  },

  // === 礼貌 Politeness ===
  { id: 26, category: "礼貌", skeleton: "感谢你抽时间", pattern: "Thanks for taking the time [to X]", ipa: "/θæŋks fɔːr ˈteɪkɪŋ ðə taɪm/",
    examples: [
      { en: "Thanks for taking the time to jump on this call.", zh: "感谢你抽时间来开这个 call。" },
      { en: "Thanks for taking the time to review our proposal.", zh: "感谢你花时间看我们的提案。" },
      { en: "Thanks for taking the time to walk me through this.", zh: "感谢你花时间给我讲这些。" },
      { en: "Thanks for taking the time to introduce us.", zh: "谢谢你花时间引荐我们。" }
    ]
  },
  { id: 27, category: "礼貌", skeleton: "理解你... / 完全理解", pattern: "Totally understand [situation]", ipa: "/ˈtoʊtli ˌʌndərˈstænd/",
    examples: [
      { en: "Totally understand if the timing doesn't work for you.", zh: "完全理解如果时间对你不合适。" },
      { en: "Totally understand — compliance always takes longer.", zh: "理解的，合规总要更久。" },
      { en: "Totally understand, we've been there too.", zh: "完全理解，我们也经历过。" },
      { en: "Totally understand if you need to pass on this one.", zh: "完全理解如果这次你要 pass。" }
    ]
  },
  { id: 28, category: "礼貌", skeleton: "如果太麻烦就算了", pattern: "No worries at all if [X]", ipa: "/noʊ ˈwɜːriz æt ɔːl/",
    examples: [
      { en: "No worries at all if this isn't the right fit.", zh: "不合适就不合适，没事的。" },
      { en: "No worries at all if you need more time.", zh: "你需要更多时间完全没事。" },
      { en: "No worries at all — we can revisit later.", zh: "没关系，我们以后再聊。" },
      { en: "No worries at all if you can't commit right now.", zh: "现在不能承诺完全没关系。" }
    ]
  },

  // === 应急 Unexpected ===
  { id: 29, category: "应急", skeleton: "能不能再说一遍", pattern: "Sorry, could you repeat [that]?", ipa: "/ˈsɑːri kʊd juː rɪˈpiːt/",
    examples: [
      { en: "Sorry, could you repeat the last part?", zh: "抱歉，最后那段能再说一遍吗？" },
      { en: "Sorry, could you repeat the number?", zh: "不好意思，数字能再说一遍吗？" },
      { en: "Sorry, could you repeat — the connection is bad.", zh: "抱歉，信号有点差，再说一遍？" },
      { en: "Sorry, could you repeat slower please?", zh: "抱歉，能稍微慢点再说一遍吗？" }
    ]
  },
  { id: 30, category: "应急", skeleton: "我需要回去和团队确认", pattern: "I need to check with the team [on X]", ipa: "/aɪ niːd tuː tʃek wɪð/",
    examples: [
      { en: "I need to check with the team on the allocation.", zh: "额度的事我要回去和团队确认。" },
      { en: "I need to check with the team before I commit.", zh: "承诺之前我要和团队确认下。" },
      { en: "I need to check with the team on this specific term.", zh: "这个具体条款我要和团队对一下。" },
      { en: "I need to check with the team and get back to you.", zh: "我和团队确认完再回复你。" }
    ]
  }
];

export const PHRASE_CATEGORIES = ["开场", "意图", "询问", "转场", "表态", "跟进", "谈判", "收尾", "礼貌", "应急"];
