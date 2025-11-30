import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// ----- LOGIN API -----
app.post("/api/login", (req, res) => {
  console.log("⭐ Login request received:", req.body);  // <-- You will see this in backend console

  const { email, password } = req.body;

  if (email === "test@gmail.com" && password === "123456") {
    return res.json({ success: true, message: "Login Successful" });
  }

  return res.status(400).json({ success: false, message: "Invalid Credentials" });
});


// Server start
app.listen(5000, () => console.log("Server running on port 5000"));
