import React, { useEffect, useState } from "react";
import { fetchIpos } from "../services/api";
import IpoCompareTable from "../components/IpoCompareTable";

export default function CompareIpos() {
  const [ipos, setIpos] = useState([]);
  const [selectedIpos, setSelectedIpos] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  /* ================= FETCH IPOs ================= */
  useEffect(() => {
    const load = async () => {
      const data = await fetchIpos();
      setIpos(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  /* ================= SELECT IPO ================= */
  const toggleIpo = ipo => {
    const exists = selectedIpos.find(i => i._id === ipo._id);

    if (exists) {
      setSelectedIpos(selectedIpos.filter(i => i._id !== ipo._id));
    } else {
      if (selectedIpos.length >= 3) {
        alert("You can compare maximum 3 IPOs");
        return;
      }
      setSelectedIpos([...selectedIpos, ipo]);
    }
  };

  /* ================= AI COMPARISON ================= */
  const runAiComparison = async () => {
    if (selectedIpos.length < 2) {
      alert("Select at least 2 IPOs");
      return;
    }

    setLoadingAi(true);
    setAiSummary("");

    try {
      const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/ai/groq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            "Compare these IPOs for a retail investor. Analyze GMP, subscription, risks, strengths and long-term safety.",
          ipos: selectedIpos
        })
      });

      const data = await res.json();
      setAiSummary(data.reply);
    } catch {
      setAiSummary("AI analysis failed.");
    } finally {
      setLoadingAi(false);
    }
  };

  /* ================= AI CHAT ================= */
  const askAi = async () => {
    if (!chatQuestion.trim()) return;

    setLoadingAi(true);
    setChatReply("");

    try {
      const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/ai/groq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatQuestion,
          ipos: selectedIpos
        })
      });

      const data = await res.json();
      setChatReply(data.reply);
    } catch {
      setChatReply("AI failed to respond.");
    } finally {
      setLoadingAi(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">Compare IPOs</h1>
      <p className="text-gray-500 mb-6">
        Select 2–3 IPOs to compare fundamentals, GMP, subscription & AI insights
      </p>

      {/* IPO SELECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {ipos.map(ipo => {
          const active = selectedIpos.find(i => i._id === ipo._id);
          return (
            <div
              key={ipo._id}
              onClick={() => toggleIpo(ipo)}
              className={`cursor-pointer border rounded-xl p-4 transition
                ${active ? "border-blue-600 bg-blue-50" : "hover:border-gray-400"}
              `}
            >
              <h3 className="font-semibold">{ipo.company}</h3>
              <p className="text-sm text-gray-500">{ipo.priceBand}</p>

              <div className="mt-2 text-sm space-y-1">
                <p>GMP: ₹{ipo.gmp ?? 0}</p>
                <p>Retail Sub: {ipo.subscription?.retail ?? "N/A"}x</p>
                <p>Status: {ipo.status}</p>
              </div>

              {active && (
                <p className="mt-2 text-xs text-blue-600 font-medium">
                  ✓ Selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {selectedIpos.length < 2 && (
        <div className="border rounded-xl p-6 text-center text-gray-500 mb-10">
          Select at least <b>2 IPOs</b> to view comparison
        </div>
      )}

      {/* CORE COMPARISON TABLE (OLD FEATURE PRESERVED) */}
      <IpoCompareTable ipos={selectedIpos} />

      {/* AI COMPARISON */}
      <div className="border rounded-xl p-6 mb-10 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Comparison Analysis</h2>
          <button
            onClick={runAiComparison}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Analyze with AI
          </button>
        </div>

        {loadingAi && <p className="text-gray-500">Analyzing IPOs…</p>}

        {!aiSummary && !loadingAi && (
          <p className="text-gray-400 text-sm">
            AI will analyze selected IPOs using GMP, subscription & risk factors
          </p>
        )}

        {aiSummary && (
          <div className="whitespace-pre-line text-gray-800 mt-4">
            {aiSummary}
          </div>
        )}
      </div>

      {/* AI CHAT */}
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">
          Ask AI about selected IPOs
        </h2>

        <textarea
          value={chatQuestion}
          onChange={e => setChatQuestion(e.target.value)}
          placeholder="Ask about long-term safety, listing gains, risks…"
          className="w-full p-3 rounded-lg text-black mb-3"
          rows={3}
        />

        <button
          onClick={askAi}
          className="bg-green-500 px-4 py-2 rounded-lg"
        >
          Ask AI
        </button>

        {loadingAi && <p className="mt-3 text-gray-400">Thinking…</p>}

        {chatReply && (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg whitespace-pre-line">
            {chatReply}
          </div>
        )}
      </div>
    </div>
  );
}
