import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Member.css";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  return (
    <div className="page">
      <h2>Members</h2>
      <table className="simple-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Plan</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.planType}</td>
              <td>
                <button onClick={() => setSelected(m)}>Edit</button>
                <button onClick={async ()=>{ await api.delete(`/members/${m.id}`); fetchMembers(); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <MemberForm member={selected} onSaved={()=>{ setSelected(null); fetchMembers(); }} />
      )}
    </div>
  );
};

export default MemberList;

function MemberForm({ member, onSaved }) {
  const [form, setForm] = useState({...member});

  const handleSave = async (e) => {
    e.preventDefault();
    await api.put(`/members/${member.id}`, form);
    onSaved();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSave} className="form">
        <h3>Edit Member</h3>
        <input value={form.name || ""} onChange={e=>setForm({...form, name:e.target.value})} />
        <input value={form.email || ""} onChange={e=>setForm({...form, email:e.target.value})} />
        <input value={form.contact || ""} onChange={e=>setForm({...form, contact:e.target.value})} />
        <select value={form.planType || "STANDARD"} onChange={e=>setForm({...form, planType:e.target.value})}>
          <option>STANDARD</option>
          <option>PREMIUM</option>
        </select>
        <button type="submit">Save</button>
        <button type="button" onClick={onSaved}>Cancel</button>
      </form>
    </div>
  );
}
