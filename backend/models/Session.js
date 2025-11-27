const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  q: String,
  a: String,
  followup: String,
  why: String
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  role: { type: String, required: true },
  experience: { type: String },
  topics: { type: [String], default: [] },
  aiGenerated: { type: Boolean, default: false },
  questions: { type: [questionSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);