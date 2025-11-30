import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Attendance System</h1>
      <div style={{ marginTop: 24 }}>
        <button onClick={() => navigate("/login?type=manager")} style={{ marginRight: 12, padding: "8px 16px" }}>
          Manager Login
        </button>
        <button onClick={() => navigate("/login?type=employee")} style={{ padding: "8px 16px" }}>
          Employee Login
        </button>
      </div>
    </div>
  );
}
