// src/components/ResetPassword.js
import React, { useState } from "react";
import api from "../api/api";
import "../styles/Auth.css";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleReset = async (e) => {
      e.preventDefault();
      if (password !== confirm) {
        setMessage("Passwords do not match");
        return;
      }
      try {
        await api.post("/auth/reset-password", { email, newPassword: password });
        setMessage("Password reset successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to reset password");
      }
    };


  return (
    <div className="centered-page">  {/* ✅ Added wrapper like Login/Register */}
      <div className="auth-card">
        <h2>Set New Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className="success">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
