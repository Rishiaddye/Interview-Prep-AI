import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/session`;

// ==============================
// CREATE SESSION
// ==============================
export const createSession = async ({ role, experience, topics }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token");

    const res = await axios.post(
      `${API_URL}/create`,
      { role, experience, topics },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ RETURN SESSION ID CORRECTLY
    return res.data; // { ok: true, session }
  } catch (err) {
    console.error("Create session error:", err.response?.data || err.message);
    return null;
  }
};

// ==============================
// GET SESSION
// ==============================
export const getSession = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Get session error:", err);
    return null;
  }
};
