import React, { useState } from "react";
import axios from "axios";

export default function CheckInOut() {
  const [message, setMessage] = useState("");

  const handleCheckIn = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/attendance/checkin", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setMessage("Checked in at: " + res.data.checkInTime);
    } catch (err) {
      setMessage(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/attendance/checkout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setMessage("Checked out at: " + res.data.checkOutTime);
    } catch (err) {
      setMessage(err.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Check In / Check Out</h2>

      <button 
        onClick={handleCheckIn}
        style={{ padding: "10px 20px", margin: "10px", cursor: "pointer" }}
      >
        Check In
      </button>

      <button 
        onClick={handleCheckOut}
        style={{ padding: "10px 20px", margin: "10px", cursor: "pointer" }}
      >
        Check Out
      </button>

      {message && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>
      )}
    </div>
  );
}

