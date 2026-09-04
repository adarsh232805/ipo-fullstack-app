import mongoose from "mongoose";

/* ================================
   GMP HISTORY
================================ */
const gmpHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    gmp: { type: Number, required: true }
  },
  { _id: true }
);

/* ================================
   FINANCIAL ITEM
================================ */
const financialItemSchema = new mongoose.Schema(
  {
    year: String,
    value: String
  },
  { _id: false }
);

/* ================================
   FAQ
================================ */
const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String
  },
  { _id: false }
);

/* ================================
   IPO SCHEMA
================================ */
const ipoSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, index: true },

    board: {
      type: String,
      enum: ["MAINBOARD", "SME"],
      default: "MAINBOARD"
    },

    priceBand: String,
    lotSize: Number,
    minInvestment: Number,
    issueSize: String,

    openDate: Date,
    closeDate: Date,
    allotmentDate: Date,
    listingDate: Date,

    status: {
      type: String,
      enum: ["upcoming", "open", "closed", "listed"],
      default: "upcoming",
      index: true
    },

    gmp: { type: Number, default: 0 },
    gmpHistory: [gmpHistorySchema],
    aiPredictionPct: { type: Number, default: 0 },
    gainPerLot: { type: Number, default: 0 },

    subscription: {
      qib: Number,
      nii: Number,
      retail: Number,
      employee: Number,
      shareholder: Number,
      total: Number
    },

    about: String,
    founded: String,
    ceo: String,
    videoUrl: String,

    financials: {
      revenue: [financialItemSchema],
      assets: [financialItemSchema],
      profit: [financialItemSchema]
    },

    strengths: [String],
    risks: [String],
    faqs: [faqSchema],

    /* ===== ALLOTMENT SYSTEM ===== */
    allotmentAvailable: {
      type: Boolean,
      default: false,
      index: true
    },

    allotmentLink: {
      type: String,
      default: ""
    },

    registrar: {
      type: String,
      enum: ["KFIN", "LINKINTIME", "BIGSHARE", "OTHER"],
      default: "KFIN"
    },

    isTrending: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Ipo", ipoSchema);
