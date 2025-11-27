import axiosInstance from "../apis/axiosInstance";
import axios from "axios";

const client = axiosInstance || axios;

export async function createSession(payload) {
  try {
    const res = await client.post("/sessions", payload);
    return res.data;
  } catch (err) {
    console.error("createSession error:", err?.response?.data || err.message);
    throw err;
  }
}

export async function getSession(id) {
  try {
    const res = await client.get(`/sessions/${id}`);
    return { ok: true, session: res.data };
  } catch (err) {
    return { ok: false, error: err?.response?.data || err.message };
  }
}

export async function learnMoreForQuestion(sessionId, question) {
  try {
    const res = await client.post(`/ai/learn`, { sessionId, question });
    return res.data;
  } catch (err) {
    console.error("learnMore error:", err?.response?.data || err.message);
    return null;
  }
}

export default {
  createSession,
  getSession,
  learnMoreForQuestion,
};
