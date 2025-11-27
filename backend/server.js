const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const sessionRoutes = require("./routes/session");
const authRoutes = require("./routes/auth.js");
const aiRoutes = require("./routes/ai.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Fix port — ALWAYS run backend on 5000
const PORT = process.env.PORT || 5000;

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Backend running"));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/session", sessionRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
