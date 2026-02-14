import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom"; // ✅ FIXED missing import
import "../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // ✅ replaces inputEmail
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ hook initialized

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/send-otp", { email });
      setMessage("OTP sent successfully!");
      navigate("/verify-otp", { state: { email } }); // ✅ redirect with email
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="centered-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
        {message && <p className="success">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
