import React from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const nav = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Employee Dashboard</h2>

      <button onClick={() => nav("/check")}>Check In / Check Out</button>
      <br /><br />

      <button onClick={() => nav("/history")}>My Attendance History</button>
      <br /><br />

      <button onClick={() => nav("/summary")}>Monthly Summary</button>
      <br /><br />

      <button onClick={() => nav("/stats")}>Stats</button>
    </div>
  );
}
