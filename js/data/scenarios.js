// 5 个高频 BD 情境剧本，每个有 L1（跟读）/ L2（填空）/ L3（自由）三档难度
// L1：完整模板，你只需跟读
// L2：给骨架，替换关键信息
// L3：只给情境，自由发挥 + AI 批改

export const SCENARIOS = [
  {
    id: 101,
    title: "【基础】Conference 第一次见面互相介绍",
    context: "在 Token2049 展位前，一个陌生人走过来递名片。你要自我介绍 + 问对方在做什么。",
    tips: ["先握手 + Nice to meet you", "姓 + 项目一句话", "主动把球打回去问对方"],
    L1: {
      script: "Hey, nice to meet you — I'm Eason from RNS, we do decentralized identity. What about you, what brings you here?"
    },
    L2: {
      template: "Hey, nice to meet you — I'm [你的名] from [项目名], we do [一句话业务]. What about you, what brings you here?",
      fields: ["你的名", "项目名", "一句话业务"]
    },
    L3: {
      prompt: "你在 Devcon 午餐排队时碰到一个陌生开发者。用 2 句话自我介绍 + 问对方。",
      mustUse: ["nice to meet you", "What about you"]
    }
  },
  {
    id: 102,
    title: "【基础】要 Telegram / 加微信（留联系方式）",
    context: "刚聊完，对方看起来感兴趣。你想留下联系方式继续跟进。",
    tips: ["别直接丢 QR，先问对方偏好", "给两个选项（TG / email）", "约个粗略时间继续聊"],
    L1: {
      script: "This is great — would love to continue this. What's the best way to reach you, Telegram or email? I'll drop you a note tomorrow with more details."
    },
    L2: {
      template: "This is great — would love to continue this. What's the best way to reach you, [方式1] or [方式2]? I'll drop you a note [时间] with [内容].",
      fields: ["方式1", "方式2", "时间", "内容"]
    },
    L3: {
      prompt: "你在咖啡厅偶遇一个 CEX 的 listing manager。聊了 5 分钟。自然收尾 + 要到 TG，承诺下周发 deck。",
      mustUse: ["best way to reach you", "drop you a note"]
    }
  },
  {
    id: 103,
    title: "【基础】Zoom call 刚接通的前 10 秒",
    context: "Zoom 刚进来，对方已经在里面。你要打招呼 + 确认能听清。",
    tips: ["轻松点，别太正式", "确认音视频", "如果迟到就先道歉一句"],
    L1: {
      script: "Hey Mike, can you hear me OK? Sorry if I'm a minute late — had a call run over. How's your day going?"
    },
    L2: {
      template: "Hey [对方名], can you hear me OK? [可选道歉]. How's your [时段] going?",
      fields: ["对方名", "可选道歉", "时段"]
    },
    L3: {
      prompt: "Zoom 刚接通，对方已经在。你网络卡了 30 秒。打招呼 + 道歉 + 进入正题。",
      mustUse: ["can you hear me", "Sorry", "How's"]
    }
  },
  {
    id: 104,
    title: "【基础】没听清对方的话怎么礼貌回问",
    context: "对方语速快 / 口音重，你没听清一句关键信息。不要不懂装懂。",
    tips: ["不要说 What?（太冲）", "用 Sorry, could you…", "重复你听到的部分确认"],
    L1: {
      script: "Sorry, could you say that again? I caught the part about the vesting schedule but missed what came after."
    },
    L2: {
      template: "Sorry, could you say that again? I caught [你听到的部分] but missed [没听到的部分].",
      fields: ["你听到的部分", "没听到的部分"]
    },
    L3: {
      prompt: "对方在讲 token allocation 百分比，语速很快你没抓住数字。礼貌打断请他重复一遍。",
      mustUse: ["Sorry, could you", "I caught", "missed"]
    }
  },
  {
    id: 105,
    title: "【基础】表达同意 / 认同对方观点",
    context: "对方说了一个观点你认同，不要只会说 yes。",
    tips: ["先复述一下对方要点", "加一个自己的角度或例子", "自然过渡到下一话题"],
    L1: {
      script: "Yeah, totally agree — distribution really is the hardest part, not the tech. We saw the same thing when we launched — the code was live for two months before anyone used it."
    },
    L2: {
      template: "Yeah, totally agree — [复述对方观点]. We saw the same thing when [你的经历] — [具体例子].",
      fields: ["复述对方观点", "你的经历", "具体例子"]
    },
    L3: {
      prompt: "对方说 'retention is more important than user acquisition for crypto products'。你认同，加一个你们自己的数据例子附议。",
      mustUse: ["totally agree", "We saw the same thing"]
    }
  },
  {
    id: 106,
    title: "【基础】表达不同意但不冒犯",
    context: "对方观点你不完全赞同。不要用 No 或 You're wrong 直接顶回去。",
    tips: ["先肯定一半", "That said / however 过渡", "给数据 / 经验支撑"],
    L1: {
      script: "I see where you're coming from — for most L1s that's probably true. That said, in our case the community has been more of an asset than a cost. We've had 5K people join Discord organically in the last month."
    },
    L2: {
      template: "I see where you're coming from — [部分认可]. That said, in our case [你的观点], [数据/例子 support].",
      fields: ["部分认可", "你的观点", "数据/例子 support"]
    },
    L3: {
      prompt: "VC 说 'memecoins have no long-term value'。你持有不同意见。优雅推回去。",
      mustUse: ["I see where you're coming from", "That said"]
    }
  },
  {
    id: 107,
    title: "【基础】说'我不知道'的专业版",
    context: "对方问了一个你答不上来的问题。别说 I don't know 就结束。",
    tips: ["诚实承认", "说清你会去找谁 / 什么时候回复", "不要瞎编"],
    L1: {
      script: "Honestly, I don't have the exact number off the top of my head — let me check with our finance lead and get back to you by tomorrow. Does that work?"
    },
    L2: {
      template: "Honestly, I don't have [缺的信息] off the top of my head — let me check with [消息来源] and get back to you by [时间]. Does that work?",
      fields: ["缺的信息", "消息来源", "时间"]
    },
    L3: {
      prompt: "对方问你们协议过去 90 天的 average daily fee revenue，你记不清。专业应答。",
      mustUse: ["off the top of my head", "get back to you", "Does that work"]
    }
  },
  {
    id: 108,
    title: "【基础】感谢介绍人：A 介绍你认识 B",
    context: "朋友 Jake 把你介绍给某 VC 的 Sarah。你要发第一条消息给 Sarah + cc Jake。",
    tips: ["第一句感谢 Jake 牵线", "一句话自我介绍", "明确你希望聊什么 + CTA"],
    L1: {
      script: "Hi Sarah — thanks a ton to Jake for the intro. I'm Eason, founder of RNS. Jake mentioned you've been looking at identity plays, and I'd love to share what we're working on. Would you be open to a 20-min call next week? (Jake — thanks again, moving you to bcc.)"
    },
    L2: {
      template: "Hi [对方名] — thanks a ton to [介绍人] for the intro. I'm [你的名], [身份]. [介绍人] mentioned [共鸣点], and I'd love to [诉求]. Would you be open to [CTA]? ([介绍人] — thanks again, moving you to bcc.)",
      fields: ["对方名", "介绍人", "你的名", "身份", "共鸣点", "诉求", "CTA"]
    },
    L3: {
      prompt: "Wintermute 的 CEO 把你介绍给 Binance Labs 的 Head of Investments。写第一封邮件。",
      mustUse: ["thanks a ton", "for the intro", "moving you to bcc"]
    }
  },
  {
    id: 109,
    title: "【基础】临时改约 / 推迟会议",
    context: "今天下午的 call 你临时去不了。要礼貌改期，不丢专业感。",
    tips: ["开头先道歉 + 简短原因", "给 2-3 个备选时间", "表达仍然重视这次对话"],
    L1: {
      script: "Hey Mike, something urgent just came up on my end — any chance we could push our 3pm to later this week? I'm open Thursday morning or Friday anytime. Really sorry for the short notice, still very keen to chat."
    },
    L2: {
      template: "Hey [对方名], [原因] — any chance we could push our [原时间] to [时间段]? I'm open [备选1] or [备选2]. Really sorry for the short notice, still very keen to chat.",
      fields: ["对方名", "原因", "原时间", "时间段", "备选1", "备选2"]
    },
    L3: {
      prompt: "你爸突然住院，下午 4 点和 Coinbase 的 call 去不了。推到下周。",
      mustUse: ["something urgent just came up", "any chance we could push", "keen to chat"]
    }
  },
  {
    id: 110,
    title: "【基础】简短 small talk：聊天气 / 市场 / 周末",
    context: "Zoom 正式开始前 30 秒的破冰闲聊。对方说 'how's it going?'",
    tips: ["别只回 Good 就断", "加一句话 context", "可以反问对方"],
    L1: {
      script: "Pretty good — crazy week honestly, with the market doing what it's doing. How about you, where are you dialing in from?"
    },
    L2: {
      template: "Pretty good — [一句近况/天气/市场]. How about you, [反问问题]?",
      fields: ["一句近况/天气/市场", "反问问题"]
    },
    L3: {
      prompt: "周一早上 10 点 Zoom，对方在伦敦你在香港。'how was your weekend?' 回答 + 反问。",
      mustUse: ["How about you"]
    }
  },
  {
    id: 111,
    title: "【基础】感谢对方帮了大忙",
    context: "某合伙人把你引荐给了一个关键投资人并促成了一轮。你要单独发消息真诚感谢。",
    tips: ["具体说明帮了什么", "表达它对你的意义", "给未来回馈的话"],
    L1: {
      script: "Hey Jake, just wanted to say a proper thank you for the intro to Sarah — we just wrapped the round and honestly wouldn't have gotten there without you opening that door. Owe you one big time. Let me know how I can return the favor anytime."
    },
    L2: {
      template: "Hey [对方名], just wanted to say a proper thank you for [具体事情] — [结果 + 你的感受]. Owe you one big time. Let me know how I can [回馈方式] anytime.",
      fields: ["对方名", "具体事情", "结果 + 你的感受", "回馈方式"]
    },
    L3: {
      prompt: "一位 KOL 无偿帮你们推了 TGE，结果当天流量翻倍。真诚感谢 + 提出未来合作想法。",
      mustUse: ["just wanted to say", "wouldn't have", "Owe you one"]
    }
  },
  {
    id: 112,
    title: "【基础】婉拒会议邀请",
    context: "对方约你一个 call 但优先级不高 / 不合适。礼貌推掉不关门。",
    tips: ["先感谢邀请", "简单真实的理由不编", "留一个未来可能的口子"],
    L1: {
      script: "Thanks for thinking of me — I really appreciate it. Honestly my plate is pretty full this quarter so I'd rather not commit if I can't give it proper attention. Let's reconnect in Q3 and I'll be in a much better spot to dig in."
    },
    L2: {
      template: "Thanks for thinking of me — I really appreciate it. Honestly [真实原因] so I'd rather not commit if I can't give it proper attention. Let's reconnect [未来时间] and I'll be in a much better spot.",
      fields: ["真实原因", "未来时间"]
    },
    L3: {
      prompt: "某二线 VC 想和你做 portfolio call。你最近正在打 listing 冲刺没时间。推到下季度。",
      mustUse: ["Thanks for thinking of me", "my plate is", "reconnect"]
    }
  },
  {
    id: 113,
    title: "【基础】请朋友帮忙做 intro（拉关系）",
    context: "你朋友 Jake 认识某 VC 的 partner Sarah。你想让 Jake 牵线。",
    tips: ["先说清楚为什么要见", "准备好 forwardable blurb（朋友转发用）", "给朋友退路 no pressure"],
    L1: {
      script: "Hey Jake, quick ask — I saw Sarah at Paradigm has been writing about identity lately and I think she'd find what we're building interesting. Any chance you'd be open to an intro? Fully understand if it's not the right timing. I've drafted a short blurb below you can just forward if it's easier."
    },
    L2: {
      template: "Hey [朋友], quick ask — I saw [目标人] at [公司] [最近动态] and I think [契合点]. Any chance you'd be open to an intro? Fully understand if [给退路]. I've drafted a short blurb below you can just forward.",
      fields: ["朋友", "目标人", "公司", "最近动态", "契合点", "给退路"]
    },
    L3: {
      prompt: "让一个前同事帮你引荐 Binance Labs 的 investment lead。附上一段可转发的自我介绍。",
      mustUse: ["quick ask", "Any chance", "forward"]
    }
  },
  {
    id: 114,
    title: "【基础】催对方回邮件（第二次跟进）",
    context: "上周给某 CEX 发了 listing 邮件，至今没回。第二次温柔 push 一下。",
    tips: ["Bump 开头很自然", "加一句新信息提权", "给 easy out（'if not right timing'）"],
    L1: {
      script: "Bumping this up — understand things get busy. One small update: we just integrated with Chainlink which unlocks the price feed you asked about last time. If listing isn't a priority this quarter, totally fine — just let me know and I'll circle back later."
    },
    L2: {
      template: "Bumping this up — understand things get busy. One small update: [新进展 + 对方关心的点]. If [所求的事] isn't a priority, totally fine — just let me know and I'll circle back later.",
      fields: ["新进展 + 对方关心的点", "所求的事"]
    },
    L3: {
      prompt: "给 Messari 投递研究合作三周没回。你们刚拿到 A 轮融资。第二次 follow-up。",
      mustUse: ["Bumping this up", "One small update", "circle back"]
    }
  },
  {
    id: 115,
    title: "【基础】语音留言：没接到电话",
    context: "给对方打电话没接，要留 30 秒 voicemail。",
    tips: ["开头报姓 + 公司", "一句话说事由", "留号码并重复一遍"],
    L1: {
      script: "Hi Mike, this is Eason from RNS — quick call to follow up on the listing conversation. Nothing urgent, but give me a ring back when you have a minute. My number is +852 9123 4567, again that's +852 9123 4567. Thanks, talk soon."
    },
    L2: {
      template: "Hi [对方名], this is [你的名] from [项目名] — quick call to [事由]. Give me a ring back when you have a minute. My number is [号码], again that's [号码]. Thanks, talk soon.",
      fields: ["对方名", "你的名", "项目名", "事由", "号码"]
    },
    L3: {
      prompt: "给 OKX 的 listing manager 留 voicemail，事由是确认下周的尽调材料。",
      mustUse: ["this is", "give me a ring back", "talk soon"]
    }
  },
  {
    id: 116,
    title: "【基础】专业道歉：搞砸了一件事",
    context: "你们 dev 误删了合作方的测试数据。要发一封道歉 + 补救邮件。",
    tips: ["直接承认不绕弯", "说清发生了什么", "给补救方案 + 预防措施"],
    L1: {
      script: "Hi Mike — want to apologize directly for what happened this morning. Our engineer accidentally wiped the staging environment while doing cleanup. Fully on us. We've already restored the data from backup and added a two-person approval rule so this can't happen again. Let me know if there's anything else on your end we need to help fix."
    },
    L2: {
      template: "Hi [对方名] — want to apologize directly for [事件]. [发生了什么]. Fully on us. We've already [补救动作] and [预防措施]. Let me know if there's anything else we need to help fix.",
      fields: ["对方名", "事件", "发生了什么", "补救动作", "预防措施"]
    },
    L3: {
      prompt: "你们团队忘记给重要 KOL 发 TGE 空投。对方已经在 Twitter 抱怨了。发私信道歉 + 补救。",
      mustUse: ["apologize directly", "Fully on us", "already"]
    }
  },
  {
    id: 117,
    title: "【基础】Telegram 群里主动开口自我介绍",
    context: "你刚被拉进一个项目的 partner TG 群。要发一条得体的第一条消息。",
    tips: ["别只发 '👋 Hello'", "简介 + 你来这个群做什么", "欢迎对方找你"],
    L1: {
      script: "Hey everyone 👋 Eason here from RNS — our team will be coordinating the joint AMA and marketing push on our side. Feel free to ping me directly (@EasonRNS) for anything time-sensitive. Excited to work with you all."
    },
    L2: {
      template: "Hey everyone 👋 [你的名] here from [项目名] — our team will be [在群里做什么]. Feel free to ping me directly ([联系方式]) for [类型事情]. Excited to work with you all.",
      fields: ["你的名", "项目名", "在群里做什么", "联系方式", "类型事情"]
    },
    L3: {
      prompt: "被拉进和 Wintermute 的 MM 协作群。你是你方 BD 主负责人。第一条自我介绍。",
      mustUse: ["here from", "Feel free to ping", "Excited to"]
    }
  },
  {
    id: 118,
    title: "【基础】60 秒 elevator pitch",
    context: "电梯里碰到大 VC。只有 60 秒。要讲清 what / why now / traction / ask。",
    tips: ["一句话公式：we help X do Y by Z", "给最硬的一个数字", "问题要具体不泛泛"],
    L1: {
      script: "So — we help Web3 apps onboard users without seed phrases, using a decentralized identity primitive. We've gone from zero to 30K users in 3 months, mostly organic. We're closing a $5M seed next month, and I think your thesis on identity as the next UX frontier is a natural fit. Any chance you'd have 20 minutes next week?"
    },
    L2: {
      template: "So — we help [目标客户] do [要做的事] by [方法]. We've gone from [起点] to [现状] in [时间]. We're [当前节点], and I think [对方契合点] is a natural fit. Any chance you'd have 20 minutes next week?",
      fields: ["目标客户", "要做的事", "方法", "起点", "现状", "时间", "当前节点", "对方契合点"]
    },
    L3: {
      prompt: "给 a16z crypto partner 做 60 秒 pitch：你是做链上 AI agent 基础设施，每日处理 100 万次调用。",
      mustUse: ["we help", "gone from", "natural fit"]
    }
  },
  {
    id: 119,
    title: "【中级】Demo 产品 screen share 讲解",
    context: "Zoom 共享屏幕给 VC 演示你们的 dApp。边点边讲 3 分钟。",
    tips: ["每一屏先说我要你看什么", "用 'as you can see / notice how'", "结尾问问题确认"],
    L1: {
      script: "Alright, sharing my screen — can you see this OK? So what I want to walk you through is the user flow from signup to first transaction. As you can see, there's no seed phrase, no gas — the user just signs in with email. Notice how it auto-generates a smart account in the background. Any questions on this step before I move on?"
    },
    L2: {
      template: "Alright, sharing my screen — can you see this OK? What I want to walk you through is [流程]. As you can see, [关键点1]. Notice how [关键点2]. Any questions before I move on?",
      fields: ["流程", "关键点1", "关键点2"]
    },
    L3: {
      prompt: "给 Coinbase 演示你们的链上结算后台 dashboard。重点讲秒级结算 + 多链支持。",
      mustUse: ["sharing my screen", "As you can see", "Notice how"]
    }
  },
  {
    id: 120,
    title: "【中级】媒体采访英文应答",
    context: "Bankless 播客采访 30 分钟。主持人刚问完'what makes you different?'",
    tips: ["给三段论 backbone", "用具体例子而不是形容词", "收尾回到听众关心的'so what'"],
    L1: {
      script: "Great question. Three things really. First, we're the only team with a working implementation of account abstraction at scale — 500K accounts in production today. Second, our gas fees are 90% lower because of the compression layer we built in-house. And third — honestly the most important — our team has shipped consumer apps before, not just protocols. The combination is rare, and it's why users actually stick around."
    },
    L2: {
      template: "Great question. Three things. First, [差异点1]. Second, [差异点2]. And third — honestly the most important — [差异点3]. The combination is rare, and it's why [用户价值].",
      fields: ["差异点1", "差异点2", "差异点3", "用户价值"]
    },
    L3: {
      prompt: "Laura Shin 采访你：'Why should anyone care about another L2 in 2026?' 给 3 点回答。",
      mustUse: ["Great question", "Three things", "honestly the most important"]
    }
  },
  {
    id: 121,
    title: "【中级】Quarterly update：给投资人季度报告",
    context: "向种子投资人发季度邮件。结构：wins / challenges / asks。",
    tips: ["数字优先", "诚实讲 challenge 不是粉饰", "ask 要具体不说大话"],
    L1: {
      script: "Hi team — Q1 update below.\n\nWins: TVL up 3.2x to $120M, shipped account abstraction to mainnet, hired 2 senior engineers from Google.\nChallenges: user retention after week 4 is still at 22%, below our 35% target. We're A/B testing a new onboarding flow to fix this.\nAsks: 1) intros to any L2 BD leads you know; 2) feedback on our tokenomics draft (attached).\n\nFull deck in the drive. Happy to jump on a call anytime."
    },
    L2: {
      template: "Hi team — [季度] update.\n\nWins: [3 条硬成就].\nChallenges: [1-2 个诚实挑战 + 计划].\nAsks: 1) [具体求助1]; 2) [具体求助2].\n\nFull deck attached.",
      fields: ["季度", "3 条硬成就", "1-2 个诚实挑战 + 计划", "具体求助1", "具体求助2"]
    },
    L3: {
      prompt: "Q2 报告：收入 $2M（+40%）、但一个核心工程师离职。求助：找 CTO 候选人、媒体曝光。",
      mustUse: ["Wins", "Challenges", "Asks"]
    }
  },
  {
    id: 122,
    title: "【中级】Grant 申请开场段",
    context: "给 Optimism RetroPGF / Arbitrum STIP 写 grant 提案的 Summary 段。100 字以内。",
    tips: ["一句话 what", "一句话 why 生态受益", "一句话 how much & deliverable"],
    L1: {
      script: "RNS is a decentralized identity layer that has onboarded 30K Optimism users in 3 months. We're requesting $150K to build native support for Superchain identity resolution, which will let any OP Stack chain share a unified user graph. Deliverables include the SDK, documentation, and two reference integrations, shipped within 90 days."
    },
    L2: {
      template: "[项目名] is [一句话业务] that has [生态相关成就]. We're requesting [金额] to [交付物 1 句话], which will [生态价值]. Deliverables include [清单], shipped within [时限].",
      fields: ["项目名", "一句话业务", "生态相关成就", "金额", "交付物 1 句话", "生态价值", "清单", "时限"]
    },
    L3: {
      prompt: "给 Base Ecosystem Fund 申请 $200k 建一个链上支付 SDK。90 天内交付。",
      mustUse: ["requesting", "Deliverables include", "shipped within"]
    }
  },
  {
    id: 123,
    title: "【中级】Panel 辩论：被主持人直接点名反驳",
    context: "你在 Token2049 一个 panel 上。主持人刚说 'Eason, you disagree with that — why?'",
    tips: ["先微笑不火药味", "先明确分歧点", "给 1-2 点论据就停"],
    L1: {
      script: "Yeah, I actually do. Look, I have a lot of respect for what the modular camp is building, but I think the user doesn't care about architecture — they care about UX. If you look at the top 10 crypto apps by active users today, none of them are on modular chains. That's a real signal, not a temporary blip."
    },
    L2: {
      template: "Yeah, I actually do. Look, I have a lot of respect for [对方阵营], but I think [你的核心观点]. If you look at [数据/例子], [结论]. That's a real signal, not [对方可能的反驳].",
      fields: ["对方阵营", "你的核心观点", "数据/例子", "结论", "对方可能的反驳"]
    },
    L3: {
      prompt: "Panel 话题：'ETH is losing to Solana'。你是 ETH 阵营。被主持人点名反驳。",
      mustUse: ["I have a lot of respect", "If you look at", "real signal"]
    }
  },
  {
    id: 124,
    title: "【中级】招聘面试自我介绍（英文）",
    context: "你在面 Head of BD 岗位。面试官：'walk me through your background.' 2 分钟回答。",
    tips: ["时间顺序但聚焦相关性", "每段一个 why（为什么要跳下一段）", "收尾到 why this role"],
    L1: {
      script: "Sure. I spent the first five years at a traditional finance firm doing institutional sales — that's where I learned how to run a real enterprise cycle. I left in 2021 to join a DeFi protocol because I saw the distribution problem was wide open. Over the next two years I built their BD team from 0 to 8 people and closed the top 20 exchange listings. Right now I'm looking for a role where I can do that zero-to-one again, at a team with stronger product DNA — which is why your job caught my eye."
    },
    L2: {
      template: "Sure. I spent [第一段经历] — that's where I learned [学到的技能]. I left in [年] to [第二段原因]. Over the next [时长] I [主要成就]. Right now I'm looking for [你要的下一步], which is why [对该岗位的兴趣].",
      fields: ["第一段经历", "学到的技能", "年", "第二段原因", "时长", "主要成就", "你要的下一步", "对该岗位的兴趣"]
    },
    L3: {
      prompt: "你是前 Binance listing BD 5 年，想跳到 a16z crypto 做 investor。面试官请你自我介绍。",
      mustUse: ["that's where I learned", "caught my eye"]
    }
  },
  {
    id: 125,
    title: "【中级】合伙人分歧谈话：1-on-1 难聊的事",
    context: "和联合创始人对下一步方向有严重分歧。约了一个 1 小时面对面聊。你开场。",
    tips: ["用 I feel 不用 you always", "先说目标一致", "邀请对方先讲"],
    L1: {
      script: "Thanks for making time for this — I know it's not the easiest conversation. Before I get into it, I just want to say upfront that I think we're both trying to do right by the company. I feel like we've been pulling in different directions on the token launch timing, and I want to understand your side before I share mine. Can you walk me through how you're seeing it?"
    },
    L2: {
      template: "Thanks for making time for this. Before I get into it, I want to say upfront that [共同目标认可]. I feel like we've been [分歧描述], and I want to understand your side before I share mine. Can you walk me through how you're seeing it?",
      fields: ["共同目标认可", "分歧描述"]
    },
    L3: {
      prompt: "你和联创在要不要做 memecoin 子产品上分歧很大。约了周六咖啡厅。开场。",
      mustUse: ["Thanks for making time", "pulling in different directions", "walk me through"]
    }
  },
  {
    id: 1,
    title: "冷启动 DM：向交易所 BD 介绍项目",
    context: "你的项目想上币安。你在 LinkedIn 找到他们 Listing BD 的联系方式，第一次发 DM。目标：拿到 20 分钟的 intro call。",
    tips: ["不超过 4 句话", "先自我介绍 + 一句话说清你是干嘛的", "给出一个'他为什么该搭理你'的理由", "明确下一步 CTA"],
    L1: {
      script: "Hi Mike, I'm Eason, Head of BD at RNS. In short, we're building a decentralized identity layer that has onboarded 30K users in 3 months. I'd love to explore a listing opportunity with you. Would you be open to a quick 20-min call next week?"
    },
    L2: {
      template: "Hi [对方名], I'm [你的名], [你的职位] at [项目名]. In short, we're building [一句话介绍项目]. I'd love to explore [合作诉求] with you. Would you be open to a quick 20-min call [时间]?",
      fields: ["对方名", "你的名", "你的职位", "项目名", "一句话介绍项目", "合作诉求", "时间"]
    },
    L3: {
      prompt: "假设你刚在 X 上看到 Bybit Listing BD 转发了一条 AI + Crypto 的推文。你有一个 AI-native DeFi 协议，想上 Bybit。发一条冷启动 DM（不超过 4 句），拿到 intro call。",
      mustUse: ["reaching out because", "would love to explore", "quick call"]
    }
  },
  {
    id: 2,
    title: "Listing 跟进：对方一周没回消息",
    context: "上周发了 DM 给某 CEX BD，对方没回。现在你要发一条礼貌但有推进感的跟进消息。",
    tips: ["用 Just wanted to 软化语气", "提一件'新信息'给对方理由再看一眼", "不要质问为什么没回"],
    L1: {
      script: "Hi Mike, just wanted to follow up on my message from last week. We just closed a $5M strategic round led by Paradigm — thought this might be relevant context for the listing conversation. Would love to chat whenever you have time. No worries at all if the timing isn't right."
    },
    L2: {
      template: "Hi [对方名], just wanted to follow up on [你之前发的东西]. [一条新信息/进展] — thought this might be relevant. Would love to chat whenever you have time. No worries at all if [xx].",
      fields: ["对方名", "你之前发的东西", "一条新信息/进展", "xx"]
    },
    L3: {
      prompt: "你上周给 OKX 发了上币意向，对方没回。你们这周刚签了 Wintermute 做市商。写一条跟进消息，体现专业感和推进感。",
      mustUse: ["follow up", "just wanted to", "No worries"]
    }
  },
  {
    id: 3,
    title: "合作提案：跟一个 KOL 谈联合 AMA",
    context: "你想邀请一位有 50 万粉丝的 Web3 KOL 做联合 AMA，宣传你们项目的 TGE。第一次接触。",
    tips: ["先夸一下对方近期内容", "说清楚对他有什么好处", "给具体方案不要空谈"],
    L1: {
      script: "Hi Alex, big fan of your recent thread on restaking — super insightful. I'm Eason from RNS, and we're heading into TGE next month. I'd love to explore a joint AMA on X Spaces with you. We can offer a KOL allocation plus co-marketing support in exchange. Would you be open to a quick call to discuss?"
    },
    L2: {
      template: "Hi [KOL名], big fan of [对方最近内容]. I'm [你的名] from [项目名], and we're [当前节点]. I'd love to explore [合作形式] with you. We can offer [你的付出] in exchange. Would you be open to a quick call?",
      fields: ["KOL名", "对方最近内容", "你的名", "项目名", "当前节点", "合作形式", "你的付出"]
    },
    L3: {
      prompt: "你是一个 L2 项目的增长负责人。想邀请 @0xMert_ 做联合 Twitter Space，宣传 mainnet 上线。第一次接触，要够真诚、够具体。",
      mustUse: ["I'd love to explore", "in exchange"]
    }
  },
  {
    id: 4,
    title: "谈判：对方要求的解锁期太长",
    context: "投资方要求 4 年 vesting + 1 年 cliff。你觉得太长，想谈到 3 年 vesting + 6 个月 cliff。",
    tips: ["先表达理解", "再说为什么对你方困难", "给替代方案"],
    L1: {
      script: "Totally understand where you're coming from on the vesting — alignment matters for both sides. That said, 4 years plus a 1-year cliff is a bit of a stretch for us given our mainnet timeline. Would you be open to 3 years with a 6-month cliff? We can offer a lower round price in exchange to keep the effective IRR comparable."
    },
    L2: {
      template: "Totally understand where you're coming from on [议题]. That said, [对方要求] is a bit of a stretch for us given [你的原因]. Would you be open to [你的替代方案]? We can offer [你的让步] in exchange.",
      fields: ["议题", "对方要求", "你的原因", "你的替代方案", "你的让步"]
    },
    L3: {
      prompt: "CEX 要求 500k 上币费 + 3 个月专属营销承诺。你觉得 500k 太高。谈下来到 250k + 6 周专属，写一段谈判话术。",
      mustUse: ["Totally understand", "a bit of a stretch", "Would you be open to"]
    }
  },
  {
    id: 5,
    title: "会议收尾：明确 next steps",
    context: "一个 30 分钟的 intro call 快结束。要在 1-2 句话内总结 + 明确下一步行动。",
    tips: ["先感谢", "列 1-2 个具体下一步", "给时间节点"],
    L1: {
      script: "Thanks for taking the time today — really helpful. As next steps, let's do two things: I'll send over the tokenomics overview by end of day, and we'll get our legal teams connected this week. Great chatting — let's sync again after you've had a chance to review."
    },
    L2: {
      template: "Thanks for taking the time today. As next steps, let's [下一步 1] and [下一步 2]. I'll [你要做的] by [时间]. Great chatting — let's [再次对齐的方式].",
      fields: ["下一步 1", "下一步 2", "你要做的", "时间", "再次对齐的方式"]
    },
    L3: {
      prompt: "30 分钟谈完和 Wintermute 做市合作。你对他们的报价还不确定。自然收尾 + 安排下次 deeper call，不要过度承诺。",
      mustUse: ["Thanks for taking the time", "As next steps", "Let's"]
    }
  },
  {
    id: 6,
    title: "Intro call 开场：30 分钟 BD 电话怎么破冰",
    context: "Zoom intro call 刚接通。对方是某 tier-1 VC 投资合伙人。你要在前 60 秒内把破冰 + 议程说清楚。",
    tips: ["感谢 + 轻寒暄一句", "给出一个 30s 的自我&项目介绍", "主动抛议程，控制节奏"],
    L1: {
      script: "Hey Jake, thanks for making the time. Good to finally put a face to the name. For context, I'm Eason, BD at RNS — we're the decentralized identity layer you may have seen on your feed last week. For today I was thinking we could spend maybe 10 min on what we're building, 10 on the round, and save the last 10 for your questions. Does that work?"
    },
    L2: {
      template: "Hey [对方名], thanks for making the time. For context, I'm [你的名], [你的职位] at [项目名] — we're [一句话介绍]. For today I was thinking we spend maybe [时间1] on [话题1], [时间2] on [话题2], and save the rest for your questions. Does that work?",
      fields: ["对方名", "你的名", "你的职位", "项目名", "一句话介绍", "时间1", "话题1", "时间2", "话题2"]
    },
    L3: {
      prompt: "你和 Coinbase Ventures 的投资经理第一次 Zoom intro call。你们在做 AI + restaking 协议。60 秒内开场破冰 + 控节奏。",
      mustUse: ["thanks for making the time", "for context", "Does that work"]
    }
  },
  {
    id: 7,
    title: "讲 tokenomics：2 分钟把代币模型说清楚",
    context: "投资人问 'walk me through your token model'。你要结构化输出：供应、分配、释放、效用。",
    tips: ["先给一句话总纲", "分 3-4 个 bucket 说", "结尾收敛到价值捕获"],
    L1: {
      script: "Sure — at a high level, total supply is 1 billion, with roughly 40% going to the community, 20% team, 20% investors, and the rest to treasury and ecosystem. Team and investor tokens have a 1-year cliff and 3-year linear vest. On the demand side, the token captures value through protocol fees and staking rewards — the more volume the network processes, the more fees flow back to stakers. Happy to dig into any bucket you want."
    },
    L2: {
      template: "At a high level, total supply is [总量], with [社区占比] to the community, [团队占比] team, [投资人占比] investors, rest to [剩余用途]. Team and investors have [归属条款]. The token captures value through [价值捕获机制]. Happy to dig into any bucket.",
      fields: ["总量", "社区占比", "团队占比", "投资人占比", "剩余用途", "归属条款", "价值捕获机制"]
    },
    L3: {
      prompt: "向一个 Paradigm 的 analyst 解释你的 L2 代币模型：10 亿总量，55% 社区，15% 团队，25% 投资人，5% 基金会。用来支付 gas + 治理 + sequencer 奖励。",
      mustUse: ["at a high level", "captures value through", "dig into"]
    }
  },
  {
    id: 8,
    title: "委婉拒绝：对方要的 allocation 太多",
    context: "一个 KOL 开口要 $200k TGE 空投。你预算只有 $50k。要不伤关系地拒绝。",
    tips: ["先肯定对方价值", "拿出客观理由 / 公平性原则", "给一个你能给的版本"],
    L1: {
      script: "Really appreciate you putting a number on the table — it helps us move the conversation forward. That said, $200k is outside what we can commit to at this stage given our overall KOL budget and fairness to others already signed. What we can realistically offer is $50k in tokens plus priority access to our next round. Would that work as a starting point?"
    },
    L2: {
      template: "Really appreciate you putting a number on the table. That said, [对方要求] is outside what we can commit to given [原因]. What we can realistically offer is [你的方案]. Would that work as a starting point?",
      fields: ["对方要求", "原因", "你的方案"]
    },
    L3: {
      prompt: "一家 MM（做市商）要求独家 + 18 个月锁定 + 免费借 5M tokens。你只能给 2M + 非独家。礼貌推回去。",
      mustUse: ["appreciate", "outside what we can", "realistically offer"]
    }
  },
  {
    id: 9,
    title: "VC 冷邮件 pitch：30 秒读完就想回复",
    context: "给某 VC partner 发冷邮件求 intro call。邮件要短、有钩子、有社交证明、有 CTA。",
    tips: ["主题行要像个人写的不像群发", "第一句抓眼球", "3-4 句话讲清 what + why now", "一个明确 CTA"],
    L1: {
      script: "Subject: RNS — 30K users in 3 months, raising seed\n\nHi Jake, saw your recent post on identity being the next frontier — totally aligned with what we're building. I'm Eason, founder of RNS, a decentralized identity layer that's onboarded 30K users in 3 months with zero paid acquisition. We're opening a $5M seed next month and think Paradigm would be a natural fit given your thesis on social primitives. Would you be open to a 20-min intro call next week?"
    },
    L2: {
      template: "Subject: [项目名] — [一句成绩], raising [轮次]\n\nHi [对方名], saw your recent [内容] — totally aligned with [你的共鸣点]. I'm [你的名], [职位] at [项目名], [项目一句话 + 一个硬指标]. We're opening [轮次细节] and think [基金名] would be a natural fit given [对方特点]. Would you be open to a 20-min intro call next week?",
      fields: ["项目名", "一句成绩", "轮次", "对方名", "内容", "你的共鸣点", "你的名", "职位", "项目一句话 + 一个硬指标", "轮次细节", "基金名", "对方特点"]
    },
    L3: {
      prompt: "你是一个链上 AI Agent 基础设施项目创始人，30 天做到 10K daily active agents。给 Delphi Ventures 的 Anil 发 pitch 冷邮件，$3M seed。",
      mustUse: ["natural fit given", "Would you be open", "intro call"]
    }
  },
  {
    id: 10,
    title: "Twitter Space 主持开场：让听众进入状态",
    context: "你主持一场英文 Twitter Space，话题是 'Restaking Risks Explained'。嘉宾已上麦。开场 45 秒。",
    tips: ["欢迎 + 介绍话题 + 规则", "介绍嘉宾给他们立威", "抛第一个问题"],
    L1: {
      script: "Hey everyone, welcome to today's Space on Restaking Risks Explained. If you're just joining, feel free to hit the request button and we'll bring you up later. I'm Eason, and I'm thrilled to be joined by Alice from EigenLayer and Bob from Renzo — two of the sharpest minds working on this stack. To kick things off, Alice, from your seat, what's the single most misunderstood risk when people think about restaking today?"
    },
    L2: {
      template: "Hey everyone, welcome to today's Space on [话题]. If you're just joining, feel free to hit the request button. I'm [你的名], and I'm thrilled to be joined by [嘉宾 1] from [项目 1] and [嘉宾 2] from [项目 2]. To kick things off, [第一个嘉宾], [第一个问题]?",
      fields: ["话题", "你的名", "嘉宾 1", "项目 1", "嘉宾 2", "项目 2", "第一个嘉宾", "第一个问题"]
    },
    L3: {
      prompt: "主持 Space：'Stablecoins in 2026 — who wins?'。嘉宾：Circle 的 Dante、Ethena 的 Seraphim。开场 + 第一问。",
      mustUse: ["welcome to today's Space", "thrilled to be joined", "kick things off"]
    }
  },
  {
    id: 11,
    title: "危机公关：社区爆炸时的第一条推文",
    context: "你们前端刚出了一个 bug，有人误以为被黑。2 小时内社群炸锅。你要发第一条安抚推文。",
    tips: ["先承认问题", "给事实 + 资金安全性", "给时间线 + 承诺更新"],
    L1: {
      script: "We're aware of an issue affecting the front-end starting around 14:20 UTC. To be clear up front: no user funds are at risk — this is isolated to display logic. Our engineers are actively investigating and we've paused new deposits as a precaution. We'll share a full post-mortem within 24 hours. Thanks for your patience — we'll keep you posted every 30 minutes until resolved."
    },
    L2: {
      template: "We're aware of an issue affecting [范围] starting around [时间]. To be clear up front: [资金安全表述]. Our engineers are actively investigating and we've [采取的措施]. We'll share a full post-mortem within [时限]. We'll keep you posted every [更新频率] until resolved.",
      fields: ["范围", "时间", "资金安全表述", "采取的措施", "时限", "更新频率"]
    },
    L3: {
      prompt: "你们借贷协议的预言机被恶意操纵了，有 1.2M 坏账。两小时内 TVL 从 $80M 掉到 $40M。写第一条官方回应推文。",
      mustUse: ["We're aware of", "To be clear", "post-mortem"]
    }
  },
  {
    id: 12,
    title: "做市商谈判：议价 spread 和 token loan",
    context: "和 Wintermute 谈做市合作。他们要 borrow 3M tokens，spread 要 0.4%。你想谈到 2M token + 0.25% spread。",
    tips: ["先对齐双方目标", "把单一条件拆成 trade-off", "给一个 package deal"],
    L1: {
      script: "I think we're aligned on the broader goal — healthy order books on day one. Where I'd like to push back is on the 3M token loan. Given our circulating supply at TGE, 2M feels like a safer number for both sides. In exchange, I'm open to extending the loan term from 12 to 18 months. On spread, we're targeting 0.25% based on comps from Flowdesk and GSR — is that a range you can work with?"
    },
    L2: {
      template: "I think we're aligned on [共同目标]. Where I'd like to push back is on [你不同意的点]. Given [你的理由], [你的方案] feels safer. In exchange, I'm open to [你的让步]. On [另一个议题], we're targeting [你的目标] based on [参照]. Is that a range you can work with?",
      fields: ["共同目标", "你不同意的点", "你的理由", "你的方案", "你的让步", "另一个议题", "你的目标", "参照"]
    },
    L3: {
      prompt: "CEX listing 谈条件：他们要 $500k listing fee + 5M tokens marketing pool，你想压到 $250k + 2M tokens + 共同 AMA。",
      mustUse: ["aligned on", "push back", "In exchange"]
    }
  },
  {
    id: 13,
    title: "技术集成对接：和对方 dev 对齐接口",
    context: "和一个 wallet 项目集成，对方 tech lead 在 Slack 群里。你要确认 API 规格和上线时间。",
    tips: ["先把需求 1-2-3 列清", "给 timeline 和依赖", "确认 point of contact"],
    L1: {
      script: "Hey team, quick sync on the integration. On our side we need three things: 1) your SDK version that supports EIP-7702, 2) a staging endpoint we can point to, and 3) a rate-limit spec. We're targeting a joint launch on April 20 — to hit that we'd need your side ready by April 10 for integration testing. Could you point me to a tech DRI on your end?"
    },
    L2: {
      template: "Hey team, quick sync on the integration. On our side we need: 1) [需求1], 2) [需求2], 3) [需求3]. We're targeting [上线日期] — to hit that we'd need your side ready by [对方截止]. Could you point me to a [对接人角色] on your end?",
      fields: ["需求1", "需求2", "需求3", "上线日期", "对方截止", "对接人角色"]
    },
    L3: {
      prompt: "和 Privy 对接 embedded wallet。你需要他们的 React SDK + 白标配置 + rate limit 放到 100 req/s。5 月 15 日联合发布。",
      mustUse: ["quick sync", "targeting", "point me to"]
    }
  },
  {
    id: 14,
    title: "催款 / 合同争议：对方逾期付款",
    context: "你给某交易所提供咨询服务，他们延迟 30 天还没付款。要在保持关系前提下催。",
    tips: ["陈述事实不情绪化", "给 invoice 编号 + 到期日", "明确期望下一步和 deadline"],
    L1: {
      script: "Hi Mike, circling back on invoice #INV-0423 which was due March 15 — I've not seen it come through yet on our side. Could you help me check where it sits in your AP process? Happy to re-send the invoice if needed. Ideally we'd like to get this settled by end of this week so we can keep the engagement moving smoothly."
    },
    L2: {
      template: "Hi [对方名], circling back on [单据号] which was due [到期日]. Could you help me check where it sits in your [流程]? Happy to [补救动作]. Ideally we'd like to get this settled by [希望日期] so we can [下一步目标].",
      fields: ["对方名", "单据号", "到期日", "流程", "补救动作", "希望日期", "下一步目标"]
    },
    L3: {
      prompt: "对方 45 天没付 $80k 顾问费。想要在不撕破脸的前提下把语气加重一档，提到会暂停下阶段工作。",
      mustUse: ["circling back", "where it sits", "settled by"]
    }
  },
  {
    id: 15,
    title: "会议结束后 follow-up email：6 小时内发出去",
    context: "刚和一个潜在战略投资方开完 45 分钟 Zoom。要在当天发一封结构化 follow-up 邮件。",
    tips: ["主题行放会议日期 + 话题", "summary + next steps + 附件", "别废话"],
    L1: {
      script: "Subject: Recap & next steps — RNS x Paradigm (Apr 16)\n\nHi Jake, really enjoyed the conversation today. Quick recap of what we aligned on: (1) you'll review our tokenomics deck internally this week, (2) we'll share the audit report by Thursday, and (3) we'll reconvene next Monday with your investment committee. Attaching the deck and a one-pager for easy sharing. Let me know if anything else would be helpful — thanks again for the time."
    },
    L2: {
      template: "Subject: Recap & next steps — [你方] x [对方] ([日期])\n\nHi [对方名], really enjoyed the conversation today. Quick recap of what we aligned on: (1) [下一步1], (2) [下一步2], (3) [下一步3]. Attaching [附件]. Let me know if anything else would be helpful — thanks again for the time.",
      fields: ["你方", "对方", "日期", "对方名", "下一步1", "下一步2", "下一步3", "附件"]
    },
    L3: {
      prompt: "刚和 Binance Listing BD 做完 60 分钟 intro call。aligned on：发 pitch deck、14 天内给法律合规问卷、下周三二次会议。写 follow-up email。",
      mustUse: ["Quick recap", "aligned on", "Attaching"]
    }
  }
];
