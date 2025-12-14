// services/aiService.js
require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Extract text safely
function extractText(resp) {
  try {
    return resp.choices?.[0]?.message?.content || "";
  } catch (e) {
    return "";
  }
}

// Safe JSON cleaner to prevent crashes
function cleanJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/“|”/g, '"')
    .replace(/‘|’/g, "'")
    .trim();
}

/* ===========================================================
   1. Generate Interview Questions (10 Q&A)
=========================================================== */

async function generateInterview(role, experience, topics = []) {
  const prompt = `
Generate EXACTLY 10 professional interview questions for:
Role: ${role}
Experience: ${experience}
Topics: ${Array.isArray(topics) ? topics.join(", ") : topics}

Return STRICT JSON ONLY:

[
  {
    "q": "question",
    "a": "high-quality answer",
    "followup": "optional follow-up question",
    "why": "explain why this question matters"
  }
]

Do NOT include any text outside the JSON.
`;

  try {
    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    let text = cleanJSON(extractText(resp));

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start !== -1 && end !== -1) {
      const jsonString = text.substring(start, end + 1);
      return JSON.parse(jsonString);
    }

    return [{ q: "Parsing Error", a: text }];
  } catch (err) {
    console.error("AI ERROR (generateInterview):", err);
    return [{ q: "AI Failed", a: err.message }];
  }
}

/* ===========================================================
   2. Generate MCQs (10 MCQs)
=========================================================== */

async function generateMCQs(sessionQuestions) {
  const prompt = `
Create EXACTLY 10 multiple-choice questions based ONLY on this Q&A list:

${JSON.stringify(sessionQuestions, null, 2)}

Each question must have 4 options and 1 correct answer.

Return STRICT JSON ONLY:

[
  {
    "q": "question",
    "options": ["a", "b", "c", "d"],
    "correctIndex": 1
  }
]
`;

  try {
    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    let text = cleanJSON(extractText(resp));

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start !== -1 && end !== -1) {
      const jsonString = text.substring(start, end + 1);
      return JSON.parse(jsonString);
    }

    return [];
  } catch (err) {
    console.error("AI ERROR (generateMCQs):", err);
    return [];
  }
}

/* ===========================================================
   3. Generate Long Explanation (HTML)
=========================================================== */

async function generateLongExplanation(question, shortAnswer) {
  const prompt = `
Write a LONG, structured HTML explanation.

STRICT RULES:
- MUST return ONLY HTML (no markdown, no JSON)
- Include <h2>, <p>, <ul>, <li>

Question: ${question}
Short Answer: ${shortAnswer}

Return ONLY HTML.
`;

  try {
    const resp = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const text = extractText(resp).trim();

    return text.includes("<") ? text : `<p>${text}</p>`;
  } catch (err) {
    console.error("AI ERROR (generateLongExplanation):", err);
    return `<p><strong>AI Failed:</strong> ${err.message}</p>`;
  }
}

module.exports = {
  generateInterview,
  generateMCQs,
  generateLongExplanation
};
