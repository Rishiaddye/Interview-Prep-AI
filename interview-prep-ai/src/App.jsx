import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About"; // ⭐ Imported

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} /> {/* ⭐ Working Route */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
      </Routes>

      <Toaster toastOptions={{ style: { fontSize: "13px" } }} />
    </>
  );
};

export default App;
