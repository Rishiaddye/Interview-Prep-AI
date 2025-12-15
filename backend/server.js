const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const sessionRoutes = require("./routes/session");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /^https:\/\/.*\.vercel\.app$/   // allow ALL Vercel domains
    ],
    credentials: true,
  })
);


app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/session", sessionRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
