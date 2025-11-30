// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import attendanceRoutes from "./routes/attendance.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // front-end origin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
// Primary auth route (namespaced)
app.use("/api/auth", authRoutes);

// ALIAS: mount auth routes also at /api so frontend calls to /api/login will work
app.use("/api", authRoutes);

// Attendance routes
app.use("/api/attendance", attendanceRoutes);

// Health check (optional)
app.get("/healthz", (req, res) => res.json({ ok: true }));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
