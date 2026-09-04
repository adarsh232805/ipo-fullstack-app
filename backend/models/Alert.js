import mongoose from "mongoose";

/* ================================
   ALERT SCHEMA
   ================================ */
const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    ipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ipo",
      required: true
    },

    message: {
      type: String,
      required: true
    },

    seen: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* ================================
   EXPORT MODEL
   ================================ */
const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
