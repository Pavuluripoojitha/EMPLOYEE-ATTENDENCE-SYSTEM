// server/controllers/attendanceController.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { exportAttendanceToCSV } from "../utils/csvExport.js"; // ensure this is ESM

dayjs.extend(utc);
dayjs.extend(timezone);

// Return date in Asia/Kolkata in YYYY-MM-DD
const todayDateIST = () => dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");

export const checkin = async (req, res) => {
  try {
    const date = todayDateIST();
    let att = await Attendance.findOne({ userId: req.user._id, date });
    const now = dayjs().tz("Asia/Kolkata");

    // Determine lateness: startTime 09:30 IST
    const startTime = dayjs().tz("Asia/Kolkata").hour(9).minute(30).second(0);
    const status = now.isAfter(startTime) ? "late" : "present";

    if (!att) {
      att = await Attendance.create({
        userId: req.user._id,
        date,
        checkInTime: now.toISOString(),
        status,
      });
    } else {
      // update existing record
      att.checkInTime = now.toISOString();
      att.status = status;
      await att.save();
    }
    return res.json(att);
  } catch (err) {
    console.error("checkin error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const date = todayDateIST();
    const att = await Attendance.findOne({ userId: req.user._id, date });
    const now = dayjs().tz("Asia/Kolkata");
    if (!att || !att.checkInTime) return res.status(400).json({ message: "No check-in found" });

    att.checkOutTime = now.toISOString();

    // compute total hours (minutes -> hours decimal)
    const diffMinutes = dayjs(att.checkOutTime).diff(dayjs(att.checkInTime), "minute");
    att.totalHours = Number((diffMinutes / 60).toFixed(2));

    if (att.totalHours < 4) att.status = "half-day";

    await att.save();
    return res.json(att);
  } catch (err) {
    console.error("checkout error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const myHistory = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.user._id };
    if (month && year) {
      const prefix = `${year}-${String(month).padStart(2, "0")}`; // YYYY-MM
      query.date = { $regex: `^${prefix}` };
    }
    const items = await Attendance.find(query).sort({ date: -1 });
    return res.json(items);
  } catch (err) {
    console.error("myHistory error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Existing mySummary - expects month & year in query (keeps backward compatibility)
export const mySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ message: "month and year required" });

    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    const items = await Attendance.find({ userId: req.user._id, date: { $regex: `^${prefix}` } });

    let present = 0, absent = 0, late = 0, half = 0, totalHours = 0;
    items.forEach(i => {
      if (i.status === "present") present++;
      if (i.status === "absent") absent++;
      if (i.status === "late") late++;
      if (i.status === "half-day") half++;
      totalHours += Number(i.totalHours || 0);
    });
    return res.json({ present, absent, late, half, totalHours });
  } catch (err) {
    console.error("mySummary error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// NEW: monthlySummary -> convenient endpoint for Stats.jsx
// GET /api/attendance/summary/monthly  (auth required)
export const monthlySummary = async (req, res) => {
  try {
    // default to current month/year in Asia/Kolkata if not provided
    const now = dayjs().tz("Asia/Kolkata");
    let { month, year } = req.query;

    if (!month || !year) {
      month = String(now.month() + 1).padStart(2, "0");
      year = String(now.year());
    } else {
      month = String(month).padStart(2, "0");
      year = String(year);
    }

    const prefix = `${year}-${month}`; // YYYY-MM
    const items = await Attendance.find({ userId: req.user._id, date: { $regex: `^${prefix}` } });

    let present = 0, absent = 0, late = 0, half = 0, totalHours = 0;
    items.forEach(i => {
      if (i.status === "present") present++;
      else if (i.status === "absent") absent++;
      else if (i.status === "late") late++;
      else if (i.status === "half-day") half++;

      totalHours += Number(i.totalHours || 0);
    });

    return res.json({ present, absent, late, half, totalHours: Number(totalHours.toFixed(2)) });
  } catch (err) {
    console.error("monthlySummary error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const todayStatus = async (req, res) => {
  try {
    const date = todayDateIST();
    const att = await Attendance.findOne({ userId: req.user._id, date });
    return res.json(att || null);
  } catch (err) {
    console.error("todayStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Manager endpoints
export const allAttendances = async (req, res) => {
  try {
    const { from, to, employeeId, status } = req.query;
    const q = {};
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) q.userId = user._id;
      else return res.json([]);
    }
    if (status) q.status = status;
    if (from && to) q.date = { $gte: from, $lte: to }; // expects YYYY-MM-DD
    const items = await Attendance.find(q).populate("userId", "name employeeId department").sort({ date: -1 });
    return res.json(items);
  } catch (err) {
    console.error("allAttendances error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const employeeAttendance = async (req, res) => {
  try {
    const { id } = req.params; // user id
    const items = await Attendance.find({ userId: id }).sort({ date: -1 });
    return res.json(items);
  } catch (err) {
    console.error("employeeAttendance error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const teamSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const q = {};
    if (from && to) q.date = { $gte: from, $lte: to };
    const items = await Attendance.find(q).populate("userId", "name employeeId department");
    const stats = {};
    items.forEach(a => {
      const dep = a.userId.department || "Unknown";
      if (!stats[dep]) stats[dep] = { present: 0, absent: 0, late: 0, "half-day": 0 };
      stats[dep][a.status] = (stats[dep][a.status] || 0) + 1;
    });
    return res.json({ totalRecords: items.length, departmentWise: stats });
  } catch (err) {
    console.error("teamSummary error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const exportCSV = async (req, res) => {
  try {
    const { from, to } = req.query;
    const q = {};
    if (from && to) q.date = { $gte: from, $lte: to };
    const items = await Attendance.find(q).populate("userId", "name employeeId department email");
    const csv = await exportAttendanceToCSV(items);
    res.setHeader("Content-disposition", "attachment; filename=attendance.csv");
    res.set("Content-Type", "text/csv");
    return res.status(200).send(csv);
  } catch (err) {
    console.error("exportCSV error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const todayPresence = async (req, res) => {
  try {
    const date = todayDateIST();
    const items = await Attendance.find({ date }).populate("userId", "name employeeId department");
    return res.json(items);
  } catch (err) {
    console.error("todayPresence error:", err);
    return res.status(500).json({ error: err.message });
  }
};
