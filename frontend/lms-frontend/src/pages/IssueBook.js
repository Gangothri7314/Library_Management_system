import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Issue.css";

const IssueBook = () => {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(()=>{ fetchMembers(); fetchBooks(); }, []);

  const fetchMembers = async ()=> { const res = await api.get("/members"); setMembers(res.data); }
  const fetchBooks = async ()=> { const res = await api.get("/books"); setBooks(res.data.filter(b=>b.available)); }

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/issues/issue?memberId=${memberId}&bookId=${bookId}`);
      setMessage("Issued successfully");
    } catch (err) {
      setMessage(err.response?.data || "Failed to issue");
    }
    fetchBooks();
  };

  return (
    <div className="page">
      <h2>Issue Book</h2>
      <form onSubmit={handleIssue} className="issue-form">
        <label>Member</label>
        <select value={memberId} onChange={e=>setMemberId(e.target.value)} required>
          <option value="">Select member</option>
          {members.map(m=> <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
        </select>

        <label>Book</label>
        <select value={bookId} onChange={e=>setBookId(e.target.value)} required>
          <option value="">Select book</option>
          {books.map(b=> <option key={b.id} value={b.id}>{b.title} - {b.author}</option>)}
        </select>

        <button type="submit">Issue</button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default IssueBook;
