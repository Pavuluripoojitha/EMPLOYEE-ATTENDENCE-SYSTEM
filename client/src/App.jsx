import React from "react";
import { Routes, Route } from "react-router-dom";
import CheckInOut from "./pages/CheckInOut";
import Summary from "./pages/Summary";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Stats from "./pages/Stats";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/check" element={<CheckInOut />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/history" element={<History />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Stats" element={<Stats />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/manager" element={<ManagerDashboard />} />
    </Routes>
  );
}