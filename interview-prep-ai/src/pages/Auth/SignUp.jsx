import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input.jsx";
import ProfilePhotoSelector from "../../components/inputs/profilePhotoSelector.jsx";
import { validateEmail } from "../../utils/helper";
import { useUser } from "../../context/userContext";
import { uploadToImgBB } from "../../utils/uploadImage"; // ⭐ ImgBB uploader

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null); // File object
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!fullName.trim()) return setError("Please enter full name.");
    if (!email.trim()) return setError("Please enter your email.");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");

    try {
      // 1️⃣ Upload image to ImgBB if selected
      let uploadedImageUrl = null;
      if (profilePic && profilePic instanceof File) {
        uploadedImageUrl = await uploadToImgBB(profilePic);
      }

      // 2️⃣ Send signup request to backend
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          profilePic: uploadedImageUrl, // ⭐ store in DB
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.message || "Signup failed");

      // 3️⃣ Create user object to store locally
      const newUser = {
        id: data.user?.id,
        fullName: data.user?.fullName || fullName,
        email: data.user?.email || email,
        profilePic:
          uploadedImageUrl || data.user?.profilePic || "/default-avatar.png",
      };

      // 4️⃣ Save login session
      login(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));

      alert("🎉 Signup Successful! Redirecting...");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-2 py-4">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-4">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp} className="w-full">
        {/* PROFILE PIC UPLOAD */}
        <div className="flex justify-center mb-4">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        </div>

        {/* INPUT FIELDS */}
        <div className="grid grid-cols-1 gap-3 text-left">
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            label="Full Name"
            placeholder="John"
          />
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
            type="password"
            placeholder="Min 8 Characters"
          />
        </div>

        {/* ERROR */}
        {error && <p className="text-red-500 text-xs pt-2">{error}</p>}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-gray-500" : "bg-black"
          } text-white py-3 rounded-xl text-sm font-semibold
          shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 mt-6`}
        >
          {loading ? "Signing Up..." : "SIGN UP"}
        </button>

        {/* SWITCH TO LOGIN */}
        <p className="text-xs text-slate-800 mt-3">
          Already have an account?{" "}
          <button
            type="button"
            className="text-[#d39c44] underline font-medium"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
