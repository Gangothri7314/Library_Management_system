import React, { useEffect, useState } from "react";
import api from "../api/api";
import BookCard from "../pages/BookCard";
import BorrowModal from "../components/BorrowModal";   // ✅ import modal
import "../styles/Dashboard.css";
import "../styles/BookCard.css";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [message, setMessage] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const userName = localStorage.getItem("name") || "User";
  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
    fetchRecentActivity();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const res = await api.get(`/issues/history/${userId}`);
      setBorrowedBooks(res.data || []);
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await api.get(`/issues/recent`);
      setRecentActivity(res.data || []);
    } catch (err) {
      setRecentActivity(borrowedBooks.slice(0, 5));
    }
  };

  /** ============================
   *   OPEN BORROW CONFIRMATION
   *  ============================ */
  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  /** ============================
   *        CONFIRM BORROW
   *  ============================ */
  const confirmBorrow = async (bookId) => {
    setIsModalOpen(false);
    setMessage("");

    try {
      const res = await api.post(
        `/issues/borrow?bookId=${bookId}&memberId=${userId}&memberName=${encodeURIComponent(
          userName
        )}`
      );

      setMessage(
        typeof res.data === "string" ? res.data : "Borrowed successfully"
      );

      await fetchBooks();
      await fetchBorrowedBooks();
      await fetchRecentActivity();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Borrow Error:", err);
      setMessage("Error borrowing book");
    }
  };

  const totalBooks = books.length;
  const availableCount = books.filter((b) => b.available).length;
  const totalCopies = books.reduce((acc, b) => acc + (b.copies ?? 0), 0);
  const onLoanCount = totalCopies - availableCount;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          Welcome back, <span className="user-name">{userName}!</span> 👋
        </h1>
        <p className="tagline">Ready to continue your reading journey?</p>
      </header>

      {message && <div className="message">{message}</div>}

      {/* Metrics + Actions */}
      <section className="section metrics-wrap">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📚</div>
            <div>
              <small>Books Available</small>
              <div className="metric-value">{availableCount}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div>
              <small>Active Readers</small>
              <div className="metric-value">486</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div>
              <small>Books Borrowed</small>
              <div className="metric-value">{borrowedBooks.length}</div>
            </div>
          </div>
        </div>

        <div className="actions-row">
          <button
            className="primary-btn"
            onClick={() => (window.location.href = "/manage-books")}
          >
            Manage Books
          </button>
          <button
            className="ghost-btn"
            onClick={() => (window.location.href = "/add-book")}
          >
            Add New Book
          </button>
        </div>
      </section>

      {/* Main area */}
      <div className="main-grid">
        <div className="book-grid-wrap section">
          <div className="page-head">
            <h2>Book Catalog</h2>
            <input
              placeholder="Search by title or author..."
              className="search-input"
              onChange={(e) => {
                const q = e.target.value.toLowerCase();
                if (!q) fetchBooks();
                else
                  setBooks((prev) =>
                    prev.filter((b) =>
                      `${b.title} ${b.author}`.toLowerCase().includes(q)
                    )
                  );
              }}
            />
          </div>

          {/* Book Cards */}
          <div className="book-grid">
            {books.map((b) => (
              <BookCard
                key={b.id}
                book={b}
                onBorrow={() => handleBorrowClick(b)} // OPEN MODAL
                userId={userId}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="activity-wrap section">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((a, i) => (
                <li key={i} className="activity-item">
                  <div className="act-title">
                    {a.bookTitle || a.title || "Untitled"}
                  </div>
                  <div className="act-meta">
                    {a.returnDate ? "Returned" : "Borrowed"} •{" "}
                    {a.issueDate ? a.issueDate : ""}
                  </div>
                </li>
              ))
            ) : (
              <li className="activity-empty">No recent activity</li>
            )}
          </ul>

          <h3 style={{ marginTop: 20 }}>Your Borrowed Books</h3>
          <div className="borrowed-list">
            {borrowedBooks.length > 0 ? (
              borrowedBooks.map((b) => (
                <div key={b.id} className="borrowed-row">
                  <div className="b-title">{b.bookTitle}</div>
                  <div className="b-meta">
                    {b.returnDate ? "Returned" : "Borrowed"} •{" "}
                    {b.dueDate ?? "-"}
                  </div>
                </div>
              ))
            ) : (
              <div className="borrowed-empty">No borrowed books yet.</div>
            )}
          </div>
        </aside>
      </div>

      {/* Borrow Confirmation Modal */}
      <BorrowModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmBorrow}
        book={selectedBook}
      />
    </div>
  );
};

export default Dashboard;
