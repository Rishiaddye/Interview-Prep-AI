import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";
import Input from "../../components/inputs/input.jsx";

import { auth, googleProvider } from "../../firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ safe mobile detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const redirectHandled = useRef(false);

  const { login } = useUser();
  const navigate = useNavigate();

  // =========================
  // HANDLE GOOGLE REDIRECT (MOBILE)
  // =========================
  useEffect(() => {
    const handleRedirect = async () => {
      if (redirectHandled.current) return;

      try {
        const result = await getRedirectResult(auth);
        if (!result?.user) return;

        redirectHandled.current = true;
        await sendGoogleUserToBackend(result.user);
      } catch (err) {
        console.error(err);
        setError("Google login failed. Try again.");
        setGoogleLoading(false);
      }
    };

    handleRedirect();
  }, []);

  const sendGoogleUserToBackend = async (user) => {
    const res = await fetch(`${API_URL}/auth/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Google login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    login(data.user);

    navigate("/dashboard", { replace: true });
  };

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
      setLoginLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login(data.user);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
      setLoginLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setGoogleLoading(true);

      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      await sendGoogleUserToBackend(result.user);
    } catch {
      setError("Google login failed. Try again.");
      setGoogleLoading(false);
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
        {/* Close */}
        <button
          onClick={() => setCurrentPage(null)}
          disabled={googleLoading || loginLoading}
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
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: "center" }}>
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

          {/* LOGIN BUTTON WITH SPINNER */}
          <button
            type="submit"
            disabled={loginLoading}
            style={{
              width: "100%",
              marginTop: 18,
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(180deg,#000,#1c1c1c)",
              color: "#fff",
              fontWeight: 700,
              cursor: loginLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loginLoading && (
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid #bbb",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            {loginLoading ? "Logging in…" : "LOGIN"}
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

        {/* GOOGLE BUTTON WITH SPINNER */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 12,
            border: "1px solid #e0e0e0",
            background: "#fafafa",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: googleLoading ? "not-allowed" : "pointer",
          }}
        >
          {googleLoading ? (
            <div
              style={{
                width: 18,
                height: 18,
                border: "2px solid #ccc",
                borderTop: "2px solid #333",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
          )}
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        {/* SIGN UP */}
        <p style={{ marginTop: 18, fontSize: 14, textAlign: "center" }}>
          Don’t have an account?{" "}
          <span
            style={{
              color: "#FF9324",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </span>
        </p>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
