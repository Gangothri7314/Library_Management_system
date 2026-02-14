import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side: Logo + Brand */}
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">📘</div>
          <span className="brand-name">Librario</span>
        </Link>

        {/* Right side: Links */}
        <div className="navbar-links">
          {user ? (
            <>
              <span className="welcome-text">Hi, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


