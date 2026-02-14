import React, { useState } from "react";
import api from "../api/api";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ FIXED import
import "../styles/Auth.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // ✅ email passed from previous page

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setMessage("OTP verified successfully!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="centered-page">
      <div className="auth-card">
        <h2>Verify OTP</h2>
        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
        {message && <p className="success">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;
