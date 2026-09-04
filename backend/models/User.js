import mongoose from "mongoose";

/* ================================
   APPLIED IPO SUB-SCHEMA
================================ */
const appliedIpoSchema = new mongoose.Schema(
  {
    ipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ipo",
      required: true
    },
    pan: { type: String, required: true },
    appliedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "applied",
        "allotted",
        "not_allotted",
        "refund_initiated",
        "listed"
      ],
      default: "applied"
    }
  },
  { _id: false }
);

/* ================================
   USER SCHEMA (FINAL – FINTECH READY)
================================ */
const userSchema = new mongoose.Schema(
  {
    /* ===== BASIC INFO ===== */
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    /* ===== PROFILE DETAILS ===== */
    profile: {
      phone: String,
      pan: String,
      dob: Date
    },

    profilePhoto: {
      type: String,
      default: ""
    },

    kycStatus: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending"
    },

    /* ===== WATCHLIST ===== */
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ipo"
      }
    ],

    /* ===== APPLIED IPOs ===== */
    appliedIpos: [appliedIpoSchema],

    /* ===== ALERT SETTINGS ===== */
    alerts: {
      ipoOpen: { type: Boolean, default: true },
      ipoClose: { type: Boolean, default: true },
      allotment: { type: Boolean, default: true },
      refund: { type: Boolean, default: true },
      listing: { type: Boolean, default: true }
    },

    /* ===== LEGACY / UI FLAGS ===== */
    notifyGmp: { type: Boolean, default: true },
    notifyEmail: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
