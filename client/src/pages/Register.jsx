import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Register() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  
  // Get role from URL parameter (from Dashboard -> Login -> Register flow)
  const roleFromUrl = searchParams.get("type") || "employee";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: "",
    role: roleFromUrl // Automatically set role from URL
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Registration failed");
      }

      alert(`Registration successful as ${form.role}! Please login.`);
      // Navigate back to login with the same role type
      nav(`/login?type=${form.role}`);

    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register as {form.role.charAt(0).toUpperCase() + form.role.slice(1)}</h2>

      <form onSubmit={submit}>
        <input placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required />
        <br /><br />

        <input placeholder="Employee Id"
          value={form.employeeId}
          onChange={e => setForm({ ...form, employeeId: e.target.value })}
          required />
        <br /><br />

        <input placeholder="Department"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
          required />
        <br /><br />

        <input type="email" placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required />
        <br /><br />

        <input type="password" placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required />
        <br /><br />

        {/* Show role selector (optional - user can change if needed) */}
        <select 
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          style={{ padding: "8px", width: "200px" }}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <br /><br />

        <button type="submit">Register as {form.role.charAt(0).toUpperCase() + form.role.slice(1)}</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <p>Already have an account?
          <button
            onClick={() => nav(`/login?type=${form.role}`)}
            style={{ marginLeft: "10px", cursor: "pointer" }}
            type="button"
          >
            Login here
          </button>
        </p>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button 
          onClick={() => nav("/")} 
          style={{ 
            background: "transparent", 
            border: "1px solid #ccc", 
            padding: "8px 16px", 
            cursor: "pointer"
          }}
          type="button"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}