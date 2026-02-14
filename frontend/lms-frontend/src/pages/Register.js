import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Auth.css";

const Register = () => {
  const [role, setRole] = useState("USER");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const SECRET_KEYS = {
    ADMIN: "ADMIN123",
    LIBRARIAN: "LIB2025"
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password match for USER
    if (role === "USER" && form.password !== form.confirmPassword) {
      return setError("Passwords do not match!");
    }

    // Validate secret key for Admin/Librarian
    if ((role === "ADMIN" || role === "LIBRARIAN") && form.secretKey !== SECRET_KEYS[role]) {
      return setError("Invalid Secret Key!");
    }

    try {
      const payload = {
        name: form.name,
        role,
        password: form.password,
        email: role === "USER" ? form.email : undefined
      };

      const res = await api.post("/auth/register", payload);
      setSuccess("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="centered-page">
      <div className="auth-card">
        <h2>Register</h2>

        {/* Role Selection */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="LIBRARIAN">Librarian</option>
        </select>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Show Email Only for USER */}
          {role === "USER" && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          )}

          {/* Secret Key for Admin/Librarian */}
          {(role === "ADMIN" || role === "LIBRARIAN") && (
            <input
              type="password"
              name="secretKey"
              placeholder="Enter Secret Key"
              value={form.secretKey}
              onChange={handleChange}
              required
            />
          )}

          {/* Password Fields */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {role === "USER" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Register</button>
        </form>

        <div className="link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
