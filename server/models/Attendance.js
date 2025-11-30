// server/models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkInTime: { type: String, default: null }, // ISO string or HH:mm
  checkOutTime: { type: String, default: null },
  status: { type: String, enum: ["present", "absent", "late", "half-day"], default: "present" },
  totalHours: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// unique index per user per date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
