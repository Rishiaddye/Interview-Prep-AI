import axios from "axios";

const API_URL = "http://localhost:5000/api/session";

export const createSession = async (sessionData) => {
  try {
    const res = await axios.post(`${API_URL}/create`, sessionData);
    return res.data;
  } catch (err) {
    console.log("❌ Create Session Error:", err);
    return null;
  }
};

export const getSession = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);

    // FIX: return only actual session object
    return { ok: true, session: res.data.session };
  } catch (err) {
    console.log("❌ Get Session Error:", err);
    return { ok: false, error: err };
  }
};
