import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import IpoForm from "../components/IpoForm";

export default function IpoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ipo, setIpo] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= NORMALIZE IPO DATA ================= */
  const normalizeIpo = (data) => ({
    ...data,

    /* ===== STRING FIELDS ===== */
    companyName: data.companyName || "",
    board: data.board || "",
    status: data.status || "",
    priceBand: data.priceBand || "",
    issueSize: data.issueSize || "",
    about: data.about || "",
    ceo: data.ceo || "",
    founded: data.founded || "",
    videoUrl: data.videoUrl || "",

    /* ===== NUMBER FIELDS ===== */
    lotSize: data.lotSize ?? "",
    gmp: data.gmp ?? "",

    /* ===== DATE FIELDS ===== */
    openDate: data.openDate
      ? data.openDate.slice(0, 10)
      : "",
    closeDate: data.closeDate
      ? data.closeDate.slice(0, 10)
      : "",
    allotmentDate: data.allotmentDate
      ? data.allotmentDate.slice(0, 10)
      : "",
    listingDate: data.listingDate
      ? data.listingDate.slice(0, 10)
      : "",

    /* ===== ARRAYS ===== */
    strengths: Array.isArray(data.strengths)
      ? data.strengths
      : [],
    risks: Array.isArray(data.risks)
      ? data.risks
      : [],
    faqs: Array.isArray(data.faqs)
      ? data.faqs
      : [],
    applicationCategories: Array.isArray(
      data.applicationCategories
    )
      ? data.applicationCategories
      : [],

    financials: {
      revenue: data.financials?.revenue || [],
      profit: data.financials?.profit || [],
      assets: data.financials?.assets || []
    },

    gmpHistory: Array.isArray(data.gmpHistory)
      ? data.gmpHistory
      : []
  });

  /* ================= FETCH IPO ================= */
  useEffect(() => {
    const fetchIpo = async () => {
      try {
        const res = await api.get(`/ipos/${id}`);
        setIpo(normalizeIpo(res.data));
      } catch (err) {
        console.error("Failed to load IPO", err);
        alert("IPO not found");
        navigate("/ipos");
      } finally {
        setLoading(false);
      }
    };

    fetchIpo();
  }, [id, navigate]);

  /* ================= UPDATE IPO ================= */
  const updateIpo = async (data) => {
    try {
      await api.put(`/ipos/${id}`, data);
      alert("IPO updated successfully");
      navigate("/ipos");
    } catch (err) {
      console.error("Update IPO failed", err);
      alert("Failed to update IPO");
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading IPO details...
      </div>
    );
  }

  if (!ipo) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Edit IPO
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update IPO details, GMP, subscriptions & content
        </p>
      </div>

      {/* ================= MAIN FORM ================= */}
      <IpoForm
        initialData={ipo}
        onSubmit={updateIpo}
      />

      {/* ================= GMP HISTORY ================= */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          GMP History
        </h2>

        {ipo.gmpHistory.length === 0 && (
          <p className="text-sm text-gray-500">
            No GMP history available.
          </p>
        )}

        {ipo.gmpHistory.length > 0 && (
          <div className="bg-white/80 backdrop-blur border rounded-2xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">
                    Date & Time
                  </th>
                  <th className="p-3 text-left">
                    GMP (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...ipo.gmpHistory]
                  .reverse()
                  .map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {new Date(item.date).toLocaleString()}
                      </td>
                      <td className="p-3 font-medium">
                        ₹{item.gmp}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
