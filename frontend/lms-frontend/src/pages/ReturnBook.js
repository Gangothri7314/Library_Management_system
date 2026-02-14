import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Issue.css";

const ReturnBook = () => {
  const [issued, setIssued] = useState([]);

  const fetchIssued = async ()=> {
    const res = await api.get("/issues/issued");
    setIssued(res.data);
  };

  useEffect(()=>{ fetchIssued(); }, []);

  const handleReturn = async (id) => {
    try {
      await api.post(`/issues/return?issueId=${id}`);
      fetchIssued();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h2>Currently Issued</h2>
      <table className="simple-table">
        <thead><tr><th>Member</th><th>Book</th><th>Due</th><th>Action</th></tr></thead>
        <tbody>
          {issued.map(i => (
            <tr key={i.id}>
              <td>{i.member?.name}</td>
              <td>{i.book?.title}</td>
              <td>{i.dueDate}</td>
              <td><button onClick={()=>handleReturn(i.id)}>Return</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnBook;
