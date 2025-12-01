import { FaLinkedin, FaGithub, FaInstagram, FaTwitter, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom"; // ⭐ Added
import PrepLogo from "../assets/robo.png";

const Footer = () => {
  return (
    <footer
      className="w-full pt-10 pb-6 border-t"
      style={{ background: "#FFF4DC", borderColor: "#F7D9A5" }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BRAND SECTION */}
        <div>
          <img src={PrepLogo} alt="Logo" className="w-28 mb-3" />
          <p className="text-gray-700 leading-relaxed text-sm">
            Your AI-powered interview mentor helping you learn, practice, and
            ace every interview with confidence.
          </p>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h3
            className="text-lg font-semibold mb-5 text-[#C46A16] inline-block relative"
            style={{
              paddingBottom: "6px",
              background: "linear-gradient(to right, #FF9324, #FFD18A)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Company
            <div
              style={{
                width: "85%",
                height: "3px",
                marginTop: "4px",
                borderRadius: "10px",
                background: "linear-gradient(to right,#FF9324,#FFD18A)",
              }}
            />
          </h3>

          <ul className="space-y-2 text-gray-700 text-sm mt-3">
            <li className="hover:text-black cursor-pointer">
              <Link to="/about">About us</Link> {/* ⭐ Working */}
            </li>
            <li className="hover:text-black cursor-pointer">Careers</li>
            <li className="hover:text-black cursor-pointer flex items-center gap-2">
              Contact
              <span className="flex items-center gap-1 text-black font-medium">
                <FaPhone className="text-[#FF9324]" /> +91 98765 43210
              </span>
            </li>
          </ul>
        </div>

        {/* SOCIALS */}
        <div>
          <h3
            className="text-lg font-semibold mb-5 text-[#C46A16] inline-block relative"
            style={{
              paddingBottom: "6px",
              background: "linear-gradient(to right, #FF9324, #FFD18A)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Follow Us
            <div
              style={{
                width: "60%",
                height: "3px",
                marginTop: "4px",
                borderRadius: "10px",
                background: "linear-gradient(to right,#FF9324,#FFD18A)",
              }}
            />
          </h3>

          <div className="flex space-x-5 text-2xl text-gray-700 mt-3">
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank"><FaLinkedin /></a>
            <a href="https://github.com" target="_blank"><FaGithub /></a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        className="text-center mt-10 text-gray-700 text-sm border-t pt-4"
        style={{ borderColor: "#F7D9A5" }}
      >
        © {new Date().getFullYear()} Interview Prep AI — Built with ❤️ to help you grow.
      </div>
    </footer>
  );
};

export default Footer;
