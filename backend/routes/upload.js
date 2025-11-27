const express = require("express");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

// Save images to /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// UPDATE profile picture
router.post("/profile/:id", upload.single("profilePic"), async (req, res) => {
  try {
    const imagePath = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.params.id, {
      profilePic: imagePath
    });

    res.json({
      message: "Profile picture updated",
      profilePic: imagePath
    });
  } catch (err) {
    res.status(500).json({ message: "Upload error" });
  }
});

module.exports = router;
