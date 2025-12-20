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
import EraserEffect from "../components/EraserEffect";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { theme } = useTheme();

  const [featureModal, setFeatureModal] = useState(null);
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);



  useEffect(() => {
    const html = document.documentElement;
    const revertDark = html.classList.contains("dark");
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
    return () => revertDark && html.classList.add("dark");
  }, [theme]);

  const handleCTA = () => {
    setFeatureModal(null);
    setAuthMode("login");
    setAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
  };

  return (
    <>
      <EraserEffect />

      {/* HERO SECTION */}
      <div className="relative w-full min-h-full pt-4" style={{ background: "#FFF8E8" }}>
        <motion.div
          className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-amber-200/30 blur-[140px] rounded-full"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div ref={heroRef} className="container mx-auto px-4 pt-2 pb-[85px] relative z-10">

          {/* NAVBAR */}
         <header className="w-full max-w-6xl mx-auto px-4 flex justify-between items-center mb-4 -mt-6 md:-mt-10">
  <img
    src={PrepLogo}
    onClick={() => navigate("/")}
    alt="PrepAI"
    className="w-[150px] md:w-[180px] cursor-pointer"
  />

  <div className="flex items-center gap-6">
    {user ? (
      <div className="flex items-center gap-4">
        <img
          src={user?.profilePic || "/default-avatar.png"}
          className="w-[50px] h-[50px] rounded-full border-2 border-[#ff9e3c] shadow-md object-cover"
        />
        <span className="font-medium text-gray-800 text-[15px] capitalize">
          {user.fullName}
        </span>
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
          setFeatureModal(null);
          setAuthMode("login");
          setAuthModal(true);
        }}
      >
        Login / Sign Up
      </button>
    )}
  </div>
</header>


          {/* HERO CONTENT */}
          <motion.div
            className="flex flex-col items-center text-center mt-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* ⭐ MODEL WRAPPER WITH SOFT FLOATING SHADOW ⭐ */}
       
 <div className="flex justify-center flex-col items-center mt-[-10px] md:mt-[-30px] mb-0">
  
  <span className="text-[13px] bg-amber-100 px-3 py-1 rounded-full border border-amber-300 text-amber-600 font-semibold mb-2">
    AI Powered
  </span>

              

              {/* ⭐ FIXED MODEL — NO BORDER, NO POSTER, PERFECT CLEAN LOOK ⭐ */}
              <model-viewer
                src="/robo_face.glb"
                alt="AI Robot"
                auto-rotate
                rotation-per-second="30deg"
                camera-controls
                shadow-intensity="1.2"
                exposure="1.25"
                environment-image="neutral"
                reveal="auto"
                disable-zoom
                disable-pan
                style={{
                  width: "220px",
                  height: "220px",
                  background: "transparent",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",

                  /* absolutely removes black screenshot box */
                  "--poster-color": "transparent",
                  "--poster-image": "none",
                  "--poster-opacity": "0",
                  "--progress-bar-color": "transparent",
                }}
              ></model-viewer>
            </div>

            {/* TEXT BLOCK */}
          <div className="max-w-3xl mb-4 mt-[-10px] md:mt-[-25px]">
              <h1 className="text-4xl md:text-5xl font-medium leading-tight mt-4 text-black">
                Ace Interviews with <br />
                <span className="bg-gradient-to-r from-[#FF9324] to-[#FCD760] bg-clip-text text-transparent">
                  AI-Powered Learning
                </span>
              </h1>
<p className="text-[16px] md:text-[17px] text-gray-600 leading-[1.7] tracking-[0.02em] max-w-2xl mx-auto my-3 font-normal">
  Get role-specific questions, expand answers, dive deep into concepts,
  and organize everything in your way.
</p>


              <MagneticButton
                onClick={handleCTA}
                className="text-sm font-semibold px-7 py-2.5 rounded-full bg-black text-white hover:bg-white hover:text-black shadow-md"
              >
                Get Started
              </MagneticButton>
            </div>

            {/* HERO IMAGE */}
            <motion.img
              src={HERO_IMG}
              className="w-full max-w-[1200px] max-h-[550px] mt-6 mb-15 select-none"
              style={{ y }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1 }}
            />
          </motion.div>
        </div>
      </div>

      {/* FEATURE CAROUSEL */}
      <div className="mt-0 pb-20" style={{ background: "#FFF8E8" }}>
        <h2 className="text-4xl font-bold text-center mb-14 text-black">
          Features That{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9324] to-[#FDD86F]">
            Make You Shine
          </span>
        </h2>

        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          spaceBetween={-55}
          coverflowEffect={{
            rotate: 0,
            stretch: -5,
            depth: 190,
            modifier: 2.2,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="w-full max-w-[64rem] mx-auto"
        >
          {APP_FEATURES.map((feature) => (
            <SwiperSlide
              key={feature.id}
              style={{ width: "260px", height: "400px" }}
              onClick={() => {
                setAuthModal(false);
                setFeatureModal(feature);
              }}
              className="cursor-pointer"
            >
              <div
                className="rounded-3xl overflow-hidden p-5 hover:scale-[1.05] transition backdrop-blur-md border border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.60), rgba(255,255,255,0.25))",
                }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-36 w-full rounded-xl mb-4 object-cover"
                />

                <h3 className="font-semibold text-lg text-black">{feature.title}</h3>
                <p className="text-gray-700 text-sm mt-3 line-clamp-3">
                  {feature.description}
                </p>

                <button className="mt-5 text-sm font-semibold text-[#FF7A1A] hover:underline">
                  Learn More →
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* FEATURE MODAL */}
      <Modal variant="glass" isOpen={!!featureModal} onClose={() => setFeatureModal(null)}>
        {featureModal && (
          <div
            className="relative max-w-3xl w-full px-6 md:px-10 py-10 rounded-3xl text-center"
            style={{
              background: "rgba(176, 132, 255, 0.18)",
              backdropFilter: "blur(22px)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              boxShadow: "0px 18px 50px rgba(120, 60, 255, 0.25)",
            }}
          >
            <button
              onClick={() => setFeatureModal(null)}
              className="absolute top-4 right-4 bg-white/60 backdrop-blur-md p-2 rounded-full shadow hover:bg-white/90 transition text-black"
            >
              ✕
            </button>

            <h2 className="text-3xl md:text-4xl font-semibold text-black mb-6">
              {featureModal.title}
            </h2>

            <img
              src={featureModal.image}
              alt={featureModal.title}
              className="w-full max-h-[260px] object-cover rounded-xl shadow-lg mb-6"
            />

            <p className="text-gray-900 text-lg md:text-xl leading-relaxed px-3">
              {featureModal.fullDescription || featureModal.description}
            </p>
          </div>
        )}
      </Modal>

      {/* AUTH MODAL */}
      <Modal isOpen={authModal} onClose={() => setAuthModal(false)}>
        {authMode === "login" ? (
          <Login setCurrentPage={setAuthMode} />
        ) : (
          <SignUp setCurrentPage={setAuthMode} />
        )}
      </Modal>

      <Footer />
    </>
  );
};

export default LandingPage;