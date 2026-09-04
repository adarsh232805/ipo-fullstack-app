import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import IpoForm from "../components/IpoForm";

export default function IpoCreate() {
  const navigate = useNavigate();

  const createIpo = async (data) => {
    try {
      await api.post("/ipos", data);
      navigate("/ipos");
    } catch (err) {
      console.error("Create IPO failed", err);
      alert("Failed to create IPO");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Create New IPO
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Add full IPO details that will appear on the website
        </p>
      </div>

      {/* Form */}
      <IpoForm onSubmit={createIpo} />
    </div>
  );
}
