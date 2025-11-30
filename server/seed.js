// eas/server/seed.js
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');

const run = async () => {
  await connectDB();
  await User.deleteMany();
  await Attendance.deleteMany();

  const pass = await bcrypt.hash('password123', 10);
  const manager = await User.create({ name: 'Manager One', email: 'manager@example.com', password: pass, role: 'manager', employeeId: 'MGR001', department: 'HR' });
  const emp1 = await User.create({ name: 'Employee A', email: 'emp.a@example.com', password: pass, role: 'employee', employeeId: 'EMP001', department: 'Engineering' });
  const emp2 = await User.create({ name: 'Employee B', email: 'emp.b@example.com', password: pass, role: 'employee', employeeId: 'EMP002', department: 'Sales' });

  const createAttendance = async (user, dayOffset, checkInHour=9, checkOutHour=17, late=false) => {
    const date = dayjs().subtract(dayOffset, 'day').format('YYYY-MM-DD');
    const checkInTime = dayjs(date + `T${String(checkInHour).padStart(2,'0')}:00:00`).toISOString();
    const checkOutTime = dayjs(date + `T${String(checkOutHour).padStart(2,'0')}:00:00`).toISOString();
    const totalHours = (checkOutHour - checkInHour);
    await Attendance.create({ userId: user._id, date, checkInTime, checkOutTime, status: late ? 'late' : 'present', totalHours });
  };

  await createAttendance(emp1, 1);
  await createAttendance(emp1, 2, 10, 17, true);
  await createAttendance(emp2, 1, 9, 13, false); // half-day
  console.log('Seeded!');
  process.exit();
};

run();
