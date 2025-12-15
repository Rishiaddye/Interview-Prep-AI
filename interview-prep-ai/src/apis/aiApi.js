// frontend/src/apis/aiApi.js

import axios from "axios";

// ✅ Use ENV backend URL (Render)
const API_URL = `${import.meta.env.VITE_API_URL}/ai`;

// ===================================================
// GENERATE INTERVIEW QUESTIONS
// ===================================================
export const generateQuestions = async ({ role, experience, topics }) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_URL}/generate`,
      { role, experience, topics },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Generate Questions Response:", res.data);

    // Backend returns: { ok: true, questions }
    return res.data.questions || [];
  } catch (err) {
    console.error(
      "❌ Generate Questions Error:",
      err.response?.data || err.message
    );
    return [];
  }
};

// ===================================================
// LEARN MORE (LONG EXPLANATION)
// ===================================================
export const learnMore = async (question) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_URL}/learn-more`,
      { question },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Learn More Response:", res.data);

    // Backend returns: { ok: true, explanation }
    return res.data.explanation;
  } catch (err) {
    console.error(
      "❌ Learn More Error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// ===================================================
// GENERATE MCQs (TEST YOURSELF)
// ===================================================
export const generateMCQs = async ({ role, experience, topics }) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_URL}/mcqs`,
      { role, experience, topics },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ MCQ Response:", res.data);

    // Backend returns: { ok: true, mcqs }
    return res.data.mcqs || [];
  } catch (err) {
    console.error(
      "❌ MCQ Error:",
      err.response?.data || err.message
    );
    return [];
  }
};
