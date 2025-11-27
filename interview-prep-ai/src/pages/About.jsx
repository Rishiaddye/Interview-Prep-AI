import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import OwnerImg from "../assets/rishi.png";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <div className="min-h-screen pt-20 px-6" style={{ background: "#FFF8E8" }}>
        
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-semibold text-center text-gray-900"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About{" "}
          <span
            className="text-transparent bg-clip-text font-bold"
            style={{ backgroundImage: "linear-gradient(to right, #FF9F47, #FFC875)" }}
          >
            Interview Prep AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <p className="text-center max-w-2xl mx-auto mt-4 text-gray-600 text-lg">
          Empowering learners to become confident, knowledgeable, and interview-ready using AI.
        </p>

        {/* Main Responsive Section */}
        <motion.div
          className="max-w-5xl mx-auto mt-10 flex flex-col md:flex-row items-center md:items-start gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* IMAGE LEFT */}
          <motion.img
            src={OwnerImg}
            alt="Founder"
            className="w-44 h-44 md:w-56 md:h-56 rounded-full shadow-lg border-4 border-[#FFC875] object-cover mx-auto"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />

          {/* TEXT RIGHT */}
          <motion.div
            className="text-lg text-gray-700 leading-relaxed text-center md:text-left"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Hi, I'm Rishi Addye👋</h2>

            <p>
              I started as someone curious about how websites work — fascinated by UI,
              animations, and how technology solves real problems. Curiosity became passion,
              and passion became direction.
            </p>

            <p className="mt-3">
              Today, I'm a{" "}
              <span className="font-semibold text-black">MERN Stack Developer</span>,
              building secure and scalable applications using{" "}
              <strong>React.js, Node.js, Express.js, MongoDB, and modern engineering</strong> approaches.
            </p>

            <p className="mt-3">
              <strong>Interview Prep AI</strong> wasn't just built as a platform — but as
              a mission to help students and professionals grow confidence and prepare
              smarter for real-world opportunities.
            </p>

            {/* Quote */}
            <p className="mt-5 italic text-[#D9782A] font-medium">
              My goal is simple — help people learn faster, prepare smarter, and step into opportunities with confidence.
            </p>

            {/* LinkedIn CTA */}
            <div className="flex justify-center md:justify-start items-center gap-3 mt-6 text-lg font-medium text-gray-800">
              👉 Let’s connect on LinkedIn
              <a
                href="https://www.linkedin.com/in/rishi-addye-bca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-gray-700 hover:text-black transition cursor-pointer"
              >
                <FaLinkedin />
              </a>
            </div>

            {/* Ending line */}
            <p className="mt-10 text-gray-700">
              🚀 Thanks for being here — let's grow together.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default About;
