import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";

import { auth } from "./firebase";
import { getRedirectResult } from "firebase/auth";
import { useUser } from "./context/userContext";

const App = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  // ✅ GOOGLE REDIRECT HANDLER (MOBILE FIX)
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result?.user) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/google-login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: result.user.displayName,
              email: result.user.email,
              profilePic: result.user.photoURL,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error("Google login failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user);

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Google redirect login failed:", err);
      }
    };

    handleGoogleRedirect();
  }, []);

  // ✅ YOUR EXISTING FIRST-VISIT LOGIC (UNCHANGED)
  useEffect(() => {
    const visited = localStorage.getItem("visited");

    if (!visited) {
      localStorage.setItem("visited", "yes");
      navigate("/signup", { replace: true });
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-prep/:sessionId"
          element={<InterviewPrep />}
        />

        <Route path="/signup" element={<LandingPage signupMode={true} />} />
      </Routes>

      <Toaster toastOptions={{ style: { fontSize: "13px" } }} />
    </>
  );
};

export default App;
