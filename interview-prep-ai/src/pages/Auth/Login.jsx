import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";
import Input from "../../components/inputs/input.jsx";

import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useUser();
  const navigate = useNavigate();

  // =========================
  // EMAIL / PASSWORD LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      return setError("All fields are required");
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      login(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const res = await fetch(`${API_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: result.user.displayName,
          email: result.user.email,
          profilePic: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      login(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Welcome Back 👋
        </h2>
        <p style={{ opacity: 0.6, marginBottom: 20 }}>
          Please enter your details to continue.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            label="Email Address"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "red", fontSize: 13, marginTop: 6 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: 16,
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(90deg,#000,#222)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            LOGIN
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "11px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#f9f9f9",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Don’t have an account?{" "}
          <span
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
