// backend/services/aiService.js
require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =================================================
// HELPERS
// =================================================
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

// =================================================
// 1️⃣ INTERVIEW QUESTIONS (10 Q&A)
// =================================================
async function generateInterview(role, experience, topics = []) {
  const prompt = `
Generate EXACTLY 10 professional interview questions.

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

// =================================================
// 2️⃣ LEARN MORE (HTML)
// =================================================
async function generateLearnMore(question) {
  const prompt = `
Write a LONG, structured explanation in HTML.

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
    return text.includes("<") ? text : `<p>${text}</p>`;
  } catch (err) {
    console.error("AI generateLearnMore ERROR:", err);
    return `<p><strong>AI failed:</strong> ${err.message}</p>`;
  }
}

// =================================================
// 3️⃣ MCQs (EXACTLY 10 – FIXED)
// =================================================
async function generateMCQs(sessionQuestions = []) {
  if (!Array.isArray(sessionQuestions) || sessionQuestions.length === 0) {
    return [];
  }

  const prompt = `
Create EXACTLY 10 multiple-choice questions
based ONLY on the following interview Q&A.

${JSON.stringify(sessionQuestions, null, 2)}

Rules:
- 4 options per question
- One correct answer
- Professional difficulty

Return STRICT JSON ONLY:

[
  {
    "q": "question",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0
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
    let mcqs = safeParseJSONArray(text);

    // 🔒 FORCE EXACTLY 10
    if (mcqs.length > 10) mcqs = mcqs.slice(0, 10);

    return mcqs.length === 10 ? mcqs : [];
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
