// eas/server/routes/attendance.js
import { Router } from "express";
import { auth, managerOnly } from "../middlewares/authMiddleware.js";
import * as c from "../controllers/attendanceController.js";

const router = Router();

router.post("/checkin", auth, c.checkin);
router.post("/checkout", auth, c.checkout);
router.get("/my-history", auth, c.myHistory);
router.get("/my-summary", auth, c.mySummary);
router.get("/today", auth, c.todayStatus);

// manager
router.get("/all", auth, managerOnly, c.allAttendances);
router.get("/employee/:id", auth, managerOnly, c.employeeAttendance);
router.get("/summary", auth, managerOnly, c.teamSummary);
router.get("/export", auth, managerOnly, c.exportCSV);
router.get("/summary/monthly", auth, c.monthlySummary);
router.get("/today-status", auth, managerOnly, c.todayPresence);

export default router;
