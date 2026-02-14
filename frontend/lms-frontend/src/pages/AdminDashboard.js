// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
    totalUsers: 0,
    totalFine: 0,
  });

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newBook, setNewBook] = useState("");
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Admin";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardStats();
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchDashboardStats = async () => {
    const res = await axios.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data);
  };

  const fetchBooks = async () => {
    const res = await axios.get("/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("/users/borrow-status", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleAddBook = async () => {
    if (!newBook.trim()) return;
    await axios.post(
      "/books/add",
      { title: newBook },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewBook("");
    fetchBooks();
    fetchDashboardStats();
  };

  const handleDeleteBook = async (id) => {
    await axios.delete(`/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
    fetchDashboardStats();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      {/* TOP NAVBAR */}
      <nav className="admin-navbar">
        <h2 className="admin-title">📚 Librario Admin Panel</h2>

        <div className="admin-profile">
          <span className="admin-text">👋 Hello, {name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* STATS CARDS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <p className="stat-title">Registered Users</p>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📘</div>
          <p className="stat-title">Total Books</p>
          <h2>{stats.totalBooks}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📗</div>
          <p className="stat-title">Available</p>
          <h2>{stats.availableBooks}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📕</div>
          <p className="stat-title">Borrowed</p>
          <h2>{stats.borrowedBooks}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <p className="stat-title">Overdue</p>
          <h2>{stats.overdueBooks}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <p className="stat-title">Total Fines</p>
          <h2>₹{stats.totalFine}</h2>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        <button onClick={() => navigate("/add-book")} className="action-btn">➕ Add Book</button>
        <button onClick={() => navigate("/manage-books")} className="action-btn">🛠 Manage Books</button>
        <button onClick={() => navigate("/issue")} className="action-btn">📤 Issue Book</button>
        <button onClick={() => navigate("/return")} className="action-btn">📥 Return Book</button>
        <button onClick={() => navigate("/history")} className="action-btn">📄 Borrow History</button>
      </div>

      {/* BOOK MANAGEMENT */}
      <section className="books-section">
        <h3>Manage Books</h3>

        <div className="add-book">
          <input
            type="text"
            placeholder="Enter book title"
            value={newBook}
            onChange={(e) => setNewBook(e.target.value)}
          />
          <button onClick={handleAddBook}>Add</button>
        </div>

        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </section>

      {/* USERS SECTION */}
      <section className="users-section">
        <h3>Borrow / Return Status</h3>

        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Book</th>
              <th>Status</th>
              <th>Fine</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.bookTitle}</td>
                <td>{u.status}</td>
                <td>{u.fine ? `₹${u.fine}` : "No Fine"}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </section>

    </div>
  );
};

export default AdminDashboard;
