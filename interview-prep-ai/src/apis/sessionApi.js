import axios from "axios";

// ✅ Use env-based backend URL
const API_URL = `${import.meta.env.VITE_API_URL}/session`;

// ==============================
// CREATE SESSION (JWT PROTECTED)
// ==============================
export const createSession = async ({ role, experience, topics }) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await axios.post(
      `${API_URL}/create`,
      {
        role,
        experience,
        topics, // ❌ DO NOT send userId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data; // { ok: true, session }
  } catch (err) {
    console.error("❌ Create Session Error:", err.response?.data || err.message);
    return null;
  }
};

// ==============================
// GET SESSION BY ID
// ==============================
export const getSession = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { ok: true, session: res.data.session };
  } catch (err) {
    console.error("❌ Get Session Error:", err.response?.data || err.message);
    return { ok: false, error: err };
  }
};
