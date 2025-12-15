// backend/services/aiService.js
require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==========================================
// HELPERS
// ==========================================
function extractText(resp) {
  try {
    return resp.choices?.[0]?.message?.content || "";
  } catch {
    return "";
  }
}

function cleanJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'")
    .trim();
}

function safeParseJSONArray(text) {
  try {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) return [];
    return JSON.parse(text.substring(start, end + 1));
  } catch {
    return [];
  }
}

// ==========================================
// 1️⃣ INTERVIEW QUESTIONS (10 Q&A)
// ==========================================
async function generateInterview(role, experience, topics = []) {
  const prompt = `
Generate EXACTLY 10 interview questions.

Role: ${role}
Experience: ${experience}
Topics: ${topics.join(", ")}

Return STRICT JSON ONLY:

[
  {
    "q": "question",
    "a": "answer",
    "followup": "optional follow-up",
    "why": "why this matters"
  }
]
`;

  try {
    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = cleanJSON(extractText(resp));
    const data = safeParseJSONArray(text);

    return data.length === 10 ? data : [];
  } catch (err) {
    console.error("AI generateInterview ERROR:", err);
    return [];
  }
}

// ==========================================
// 2️⃣ LEARN MORE (LONG HTML EXPLANATION)
// ==========================================
async function generateLearnMore(question) {
  const prompt = `
Write a LONG, detailed explanation in HTML.

RULES:
- Return ONLY HTML
- Use <h2>, <p>, <ul>, <li>
- No markdown
- No JSON

Question:
${question}
`;

  try {
    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = extractText(resp).trim();

    return text.includes("<")
      ? text
      : `<p>${text}</p>`;
  } catch (err) {
    console.error("AI generateLearnMore ERROR:", err);
    return `<p><strong>AI failed:</strong> ${err.message}</p>`;
  }
}

// ==========================================
// 3️⃣ MCQs (EXACTLY 10)
// ==========================================
async function generateMCQs(role, experience, topics = []) {
  const prompt = `
Generate EXACTLY 10 MCQs.

Role: ${role}
Experience: ${experience}
Topics: ${topics.join(", ")}

Return STRICT JSON ONLY:

[
  {
    "question": "text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]
`;

  try {
    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = cleanJSON(extractText(resp));
    const data = safeParseJSONArray(text);

    return data.length === 10 ? data : [];
  } catch (err) {
    console.error("AI generateMCQs ERROR:", err);
    return [];
  }
}

module.exports = {
  generateInterview,
  generateLearnMore,
  generateMCQs,
};
