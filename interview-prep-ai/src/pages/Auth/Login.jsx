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
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3000,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          borderRadius: 20,
          padding: "28px 26px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
        }}
      >
        {/* ❌ CLOSE BUTTON (ADDED – SAME AS SIGNUP) */}
        <button
          onClick={() => setCurrentPage(null)}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            background: "#f2f2f2",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: "34px",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          Welcome Back 👋
        </h2>

        <p
          style={{
            textAlign: "center",
            opacity: 0.65,
            fontSize: 14,
            marginBottom: 22,
          }}
        >
          Please enter your details to continue
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
            <div
              style={{
                marginTop: 10,
                padding: "8px 10px",
                borderRadius: 8,
                background: "#ffecec",
                color: "#d63031",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: 18,
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(180deg,#000,#1c1c1c)",
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 0.3,
              cursor: "pointer",
            }}
          >
            LOGIN
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "18px 0",
            opacity: 0.5,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#ddd" }} />
          <span style={{ fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#ddd" }} />
        </div>

     <button
  onClick={handleGoogleLogin}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #e0e0e0",
    background: "#fafafa",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  }}
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
    style={{ width: 20, height: 20 }}
  />
  Continue with Google
</button>


        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Don’t have an account?{" "}
          <span
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: 600,
            }}
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
