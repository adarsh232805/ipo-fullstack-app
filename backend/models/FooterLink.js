import mongoose from "mongoose";

const footerLinkSchema = new mongoose.Schema({
  title: String,
  url: String,
  category: {
    type: String,
    enum: ["products", "company", "support"],
    required: true
  },
  order: Number
});

export default mongoose.model("FooterLink", footerLinkSchema);
