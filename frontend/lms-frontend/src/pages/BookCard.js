import React from "react";
import "../styles/BookCard.css";

const BookCard = ({ book, onBorrow, userId }) => {
  const cover =
    book.imageUrl ||
    "https://cdn-icons-png.flaticon.com/512/2232/2232688.png";

  return (
    <article className="bc-card">
      <div className="bc-cover">
        <img src={cover} alt={book.title} />
        <span className={`bc-badge ${book.available ? "available" : "borrowed"}`}>
          {book.available ? "Available" : "Borrowed"}
        </span>
      </div>

      <div className="bc-body">
        <h3 className="bc-title">{book.title}</h3>
        <p className="bc-author">Author: <strong>{book.author || "-"}</strong></p>

        <div className="bc-meta">
          <div><small>Publisher</small><div className="meta-val">{book.publisher || "-"}</div></div>
          <div><small>Category</small><div className="meta-val">{book.category || "-"}</div></div>
          <div><small>Copies</small><div className="meta-val">{book.copies ?? "-"}</div></div>
        </div>

        <div className="bc-actions">
          {book.available ? (
            <button
              onClick={() => onBorrow(book.id)}
              className="bc-btn borrow"
              aria-label={`Borrow ${book.title}`}
            >
              Borrow
            </button>
          ) : (
            <button className="bc-btn disabled" disabled>Not Available</button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookCard;
