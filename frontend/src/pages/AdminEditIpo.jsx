import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchIpoById } from "../services/api";
import { updateIpo } from "../services/adminApi";
import AdminGmpEditor from "../components/AdminGmpEditor";

export default function AdminEditIpo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ipo, setIpo] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ================= LOAD IPO ================= */
  useEffect(() => {
    fetchIpoById(id).then(d => {
      setIpo({
        ...d,

        // SAFETY DEFAULTS
        subscription: d.subscription || {
          qib: "", nii: "", retail: "",
          employee: "", shareholder: "", total: ""
        },

        applicationDetails: d.applicationDetails || [
          { applyAs: "", priceBand: "", range: "", lot: "" }
        ],

        strengths: d.strengths || [""],
        risks: d.risks || [""],
        faqs: d.faqs || [{ question: "", answer: "" }],

        financials:
          Array.isArray(d.financials)
            ? d.financials
            : [{ year: "", revenue: "", assets: "", profit: "" }]
      });
    });
  }, [id]);

  if (!ipo) return <p>Loading IPO…</p>;

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      setSaving(true);

      // Normalize financials for backend
      const payload = {
        ...ipo,
        financials: {
          revenue: ipo.financials.map(f => ({ year: f.year, value: f.revenue })),
          assets: ipo.financials.map(f => ({ year: f.year, value: f.assets })),
          profit: ipo.financials.map(f => ({ year: f.year, value: f.profit }))
        }
      };

      await updateIpo(id, payload);
      alert("IPO updated successfully");
      navigate("/admin");
    } catch (e) {
      alert("Failed to update IPO");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto space-y-12">

      <h1 className="text-2xl font-semibold">
        Edit IPO – {ipo.companyName}
      </h1>

      {/* BASIC DETAILS */}
      <Section title="Company & IPO Details">
        <Grid>
          <Input label="Company Name" value={ipo.companyName} onChange={v => update("companyName", v)} />
          <Input label="Company Code" value={ipo.company} onChange={v => update("company", v)} />
          <Input label="Price Band" value={ipo.priceBand} onChange={v => update("priceBand", v)} />
          <Input label="Lot Size" value={ipo.lotSize} onChange={v => update("lotSize", v)} />
          <Input label="Min Investment" value={ipo.minInvestment} onChange={v => update("minInvestment", v)} />
          <Input label="Issue Size" value={ipo.issueSize} onChange={v => update("issueSize", v)} />
          <Input label="Current GMP" value={ipo.gmp} onChange={v => update("gmp", v)} />
        </Grid>
      </Section>

      {/* SUBSCRIPTION */}
      <Section title="Subscription">
        <Grid>
          {Object.keys(ipo.subscription).map(k => (
            <Input
              key={k}
              label={k.toUpperCase()}
              value={ipo.subscription[k]}
              onChange={v =>
                setIpo({
                  ...ipo,
                  subscription: { ...ipo.subscription, [k]: v }
                })
              }
            />
          ))}
        </Grid>
      </Section>

      {/* STRENGTHS & RISKS */}
      <Dynamic title="Strengths" list={ipo.strengths} onChange={l => update("strengths", l)} />
      <Dynamic title="Risks" list={ipo.risks} onChange={l => update("risks", l)} />

      {/* FAQ */}
      <Section title="FAQs">
        {ipo.faqs.map((f, i) => (
          <div key={i} className="border p-3 rounded">
            <Input label="Question" value={f.question} onChange={v => updateFaq(i, "question", v)} />
            <Textarea value={f.answer} onChange={v => updateFaq(i, "answer", v)} />
          </div>
        ))}
        <Add onClick={() => setIpo({ ...ipo, faqs: [...ipo.faqs, { question: "", answer: "" }] })} />
      </Section>

      {/* FINANCIALS */}
      <Section title="Financials">
        {ipo.financials.map((f, i) => (
          <Grid key={i}>
            <Input label="Year" value={f.year} onChange={v => updateFin(i, "year", v)} />
            <Input label="Revenue" value={f.revenue} onChange={v => updateFin(i, "revenue", v)} />
            <Input label="Assets" value={f.assets} onChange={v => updateFin(i, "assets", v)} />
            <Input label="Profit" value={f.profit} onChange={v => updateFin(i, "profit", v)} />
            <Remove onClick={() => removeFin(i)} />
          </Grid>
        ))}
        <Add onClick={() =>
          setIpo({
            ...ipo,
            financials: [...ipo.financials, { year: "", revenue: "", assets: "", profit: "" }]
          })
        } />
      </Section>

      {/* GMP DAILY UPDATE */}
      <Section title="Daily GMP Update">
        <button
          onClick={async () => {
            await fetch(
              `http://localhost:5000/api/admin/ipos/${id}/gmp`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ gmp: ipo.gmp })
              }
            );
            alert("GMP updated for today");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update GMP
        </button>
      </Section>

      <AdminGmpEditor ipo={ipo} />

      {/* SAVE */}
      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-2 bg-green-600 text-white rounded"
      >
        {saving ? "Saving…" : "Save All Changes"}
      </button>
    </div>
  );

  /* ===== helpers ===== */

  function update(k, v) {
    setIpo({ ...ipo, [k]: v });
  }

  function updateFaq(i, k, v) {
    const faqs = [...ipo.faqs];
    faqs[i][k] = v;
    setIpo({ ...ipo, faqs });
  }

  function updateFin(i, k, v) {
    const fin = [...ipo.financials];
    fin[i][k] = v;
    setIpo({ ...ipo, financials: fin });
  }

  function removeFin(i) {
    setIpo({ ...ipo, financials: ipo.financials.filter((_, x) => x !== i) });
  }
}

/* UI HELPERS */

function Section({ title, children }) {
  return <div className="space-y-4"><h2 className="text-lg font-semibold">{title}</h2>{children}</div>;
}

function Grid({ children }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>;
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input className="w-full border px-3 py-2 rounded" value={value || ""} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function Textarea({ value, onChange }) {
  return <textarea className="w-full border px-3 py-2 rounded" rows={4} value={value || ""} onChange={e => onChange(e.target.value)} />;
}

function Dynamic({ title, list, onChange }) {
  return (
    <Section title={title}>
      {list.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input className="flex-1 border px-3 py-2 rounded" value={v} onChange={e => {
            const a = [...list]; a[i] = e.target.value; onChange(a);
          }} />
          <button onClick={() => onChange(list.filter((_, x) => x !== i))}>❌</button>
        </div>
      ))}
      <Add onClick={() => onChange([...list, ""])} />
    </Section>
  );
}

function Add({ onClick }) {
  return <button onClick={onClick} className="text-sm text-blue-600">+ Add</button>;
}

function Remove({ onClick }) {
  return <button onClick={onClick} className="text-sm text-red-500">Remove</button>;
}
