import React from "react";
// client/src/pages/Summary.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function getCurrentMonthYear() {
  const now = new Date(); // browser local time (user likely in IST)
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();
  return { month, year };
}

export default function Summary() {
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    half: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setErr("");

      const token = localStorage.getItem("token");
      if (!token) {
        setErr("Not logged in — please login to see summary.");
        setLoading(false);
        return;
      }

      const { month, year } = getCurrentMonthYear();

      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/my-summary?month=${month}&year=${year}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true,
          }
        );

        if (res.status === 200) {
          // expects { present, absent, late, half, totalHours } or similar
          const data = res.data;
          setStats({
            present: data.present ?? 0,
            absent: data.absent ?? 0,
            late: data.late ?? 0,
            half: data.half ?? 0,
            totalHours: data.totalHours ?? 0,
          });
        } else if (res.status === 401) {
          setErr("Unauthorized — please login again.");
        } else {
          setErr(res.data?.message || `Server error (${res.status})`);
        }
      } catch (e) {
        console.error("summary fetch error", e);
        setErr("Failed to fetch monthly summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading summary…</div>;
  if (err) return <div style={{ padding: 20, color: "crimson" }}>{err}</div>;

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>Monthly Summary (This month)</h2>

      <div style={{
        display: "inline-block",
        padding: 18,
        marginTop: 12,
        borderRadius: 8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)"
      }}>
        <div style={{ fontSize: 18, marginBottom: 8 }}>
          This month:
          <strong style={{ marginLeft: 8 }}>{stats.present} present</strong>,
          <strong style={{ marginLeft: 8 }}>{stats.absent} absent</strong>,
          <strong style={{ marginLeft: 8 }}>{stats.late} late</strong>
        </div>

        <div style={{ marginTop: 6, color: "#333" }}>
          ● Total hours worked this month:{" "}
          <strong>{Number(stats.totalHours || 0).toFixed(2)}</strong>
        </div>

        {stats.half > 0 && (
          <div style={{ marginTop: 6, color: "#666" }}>
            (Half-days: {stats.half})
          </div>
        )}
      </div>
    </div>
  );
}
