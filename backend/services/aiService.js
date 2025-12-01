// services/aiService.js
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = process.env.GEMINI_API_URL; // e.g. https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

function extractTextFromResponse(respData) {
  // Safe extraction for several common shapes
  try {
    // logging for debugging — keep while developing and remove in production
    console.log("🔍 Gemini raw response (short):", JSON.stringify(respData?.candidates?.[0]?.content?.parts?.[0]?.text || respData?.output || respData, null, 2));

    const candidateText =
      respData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      respData?.candidates?.[0]?.content?.[0]?.parts?.[0]?.text ||
      respData?.output?.[0]?.content?.parts?.[0]?.text ||
      respData?.output?.[0]?.content?.[0]?.parts?.[0]?.text ||
      "";

    return candidateText;
  } catch (e) {
    console.error("Error extracting text from response:", e);
    return "";
  }
}

async function callGemini(promptPayload) {
  if (!API_KEY || !API_URL) {
    throw new Error("Gemini API key or URL not configured in .env");
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptPayload }]
      }
    ]
  };

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": API_KEY
  };

  const resp = await axios.post(API_URL, body, { headers, timeout: 30000 });
  return resp.data;
}

/* ===========================================================
   1. Generate Interview Questions
   =========================================================== */
async function generateInterview(role, experience, topics = []) {
const prompt = `
Generate EXACTLY 20 professional interview questions for:

Role: ${role}
Experience: ${experience}
Topics: ${Array.isArray(topics) ? topics.join(", ") : topics}

Format response as a STRICT JSON array with NO explanations outside JSON:

[
  {
    "q": "question",
    "a": "high-quality answer",
    "followup": "optional follow-up question",
    "why": "explain why this question matters"
  }
]
`;


  try {
    const respData = await callGemini(prompt);
    let text = extractTextFromResponse(respData);

    // Remove fenced code markers if present
    text = text.replace(/```json|```/g, "").trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start !== -1 && end !== -1) {
      const parsed = JSON.parse(text.substring(start, end + 1));
      return parsed.map(item => ({
        question: item.q || item.question || "",
        answer: item.a || item.answer || "",
        followup: item.followup || "",
        why: item.why || ""
      }));
    }

    // fallback: return raw text in an error-shaped object
    return [{ question: "Parsing Error", answer: text }];
  } catch (err) {
    console.error("AI ERROR (generateInterview):", err.response?.data || err.message);
    return [{ question: "AI failed", answer: err.response?.data?.error?.message || err.message }];
  }
}

/* ===========================================================
   2. Generate MCQs From Session Q&A
   =========================================================== */
async function generateMCQs(sessionQuestions) {
  const prompt = `
You are an expert quiz generator.

Create EXACTLY 20 multiple-choice questions based ONLY on this Q&A list:
${JSON.stringify(sessionQuestions, null, 2)}

Each question must have 4 options, with one correct answer.
Keep options short (one word or short phrase).

Return JSON EXACTLY in this format:
[
  {
    "q": "question text",
    "options": ["option1", "option2", "option3", "option4"],
    "correctIndex": 0
  }
]
`;

  try {
    const respData = await callGemini(prompt);
    let text = extractTextFromResponse(respData);
    text = text.replace(/```json|```/g, "").trim();

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

/* ===========================================================
   3. Generate Long Explanations
   =========================================================== */
async function generateLongExplanation(question, shortAnswer) {
  const prompt = `
You are an experienced interview mentor.
Given the question and a short answer, generate a long, structured HTML explanation
for learning purposes.

Question: ${question}
Answer: ${shortAnswer}

Return HTML only (no markdown, no JSON).
`;

  try {
    const respData = await callGemini(prompt);
    const text = extractTextFromResponse(respData);
    const htmlStart = text.indexOf("<");
    if (htmlStart !== -1) return text.substring(htmlStart);
    return `<div>${text.replace(/\n/g, "<br/>")}</div>`;
  } catch (err) {
    console.error("AI ERROR (generateLongExplanation):", err.response?.data || err.message);
    return `<p><strong>AI failed:</strong> ${err.response?.data?.error?.message || err.message}</p>`;
  }
}

module.exports = {
  generateInterview,
  generateMCQs,
  generateLongExplanation
};
