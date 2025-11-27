import { useState, useEffect, useRef } from 'react';
import PrepLogo from "../assets/robo.png";
import MagneticButton from "../components/MagneticButton";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useUser } from "../context/userContext";
import Footer from "../components/Footer";

import HERO_IMG from "../assets/hero-img.png";
import { APP_FEATURES } from "../utils/data";

import Modal from "../components/Modal";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import { useTheme } from "../context/themeContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { theme } = useTheme();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // 🚀 Forces Light Mode on Landing Page
  useEffect(() => {
    const html = document.documentElement;
    const restoreDark = html.classList.contains("dark");

    html.classList.remove("dark");
    localStorage.setItem("theme", "light");

    return () => {
      if (restoreDark) html.classList.add("dark");
    };
  }, [theme]);

  const handleCTA = () => {
    setCurrentPage("login");
    setOpenAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    setOpenAuthModal(false);
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative w-full min-h-full pt-4" style={{ background: "#FFF8E8" }}>
        
        {/* Soft Glow */}
        <motion.div
          className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-amber-200/30 blur-[140px] rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div ref={heroRef} className="container mx-auto px-4 pt-2 pb-[150px] relative z-10">
          
          {/* HEADER */}
          <header className="w-full max-w-6xl mx-auto px-4 flex justify-between items-center mb-10">
            <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
              <img src={PrepLogo} alt="PrepAI" className="w-[200px] h-auto object-contain" />
            </div>

            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <img
                    src={user?.profilePic || "/default-avatar.png"}
                    alt="Profile"
                    className="hover:scale-110 transition-all"
                    style={{
                      width: 50, height: 50, borderRadius: "50%", objectFit: "cover",
                      border: "2px solid #ff9e3c", boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                  />

                  <span className="font-medium text-gray-800 text-[15px] capitalize">{user.fullName}</span>

                  <button
                    onClick={handleLogout}
                    className="text-[#d87a2f] font-semibold hover:text-black transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-white text-sm font-medium px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-[1.05] transition-all duration-200"
                  onClick={() => {
                    setOpenAuthModal(true);
                    setCurrentPage("login");
                  }}
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </header>

          {/* MAIN TITLE */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-3xl mb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-2 text-[13px] font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300 text-amber-600">
                  AI powered
                </div>
              </div>

              <h1 className="text-5xl font-medium mb-6 leading-tight text-black">
                Ace Interviews with <br />
                <span
                  className="text-transparent bg-clip-text font-semibold"
                  style={{ backgroundImage: "linear-gradient(to right, #FF9324, #FCD760)" }}
                >
                  AI-Powered
                </span>{" "}
                Learning
              </h1>

              <p className="text-[17px] max-w-2xl mx-auto mb-6 text-gray-700">
                Get role-specific questions, expand answers, dive deep into concepts, and organize everything your way.
              </p>

              <MagneticButton
                onClick={handleCTA}
                className="text-sm font-semibold px-7 py-2.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95 bg-black text-white hover:bg-white hover:text-black shadow-md hover:shadow-lg"
              >
                Get Started
              </MagneticButton>
            </div>

            <motion.img
              src={HERO_IMG}
              alt="Hero"
              className="w-full max-w-[1200px] max-h-[380px] object-contain mt-6 select-none"
              style={{ y }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1 }}
              whileHover={{ scale: 1.03, rotate: 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background: "#FFF8E8" }} className="mt-10">
        <div className="container mx-auto px-4 pt-10 pb-20">
          <h2 className="text-2xl font-medium text-center mb-12 text-black">Features That Make You Shine</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {APP_FEATURES.map((feature) => (
              <motion.div
                key={feature.id}
                className="p-7 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.10)] transition-transform duration-300 border"
                style={{ background: "white", borderColor: "rgba(255,181,82,0.25)", borderWidth: "1px" }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.04 }}
              >
                <h3 className="text-lg font-semibold mb-3 text-black">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AUTH MODAL */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
      </Modal>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default LandingPage;
