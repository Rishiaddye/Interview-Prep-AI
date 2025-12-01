import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const visited = localStorage.getItem("visited");

    if (!visited) {
      localStorage.setItem("visited", "yes");
      navigate("/signup", { replace: true });
    }
  }, []); // runs once per device

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

        <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
        <Route path="/signup" element={<LandingPage signupMode={true} />} />
      </Routes>

      <Toaster toastOptions={{ style: { fontSize: "13px" } }} />
    </>
  );
};

export default App;
