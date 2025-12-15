import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";
import Input from "../../components/inputs/input.jsx";

import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

// 🔥 Backend URL from Vite env
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

      // ✅ SAVE JWT TOKEN (CRITICAL)
      localStorage.setItem("token", data.token);

      // ✅ SAVE USER
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

      // ✅ SAVE JWT TOKEN
      localStorage.setItem("token", data.token);

      // ✅ SAVE USER
      login(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-2 py-4">
      <h3 className="text-lg font-semibold">Welcome Back 👋</h3>

      <form onSubmit={handleLogin} className="w-full mt-4">
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded mt-4"
        >
          LOGIN
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="w-full mt-3 border py-2 rounded"
      >
        Continue with Google
      </button>

      <p className="mt-3 text-sm">
        Don’t have an account?{" "}
        <button
          onClick={() => setCurrentPage("signup")}
          className="underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
