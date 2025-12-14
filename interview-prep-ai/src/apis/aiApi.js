// frontend/src/apis/aiApi.js

import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

export const generateQuestions = async (role, experience, topics) => {
  try {
    const res = await axios.post(`${API_URL}/generate`, {
      role,
      experience,
      topics,
    });

    console.log("✅ Backend AI response (generate):", res.data);
    return res.data.questions || [];
  } catch (err) {
    console.log("❌ AI API Error (generate):", err.response?.data || err.message);
    return [];
  }
};

export const learnMore = async (question, answer) => {
  try {
    const res = await axios.post(`${API_URL}/learn`, { question, answer });

    console.log("✅ Backend AI response (learn):", res.data);
    return res.data.longAnswer || "<p>No detailed explanation available.</p>";
  } catch (err) {
    console.error("❌ Learn API Error:", err.response?.data || err.message);
    return "<p>AI explanation failed.</p>";
  }
};

export const generateMCQs = async (questions) => {
  try {
    const res = await axios.post(`${API_URL}/mcq`, { questions });

    console.log("✅ Backend AI response (mcq):", res.data);
    return res.data.mcqs || [];
  } catch (err) {
    console.error("❌ MCQ API Error:", err.response?.data || err.message);
    return [];
  }
};
