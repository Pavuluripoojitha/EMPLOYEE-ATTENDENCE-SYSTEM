// client/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the login type from URL parameter
  const loginType = searchParams.get("type") || "employee";

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("=== LOGIN DEBUG ===");
      console.log("Full response:", res.data);

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        alert("Login succeeded but server response is missing token or user.");
        return;
      }

      // Store token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Debug the role
      console.log("Raw user.role:", user.role);
      console.log("Expected login type:", loginType);
      
      const role = (user.role || "").toString().toLowerCase().trim();
      console.log("Normalized role:", role);

      // Validate role matches the login type clicked
      if (role !== loginType.toLowerCase()) {
        alert(`You clicked "${loginType}" login, but this account has role: "${role}". Please use the correct login button.`);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }

      // Route based on role
      if (role === "manager") {
        console.log("Navigating to: /manager");
        navigate("/manager");
      } else if (role === "employee") {
        console.log("Navigating to: /employee");
        navigate("/employee");
      } else {
        console.error("Unknown role:", role);
        alert(`Unknown role: ${role}. Please contact support.`);
      }

    } catch (err) {
      console.error("login error:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login as {loginType.charAt(0).toUpperCase() + loginType.slice(1)}</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>
        {loginType === "manager" 
          ? "Please use your manager credentials" 
          : "Please use your employee credentials"}
      </p>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px", width: "250px" }}
      /><br/><br/>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleLogin()}
        style={{ padding: "8px", width: "250px" }}
      /><br/><br/>

      <button onClick={handleLogin} style={{ padding: "10px 20px", cursor: "pointer" }}>
        Login as {loginType.charAt(0).toUpperCase() + loginType.slice(1)}
      </button>

      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={() => navigate("/")} 
          style={{ 
            background: "transparent", 
            border: "1px solid #ccc", 
            padding: "8px 16px", 
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          ← Back to Home
        </button>
        
        <button 
          onClick={() => navigate(`/register?type=${loginType}`)} 
          style={{ 
            background: "transparent", 
            border: "1px solid #ccc", 
            padding: "8px 16px", 
            cursor: "pointer" 
          }}
        >
          Register New Account
        </button>
      </div>
    </div>
  );
}