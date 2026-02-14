// BorrowModal.jsx
import React from "react";
import "../styles/BorrowModal.css";

const BorrowModal = ({ open, onClose, onConfirm, book }) => {
  if (!open || !book) return null;

  return (
    <div className="bm-overlay">
      <div className="bm-modal">
        <h2>Confirm Borrow</h2>
        <p>
          Are you sure you want to borrow:
          <br />
          <strong>{book.title}</strong>?
        </p>

        <div className="bm-actions">
          <button className="bm-btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="bm-btn confirm" onClick={() => onConfirm(book.id)}>
            Yes, Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;
