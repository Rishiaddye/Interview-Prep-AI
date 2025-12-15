const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔐 JWT helper
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =======================
// SIGNUP
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, profilePic } = req.body;

    const already = await User.findOne({ email });
    if (already)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      passwordHash: hash,
      profilePic: profilePic || null,
    });

    const token = createToken(newUser);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.passwordHash)
      return res.status(400).json({ message: "Use Google login" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    const token = createToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// GOOGLE LOGIN
// =======================
router.post("/google-login", async (req, res) => {
  try {
    const { fullName, email, profilePic } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName,
        email,
        profilePic,
        passwordHash: null,
      });
    } else if (profilePic && user.profilePic !== profilePic) {
      user.profilePic = profilePic;
      await user.save();
    }

    const token = createToken(user);

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Server error during Google login" });
  }
});

module.exports = router;
