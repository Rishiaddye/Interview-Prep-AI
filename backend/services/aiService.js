// services/aiService.js
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = process.env.GEMINI_API_URL;

async function generateInterview(role, experience, topics = []) {
  const prompt = `
Generate 8 interview questions for role: ${role}
Experience: ${experience}
Topics: ${Array.isArray(topics) ? topics.join(", ") : topics}

Return JSON only as an array:
[
  { "q": "...", "a": "...", "followup": "...", "why": "..." }
]
`;

  try {
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start !== -1 && end !== -1) {
      const parsed = JSON.parse(text.substring(start, end + 1));
      return parsed.map(item => ({
        question: item.q,
        answer: item.a,
        followup: item.followup,
        why: item.why
      }));
    }

    return [{ question: "Parse error", answer: text }];
  } catch (err) {
    console.error("AI ERROR (generateInterview):", err.response?.data || err.message);
    return [{ question: "AI failed", answer: err.message }];
  }
}

/* ===========================================================
   NEW — Generate MCQs From Session Q&A
   =========================================================== */
async function generateMCQs(sessionQuestions) {
  const prompt = `
You are an expert MCQ generator.

Create 10 multiple-choice questions based ONLY on the following Q&A list.
Make options SHORT (one word or one short phrase).
Make sure all MCQs are relevant to Android/Java/Kotlin topics in the list.

Q&A list:
${JSON.stringify(sessionQuestions, null, 2)}

Return JSON IN EXACT FORMAT below:

[
  {
    "q": "question text",
    "options": ["option1", "option2", "option3", "option4"],
    "correctIndex": 0
  }
]
`;

  try {
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start !== -1 && end !== -1) {
      return JSON.parse(text.substring(start, end + 1));
    }

    return [];
  } catch (err) {
    console.error("AI ERROR (generateMCQs):", err.response?.data || err.message);
    return [];
  }
}

async function generateLongExplanation(question, shortAnswer) {
  const prompt = `
You are an expert interview coach. Given the question and a concise answer,
produce a long, structured "Learn More" explanation formatted in HTML.

Question: ${question}
Short answer: ${shortAnswer}

Return HTML only.
`;

  try {
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const htmlStart = text.indexOf("<");
    if (htmlStart !== -1) return text.substring(htmlStart);

    return `<div>${text.replace(/\n/g, "<br/>")}</div>`;
  } catch (err) {
    console.error("AI ERROR (generateLongExplanation):", err.response?.data || err.message);
    return `<p><strong>AI failed:</strong> ${err.message}</p>`;
  }
}

module.exports = {
  generateInterview,
  generateMCQs,
  generateLongExplanation
};
