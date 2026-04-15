import { getSetting } from "./storage.js";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.0-flash";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

export const GEMINI_VOICES = [
  { id: "Kore", label: "Kore · 沉稳女声" },
  { id: "Puck", label: "Puck · 活泼男声" },
  { id: "Charon", label: "Charon · 磁性男声" },
  { id: "Fenrir", label: "Fenrir · 低沉男声" },
  { id: "Aoede", label: "Aoede · 明亮女声" },
  { id: "Leda", label: "Leda · 温柔女声" },
  { id: "Orus", label: "Orus · 稳重男声" },
  { id: "Zephyr", label: "Zephyr · 轻快女声" }
];

export const GEMINI_STYLES = [
  { id: "neutral", label: "中性", prefix: "Read aloud in a natural, clear voice: " },
  { id: "bd", label: "BD 专业口吻", prefix: "Read aloud in a confident, professional business development tone, like you're pitching to a tier-one exchange: " },
  { id: "friendly", label: "友好自然", prefix: "Read aloud in a friendly, conversational tone, like you're chatting with a colleague: " },
  { id: "excited", label: "兴奋 / 产品宣讲", prefix: "Read aloud with excitement and enthusiasm, like you're announcing a mainnet launch: " },
  { id: "serious", label: "严肃 / 谈判", prefix: "Read aloud with a serious, firm tone, like negotiating term sheet conditions: " },
  { id: "slow", label: "清晰慢速（学习用）", prefix: "Read aloud slowly and clearly, enunciating every word, for an English learner: " }
];

function requireKey() {
  const key = getSetting("geminiKey");
  if (!key) throw new Error("请在「设置」里填入 Gemini API Key");
  return key;
}

async function callGemini(prompt, { json = false, model = DEFAULT_MODEL } = {}) {
  const key = requireKey();
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4 }
  };
  if (json) body.generationConfig.responseMimeType = "application/json";

  const res = await fetch(`${GEMINI_URL}/${model}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 返回空结果");
  return json ? JSON.parse(text) : text;
}

export async function reviewWriting(userText, context = "") {
  const prompt = `你是一位 Web3 圈子的商务英语教练。下面是学生写的一段英文（${context || "一般商务场景"}）。

学生的原句：
"""
${userText}
"""

请用 JSON 返回批改结果，字段：
{
  "original": 学生原句,
  "corrected": 修正后的自然表达（如果已经足够好，就重写一个更地道的版本）,
  "issues": [{ "type": "语法|Chinglish|词块误用|语气不当", "quote": 有问题的片段, "why": 用中文简要说明 }],
  "alternatives": [3 个同义但不同风格的地道说法],
  "score": 0-100 的综合分数
}

只返回 JSON，不要任何 markdown 包装。`;
  return callGemini(prompt, { json: true });
}

export async function lookupWord(word) {
  const prompt = `查词：英文单词或短语「${word}」。用 JSON 返回：
{
  "ipa": 美式音标（带/../包裹），
  "pos": 词性中文（如 名词/动词/形容词/短语）,
  "zh": 中文意思（Web3/商务语境优先，若是通用词就给通用含义）,
  "example": 一个 Web3 或商务场景的英文短例句,
  "exampleZh": 例句的中文翻译
}
只返回 JSON。`;
  return callGemini(prompt, { json: true });
}

export async function explainChunk(chunk) {
  const prompt = `用中文讲解 Web3 商务英语短语「${chunk}」：

1. 字面 / 行业引申含义
2. 两个真实 Web3 场景下的英文例句（标注 listing / BD / fundraise 等场景）
3. 一个常见误用或中式英语对照

简洁，每条 1-2 句。`;
  return callGemini(prompt);
}

export async function generateTasksFromContent(content, sourceLabel = "Twitter") {
  const prompt = `下面是来自 ${sourceLabel} 的一段 Web3 行业真实内容：

"""
${content}
"""

作为商务英语教练，请用 JSON 返回 3 个从简到难的英文写作/口语练习任务：

{
  "summary_zh": 30 字内中文概括这条内容讲了什么,
  "key_chunks": [3-5 个值得学习的英文短语/搭配，每个含 { "en": 英文, "zh": 中文 }],
  "tasks": [
    { "level": "简单", "prompt": 用中文描述任务要求，让学生用英文做, "sample_hint": 2-3 个可用表达 },
    { "level": "中等", "prompt": ..., "sample_hint": ... },
    { "level": "困难", "prompt": ..., "sample_hint": ... }
  ]
}

只返回 JSON。`;
  return callGemini(prompt, { json: true });
}

async function blobToBase64(blob) {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export async function reviewPronunciation(audioBlob, targetText) {
  const key = requireKey();
  const mimeType = audioBlob.type || "audio/webm";
  const b64 = await blobToBase64(audioBlob);

  const prompt = `你是英语发音教练。下面是学生朗读这句英文的录音：
"${targetText}"

请评估学生的朗读，用 JSON 返回：
{
  "transcript": 你听到学生实际念出的内容（英文原文）,
  "score": 0-100 的发音综合分,
  "accuracy_zh": 1-2 句中文总体评价,
  "issues": [ { "word": 发音有问题的单词, "expected_ipa": 标准美式音标, "heard": 你听到的实际发音（用拼写或音标描述）, "tip": 中文改进建议 } ],
  "strengths": [ 1-2 条做得好的地方（中文）]
}

如果录音完全不可辨识，score 设为 0 并在 accuracy_zh 说明。只返回 JSON。`;

  const body = {
    contents: [{
      role: "user",
      parts: [
        { text: prompt },
        { inlineData: { mimeType, data: b64 } }
      ]
    }],
    generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
  };

  const res = await fetch(`${GEMINI_URL}/${DEFAULT_MODEL}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 返回空结果");
  return JSON.parse(text);
}

function pcmToWavBlob(pcmBytes, sampleRate = 24000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = pcmBytes.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset, s) => { for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i)); };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  new Uint8Array(buffer, 44).set(pcmBytes);
  return new Blob([buffer], { type: "audio/wav" });
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function synthesizeSpeech(text, { voice = "Kore", styleId = "neutral" } = {}) {
  const key = requireKey();
  const style = GEMINI_STYLES.find(s => s.id === styleId) || GEMINI_STYLES[0];
  const fullText = style.prefix + text;

  const body = {
    contents: [{ parts: [{ text: fullText }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
    }
  };

  const res = await fetch(`${GEMINI_URL}/${TTS_MODEL}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const msg = (await res.text()).slice(0, 240);
    throw new Error(`TTS ${res.status}: ${msg}`);
  }
  const data = await res.json();
  const b64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error("Gemini TTS 返回空音频");
  const pcm = base64ToBytes(b64);
  return pcmToWavBlob(pcm, 24000);
}
