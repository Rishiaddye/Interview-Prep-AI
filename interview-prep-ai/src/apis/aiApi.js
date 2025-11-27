import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

export const generateQuestions = async (role, experience, topics) => {
  try {
    const res = await axios.post(`${API_URL}/generate`, {
      role,
      experience,
      topics,
    });
    return res.data.questions;
  } catch (err) {
    console.log("❌ AI API Error:", err);
    return [];
  }
};
