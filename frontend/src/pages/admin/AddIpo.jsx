import React, { useState } from "react";
import { createIpo } from "../../services/adminApi";
import { useNavigate } from "react-router-dom";

export default function AddIpo() {
  const [company, setCompany] = useState("");
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    await createIpo({ company });
    navigate("/admin/ipos");
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Add IPO</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Company Name"
          className="w-full border p-3 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create IPO
        </button>
      </form>
    </div>
  );
}
