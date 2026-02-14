// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import BookList from "./pages/BookList";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import MemberList from "./pages/MemberList";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";




function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/issue" element={<IssueBook />} />
            <Route path="/return" element={<ReturnBook />} />
            <Route path="/books" element={<BookList />} />


            {/* Protected routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["USER", "LIBRARIAN", "ADMIN"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Example of a protected book list page */}
            <Route
              path="/books"
              element={
                <ProtectedRoute allowedRoles={["USER", "LIBRARIAN", "ADMIN"]}>
                  <BookList />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
