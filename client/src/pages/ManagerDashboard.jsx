// client/src/pages/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true);
  const [todayRecords, setTodayRecords] = useState([]); // today's attendance list
  const [weeklyCounts, setWeeklyCounts] = useState([]); // last 7 days present counts
  const [deptStats, setDeptStats] = useState({}); // department-wise stats
  const [uniqueEmployeesCount, setUniqueEmployeesCount] = useState(0);
  const [error, setError] = useState(null);

  // helper: format YYYY-MM-DD
  const formatDate = (d) => d.toISOString().slice(0, 10);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please login as manager.");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        // 1) Today's attendance (manager-only endpoint)
        const today = new Date();
        const todayStr = formatDate(today);
        const todayRes = await fetch("http://localhost:5000/api/attendance/today-status", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const todayData = todayRes.ok ? await todayRes.json() : [];
        setTodayRecords(todayData || []);

        // 2) Unique employee count (derive from all attendance records)
        // We'll query /api/attendance/all without date filter (manager-only)
        const allRes = await fetch("http://localhost:5000/api/attendance/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allData = allRes.ok ? await allRes.json() : [];
        const uniqueUserIds = new Set((allData || []).map(r => r.userId && r.userId._id ? r.userId._id : r.userId));
        setUniqueEmployeesCount(uniqueUserIds.size);

        // 3) Weekly attendance trend (last 7 days): call same /all endpoint with from/to
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          last7.push(formatDate(d));
        }
        const from = last7[0];
        const to = last7[last7.length - 1];
        const weeklyRes = await fetch(`http://localhost:5000/api/attendance/all?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const weeklyData = weeklyRes.ok ? await weeklyRes.json() : [];

        // compute present counts per day (present OR late OR half-day count as 'present' for trend)
        const countsByDate = {};
        last7.forEach(d => countsByDate[d] = 0);
        (weeklyData || []).forEach(rec => {
          if (!rec) return;
          const date = rec.date;
          if (!countsByDate.hasOwnProperty(date)) return;
          if (["present", "late", "half-day"].includes(rec.status)) countsByDate[date] += 1;
        });
        setWeeklyCounts(last7.map(d => countsByDate[d] || 0));

        // 4) Department-wise attendance: use manager summary endpoint (expects from/to)
        // Endpoint expected: GET /api/attendance/summary?from=YYYY-MM-DD&to=YYYY-MM-DD (manager-only)
        const deptRes = await fetch(`http://localhost:5000/api/attendance/summary?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const deptData = deptRes.ok ? await deptRes.json() : null;
        // deptData expected shape: { totalRecords, departmentWise: { depName: { present, absent, late, half } } }
        setDeptStats(deptData?.departmentWise || {});

      } catch (err) {
        console.error("Manager dashboard error:", err);
        setError("Failed to load manager data. See console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div style={{ padding: 20 }}><h2>Loading...</h2></div>;
  if (error) return <div style={{ padding: 20, color: "crimson" }}>{error}</div>;

  // compute numeric stats for today
  const presentToday = todayRecords.filter(r => ["present", "late", "half-day"].includes(r.status)).length;
  const absentToday = todayRecords.filter(r => r.status === "absent").length;
  const lateToday = todayRecords.filter(r => r.status === "late").length;
  const absentList = todayRecords.filter(r => r.status === "absent").map(r => ({ name: r.userId?.name || "Unknown", employeeId: r.userId?.employeeId || "-" }));

  // weekly chart data (labels = last 7 days)
  const last7labels = (() => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
    }
    return arr;
  })();

  const lineData = {
    labels: last7labels,
    datasets: [
      {
        label: "Present (last 7 days)",
        data: weeklyCounts,
        fill: false,
        borderColor: "#1976d2",
        tension: 0.3,
        pointRadius: 4
      }
    ]
  };

  // department pie chart: aggregate present counts per department
  const deptLabels = Object.keys(deptStats);
  const deptPresentCounts = deptLabels.map(dep => {
    const s = deptStats[dep] || {};
    // consider present + late + half-day as attendance present count
    return (s.present || 0) + (s.late || 0) + (s["half-day"] || 0) + (s["half"] || 0);
  });

  const pieData = {
    labels: deptLabels.length ? deptLabels : ["No data"],
    datasets: [
      {
        data: deptLabels.length ? deptPresentCounts : [1],
        backgroundColor: ["#4caf50","#f44336","#ff9800","#2196f3","#9c27b0","#00bcd4"],
        hoverOffset: 6
      }
    ]
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Manager Dashboard</h1>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 20 }}>
        <div style={{ flex: "1 1 200px", padding: 16, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h3>Total employees</h3>
          <div style={{ fontSize: 28, fontWeight: "bold" }}>{uniqueEmployeesCount}</div>
        </div>

        <div style={{ flex: "1 1 300px", padding: 16, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h3>Today's attendance</h3>
          <div style={{ fontSize: 18 }}>
            <div>Present: <strong>{presentToday}</strong></div>
            <div>Absent: <strong>{absentToday}</strong></div>
            <div>Late arrivals: <strong>{lateToday}</strong></div>
          </div>
        </div>

        <div style={{ flex: "1 1 400px", padding: 16, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h3>Weekly attendance trend</h3>
          <div style={{ width: "100%", height: 220 }}>
            <Line data={lineData} />
          </div>
        </div>

        <div style={{ flex: "1 1 350px", padding: 16, borderRadius: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h3>Department-wise attendance (last 7 days)</h3>
          <div style={{ width: "100%", height: 220 }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <h3>Absent employees today</h3>
        {absentList.length === 0 ? (
          <div>No absent employees recorded today</div>
        ) : (
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr><th>Name</th><th>Employee ID</th></tr>
            </thead>
            <tbody>
              {absentList.map((a, i) => (
                <tr key={i}><td>{a.name}</td><td>{a.employeeId}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: 28 }}>
        <h3>Raw attendance records (recent)</h3>
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginTop: 8 }}>
          <thead>
            <tr>
              <th>Employee</th><th>Emp ID</th><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {todayRecords.concat([]).slice(0, 50).map(r => (
              <tr key={r._id}>
                <td>{r.userId?.name}</td>
                <td>{r.userId?.employeeId}</td>
                <td>{r.date}</td>
                <td>{r.checkInTime ? new Date(r.checkInTime).toLocaleString() : "-"}</td>
                <td>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleString() : "-"}</td>
                <td>{r.status}</td>
                <td>{r.totalHours ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
