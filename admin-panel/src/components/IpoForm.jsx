import { useState } from "react";
import ApplicationCategoriesEditor from "./ApplicationCategoriesEditor";
import FinancialEditor from "./FinancialEditor";

export default function IpoForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    companyName: "",
    board: "MAINBOARD",
    status: "upcoming",

    openDate: "",
    closeDate: "",
    allotmentDate: "",
    listingDate: "",

    gmp: 0,

    subscription: {
      qib: "",
      nii: "",
      retail: "",
      employee: "",
      shareholder: "",
      total: ""
    },

    applicationCategories: [],

    founded: "",
    ceo: "",
    about: "",

    financials: {
      revenue: [],
      profit: [],
      assets: []
    },

    strengths: [],
    risks: [],
    faqs: [],

    ...initialData
  });

  /* ================= HELPERS ================= */
  const update = (key, value) =>
    setForm({ ...form, [key]: value });

  const updateNested = (parent, key, value) =>
    setForm({
      ...form,
      [parent]: { ...form[parent], [key]: value }
    });

  const addItem = (key) =>
    setForm({ ...form, [key]: [...form[key], ""] });

  const updateArrayItem = (key, index, value) => {
    const arr = [...form[key]];
    arr[index] = value;
    setForm({ ...form, [key]: arr });
  };

  const removeArrayItem = (key, index) => {
    const arr = [...form[key]];
    arr.splice(index, 1);
    setForm({ ...form, [key]: arr });
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-12">

      {/* ================= IPO DETAILS ================= */}
      <Card title="IPO Details">
        <Input
          label="Company Name"
          value={form.companyName}
          onChange={(v) => update("companyName", v)}
        />

        <Select
          label="Board"
          value={form.board}
          onChange={(v) => update("board", v)}
          options={["MAINBOARD", "SME"]}
        />

        <Select
          label="Status"
          value={form.status}
          onChange={(v) => update("status", v)}
          options={["upcoming", "open", "closed", "listed"]}
        />

        <DateGrid form={form} update={update} />
      </Card>

      {/* ================= GMP ================= */}
      <Card title="Grey Market Premium (GMP)">
        <Input
          label="Current GMP (₹)"
          type="number"
          value={form.gmp}
          onChange={(v) => update("gmp", Number(v))}
        />
      </Card>

      {/* ================= SUBSCRIPTION ================= */}
      <Card title="Subscription Status">
        {["qib", "nii", "retail", "employee", "shareholder", "total"].map(
          (k) => (
            <Input
              key={k}
              label={k.toUpperCase()}
              value={form.subscription[k]}
              onChange={(v) =>
                updateNested("subscription", k, v)
              }
            />
          )
        )}
      </Card>
{/* ================= ALLOTMENT ================= */}
<div className="grid md:grid-cols-2 gap-4">
  <div>
    <label className="text-sm font-medium">Registrar</label>
    <select
      value={form.registrar || ""}
      onChange={e =>
        setForm({ ...form, registrar: e.target.value })
      }
      className="w-full border rounded-lg px-3 py-2"
    >
      <option value="">Select</option>
      <option value="KFIN">KFin Technologies</option>
      <option value="LINKINTIME">Link Intime</option>
      <option value="BIGSHARE">Bigshare</option>
      <option value="OTHER">Other</option>
    </select>
  </div>

  <div>
    <label className="text-sm font-medium">
      Allotment URL (Registrar)
    </label>
    <input
      value={form.registrarUrl || ""}
      onChange={e =>
        setForm({ ...form, registrarUrl: e.target.value })
      }
      placeholder="https://kfintech.com/ipo/allotment"
      className="w-full border rounded-lg px-3 py-2"
    />
  </div>
</div>

      {/* ================= APPLICATION CATEGORIES ================= */}
      <ApplicationCategoriesEditor
        value={form.applicationCategories}
        onChange={(val) =>
          update("applicationCategories", val)
        }
      />

      {/* ================= ABOUT ================= */}
      <Card title="About Company">
        <Input
          label="Founded"
          value={form.founded}
          onChange={(v) => update("founded", v)}
        />
        <Input
          label="CEO"
          value={form.ceo}
          onChange={(v) => update("ceo", v)}
        />
        <Textarea
          label="Company Description"
          value={form.about}
          onChange={(v) => update("about", v)}
        />
      </Card>

      {/* ================= FINANCIAL PERFORMANCE ================= */}
      <FinancialEditor
        title="Revenue (₹ Cr)"
        data={form.financials.revenue}
        onChange={(v) =>
          updateNested("financials", "revenue", v)
        }
      />

      <FinancialEditor
        title="Profit (₹ Cr)"
        data={form.financials.profit}
        onChange={(v) =>
          updateNested("financials", "profit", v)
        }
      />

      <FinancialEditor
        title="Assets (₹ Cr)"
        data={form.financials.assets}
        onChange={(v) =>
          updateNested("financials", "assets", v)
        }
      />

      {/* ================= STRENGTHS ================= */}
      <ListEditor
        title="Strengths"
        items={form.strengths}
        onAdd={() => addItem("strengths")}
        onUpdate={(i, v) =>
          updateArrayItem("strengths", i, v)
        }
        onRemove={(i) =>
          removeArrayItem("strengths", i)
        }
      />

      {/* ================= RISKS ================= */}
      <ListEditor
        title="Risks"
        items={form.risks}
        onAdd={() => addItem("risks")}
        onUpdate={(i, v) =>
          updateArrayItem("risks", i, v)
        }
        onRemove={(i) =>
          removeArrayItem("risks", i)
        }
      />

      {/* ================= FAQs ================= */}
      <Card title="FAQs">
        {form.faqs.map((f, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              placeholder="Question"
              className="border p-2 rounded"
              value={f.question}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i].question = e.target.value;
                setForm({ ...form, faqs });
              }}
            />
            <input
              placeholder="Answer"
              className="border p-2 rounded"
              value={f.answer}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i].answer = e.target.value;
                setForm({ ...form, faqs });
              }}
            />
          </div>
        ))}

        <button
          onClick={() =>
            update("faqs", [
              ...form.faqs,
              { question: "", answer: "" }
            ])
          }
          className="text-sm text-blue-600"
        >
          + Add FAQ
        </button>
      </Card>

      {/* ================= SUBMIT ================= */}
      <button
        onClick={() => onSubmit(form)}
        className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition"
      >
        Save IPO
      </button>
    </div>
  );
}

/* ================= UI HELPERS ================= */

const Card = ({ title, children }) => (
  <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-6 space-y-4 shadow">
    <h2 className="text-lg font-semibold text-gray-800">
      {title}
    </h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm text-gray-500">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-slate-800 outline-none"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-500">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg p-2 h-32 focus:ring-2 focus:ring-slate-800 outline-none"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm text-gray-500">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg p-2 bg-white"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const ListEditor = ({ title, items, onAdd, onUpdate, onRemove }) => (
  <Card title={title}>
    {items.map((item, i) => (
      <div key={i} className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={item}
          onChange={(e) => onUpdate(i, e.target.value)}
        />
        <button
          onClick={() => onRemove(i)}
          className="text-red-600"
        >
          ✕
        </button>
      </div>
    ))}
    <button
      onClick={onAdd}
      className="text-sm text-blue-600"
    >
      + Add {title}
    </button>
  </Card>
);

const DateGrid = ({ form, update }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      "openDate",
      "closeDate",
      "allotmentDate",
      "listingDate"
    ].map((d) => (
      <Input
        key={d}
        label={d}
        type="date"
        value={form[d]?.slice(0, 10) || ""}
        onChange={(v) => update(d, v)}
      />
    ))}
  </div>
);
