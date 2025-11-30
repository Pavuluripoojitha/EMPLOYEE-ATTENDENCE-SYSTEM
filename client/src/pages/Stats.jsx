// client/src/pages/Stats.jsx
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("token");

        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const res = await fetch(
          `http://localhost:5000/api/attendance/summary/monthly?month=${month}&year=${year}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!stats) return <h2>No data found</h2>;

  const chartData = {
    labels: ["Present", "Absent", "Late", "Half Day"],
    datasets: [
      {
        data: [stats.present, stats.absent, stats.late, stats.half],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container" style={{ marginTop: "40px" }}>
      <h2>📊 Monthly Summary</h2>

      {/* Chart */}
      <div style={{ width: "400px", margin: "20px auto" }}>
        <Pie data={chartData} />
      </div>

      {/* Numbers */}
      <div className="box" style={{ marginTop: "20px", fontSize: "18px" }}>
        <p><strong>Present:</strong> {stats.present}</p>
        <p><strong>Absent:</strong> {stats.absent}</p>
        <p><strong>Late:</strong> {stats.late}</p>
        <p><strong>Half Day:</strong> {stats.half}</p>
        <p><strong>Total Hours This Month:</strong> {stats.totalHours}</p>
      </div>
    </div>
  );
}
