// client/src/pages/History.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("No auth token found. Please login.");
        setLoading(false);
        console.warn("History: missing token in localStorage");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/attendance/my-history", {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (s) => true // we'll handle statuses manually
        });

        console.log("History API response:", res.status, res.data);

        if (res.status === 200) {
          setHistory(res.data);
        } else if (res.status === 401 || res.status === 403) {
          setError("Unauthorized — please log in again.");
          // do NOT auto-redirect here; let user decide or show login button
        } else {
          setError(res.data?.message || `Server responded with ${res.status}`);
        }
      } catch (err) {
        console.error("Fetch history failed:", err);
        setError("Failed to fetch history. Check server or network.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Attendance History</h2>

      {error && (
        <div style={{ color: "darkred", marginBottom: 12 }}>
          {error}
          {error.includes("login") && (
            <div>
              <button onClick={() => window.location.href = "/login"} style={{ marginLeft: 8 }}>
                Go to Login
              </button>
            </div>
          )}
        </div>
      )}

      <table border="1" cellPadding="8" style={{ marginTop: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 && (
            <tr><td colSpan="5">No records found</td></tr>
          )}
          {history.map(h => (
            <tr key={h._id}>
              <td>{h.date}</td>
              <td>{h.checkInTime ? new Date(h.checkInTime).toLocaleString("en-IN") : "-"}</td>
              <td>{h.checkOutTime ? new Date(h.checkOutTime).toLocaleString("en-IN") : "-"}</td>
              <td>{h.status}</td>
              <td>{h.totalHours ? Number(h.totalHours).toFixed(2) : "0.00"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
