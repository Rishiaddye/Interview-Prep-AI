import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext.jsx";
import Input from "../../components/inputs/input.jsx";

import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      return setError("All fields are required.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return setError(data.message || "Invalid login.");

      const loggedUser = {
        id: data.user?.id,
        fullName: data.user?.fullName,
        email: data.user?.email,
        profilePic: data.user?.profilePic || "/default-avatar.png",
      };

      login(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));

      alert("🎉 Login Successful!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);
      setError("Server error. Please check backend connection.");
    }
  };

  // ⭐ GOOGLE LOGIN FUNCTION
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const googleUser = {
        fullName: result.user.displayName,
        email: result.user.email,
        profilePic: result.user.photoURL,
      };

      login(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));

      alert("🎉 Logged in with Google!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-2 py-4">
      <h3 className="text-lg font-semibold text-black">Welcome Back 👋</h3>
      <p className="text-xs text-slate-700 mt-1 mb-6">
        Please enter your details to continue.
      </p>

      <form onSubmit={handleLogin} className="w-full">
        <div className="grid grid-cols-1 gap-3 text-left">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
        </div>

        {error && <p className="text-red-500 text-xs pt-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold
          hover:bg-gray-800 active:scale-95 transition mt-6"
        >
          LOGIN
        </button>

        {/* ⭐ GOOGLE BUTTON BELOW LOGIN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl 
          text-sm font-semibold hover:bg-gray-100 active:scale-95 transition mt-3 bg-white"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/google.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-[#d39c44] underline font-medium"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
