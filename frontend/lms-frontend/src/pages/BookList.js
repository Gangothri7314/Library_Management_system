// src/pages/BookList.js
import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/BookCard.css";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="book-page">
      <h2 className="title">Book Catalog</h2>

      <div className="book-grid">
        {books.map((book) => (
          <div className="book-card" key={book.id}>
            <div className="img-wrapper">
              <img
                src={
                  book.imageUrl ||
                  "https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
                }
                alt={book.title}
              />
              <span className={`badge ${book.available ? "green" : "red"}`}>
                {book.available ? "Available" : "Borrowed"}
              </span>
            </div>

            <div className="content">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Publisher:</strong> {book.publisher}</p>
              <p><strong>Category:</strong> {book.category}</p>

              {book.available ? (
                <button className="borrow-btn">Borrow</button>
              ) : (
                <button className="disabled-btn" disabled>Not Available</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
