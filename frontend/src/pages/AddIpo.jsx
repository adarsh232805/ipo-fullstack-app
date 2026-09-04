import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addIpo } from "../services/adminApi";

export default function AddIpo() {
  const navigate = useNavigate();

  const [ipo, setIpo] = useState({
    company: "",
    companyName: "",
    priceBand: "",
    lotSize: "",
    minInvestment: "",
    issueSize: "",
    gmp: "",

    biddingStart: "",
    biddingEnd: "",
    allotmentDate: "",
    listingDate: "",

    aboutCompany: "",
    founded: "",
    ceo: "",
    parentOrg: "",

    videoUrl: "",
    videoThumbnail: "",

    strengths: [""],
    risks: [""],

    faqs: [{ question: "", answer: "" }],

    financials: [
      { year: "", revenue: "", assets: "", profit: "" }
    ],

    applicationDetails: [
      {
        applyAs: "Regular",
        priceBand: "",
        range: "",
        lot: ""
      }
    ],

    subscription: {
      qib: "",
      nii: "",
      retail: "",
      employee: "",
      shareholder: "",
      total: ""
    },

    status: "ongoing"
  });

  const handleSubmit = async () => {
    await addIpo(ipo);
    alert("IPO added successfully");
    navigate("/admin");
  };

  return (
    <div className="max-w-4xl space-y-10">

      <h1 className="text-2xl font-semibold">
        Add New IPO
      </h1>

      {/* BASIC DETAILS */}
      <Section title="Basic IPO Details">
        <Input label="Company Code" value={ipo.company}
          onChange={v => setIpo({ ...ipo, company: v })} />
        <Input label="Company Name" value={ipo.companyName}
          onChange={v => setIpo({ ...ipo, companyName: v })} />
        <Input label="Price Band" value={ipo.priceBand}
          onChange={v => setIpo({ ...ipo, priceBand: v })} />
        <Input label="Lot Size" value={ipo.lotSize}
          onChange={v => setIpo({ ...ipo, lotSize: v })} />
        <Input label="Minimum Investment" value={ipo.minInvestment}
          onChange={v => setIpo({ ...ipo, minInvestment: v })} />
        <Input label="Issue Size" value={ipo.issueSize}
          onChange={v => setIpo({ ...ipo, issueSize: v })} />
        <Input label="GMP" value={ipo.gmp}
          onChange={v => setIpo({ ...ipo, gmp: v })} />
      </Section>

      {/* DATES */}
      <Section title="Important Dates">
        <Input label="Bidding Start" value={ipo.biddingStart}
          onChange={v => setIpo({ ...ipo, biddingStart: v })} />
        <Input label="Bidding End" value={ipo.biddingEnd}
          onChange={v => setIpo({ ...ipo, biddingEnd: v })} />
        <Input label="Allotment Date" value={ipo.allotmentDate}
          onChange={v => setIpo({ ...ipo, allotmentDate: v })} />
        <Input label="Listing Date" value={ipo.listingDate}
          onChange={v => setIpo({ ...ipo, listingDate: v })} />
      </Section>

      {/* ABOUT COMPANY */}
      <Section title="About Company">
        <Textarea value={ipo.aboutCompany}
          onChange={v => setIpo({ ...ipo, aboutCompany: v })} />
        <Input label="Founded" value={ipo.founded}
          onChange={v => setIpo({ ...ipo, founded: v })} />
        <Input label="MD / CEO" value={ipo.ceo}
          onChange={v => setIpo({ ...ipo, ceo: v })} />
        <Input label="Parent Organisation" value={ipo.parentOrg}
          onChange={v => setIpo({ ...ipo, parentOrg: v })} />
      </Section>

      {/* VIDEO */}
      <Section title="IPO Video">
        <Input label="YouTube URL" value={ipo.videoUrl}
          onChange={v => setIpo({ ...ipo, videoUrl: v })} />
        <Input label="Thumbnail URL" value={ipo.videoThumbnail}
          onChange={v => setIpo({ ...ipo, videoThumbnail: v })} />
      </Section>

      {/* STRENGTHS */}
      <DynamicList
        title="Strengths"
        list={ipo.strengths}
        onChange={list => setIpo({ ...ipo, strengths: list })}
      />

      {/* RISKS */}
      <DynamicList
        title="Risks"
        list={ipo.risks}
        onChange={list => setIpo({ ...ipo, risks: list })}
      />

      {/* FAQ */}
      <Section title="FAQs">
        {ipo.faqs.map((f, i) => (
          <div key={i} className="border p-3 rounded space-y-2">
            <Input
              label="Question"
              value={f.question}
              onChange={v => {
                const faqs = [...ipo.faqs];
                faqs[i].question = v;
                setIpo({ ...ipo, faqs });
              }}
            />
            <Textarea
              value={f.answer}
              onChange={v => {
                const faqs = [...ipo.faqs];
                faqs[i].answer = v;
                setIpo({ ...ipo, faqs });
              }}
            />
          </div>
        ))}
        <AddBtn onClick={() =>
          setIpo({ ...ipo, faqs: [...ipo.faqs, { question: "", answer: "" }] })
        } />
      </Section>

      {/* SAVE */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-brand text-white rounded-md"
      >
        Save IPO
      </button>
    </div>
  );
}

/* ================= HELPERS ================= */

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        className="w-full border px-3 py-2 rounded"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({ value, onChange }) {
  return (
    <textarea
      className="w-full border px-3 py-2 rounded"
      rows={4}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function DynamicList({ title, list, onChange }) {
  return (
    <Section title={title}>
      {list.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded"
            value={item}
            onChange={e => {
              const arr = [...list];
              arr[i] = e.target.value;
              onChange(arr);
            }}
          />
          <button
            onClick={() => onChange(list.filter((_, x) => x !== i))}
          >
            ❌
          </button>
        </div>
      ))}
      <AddBtn onClick={() => onChange([...list, ""])} />
    </Section>
  );
}

function AddBtn({ onClick }) {
  return (
    <button onClick={onClick} className="text-sm text-brand">
      + Add
    </button>
  );
}
