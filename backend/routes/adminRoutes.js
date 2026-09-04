import express from "express";
import Ipo from "../models/Ipo.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ======================================================
   ADD IPO
   POST /api/admin/ipos
====================================================== */
router.post("/ipos", protect, adminOnly, async (req, res) => {
  try {
    const ipo = await Ipo.create(req.body);
    res.status(201).json(ipo);
  } catch (err) {
    console.error("ADD IPO ERROR:", err);
    res.status(500).json({ message: "Failed to add IPO" });
  }
});

/* ======================================================
   UPDATE IPO (FULL CMS)
   PUT /api/admin/ipos/:id
====================================================== */
router.put("/ipos/:id", protect, adminOnly, async (req, res) => {
  try {
    const ipo = await Ipo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    res.json(ipo);
  } catch (err) {
    console.error("UPDATE IPO ERROR:", err);
    res.status(500).json({ message: "Failed to update IPO" });
  }
});

/* ======================================================
   DELETE IPO
   DELETE /api/admin/ipos/:id
====================================================== */
router.delete("/ipos/:id", protect, adminOnly, async (req, res) => {
  try {
    await Ipo.findByIdAndDelete(req.params.id);
    res.json({ message: "IPO deleted successfully" });
  } catch (err) {
    console.error("DELETE IPO ERROR:", err);
    res.status(500).json({ message: "Failed to delete IPO" });
  }
});

/* ======================================================
   ADD / UPDATE GMP (TODAY)
   POST /api/admin/ipos/:id/gmp
====================================================== */
router.post("/ipos/:id/gmp", protect, adminOnly, async (req, res) => {
  try {
    const { gmp } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const ipo = await Ipo.findById(req.params.id);
    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    // Update current GMP
    ipo.gmp = gmp;

    // Push to history
    ipo.gmpHistory = ipo.gmpHistory || [];
    ipo.gmpHistory.push({ date: today, gmp });

    // Keep last 10 records only
    ipo.gmpHistory = ipo.gmpHistory.slice(-10);

    await ipo.save();
    res.json(ipo);
  } catch (err) {
    console.error("GMP UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to update GMP" });
  }
});

/* ======================================================
   UPDATE GMP ENTRY (EDIT BY DATE)
   PUT /api/admin/ipos/:id/gmp/:date
====================================================== */
router.put(
  "/ipos/:id/gmp/:date",
  protect,
  adminOnly,
  async (req, res) => {
    const { gmp } = req.body;
    const { id, date } = req.params;

    if (gmp === undefined) {
      return res.status(400).json({ message: "GMP required" });
    }

    await Ipo.updateOne(
      { _id: id, "gmpHistory.date": date },
      { $set: { "gmpHistory.$.gmp": gmp, gmp } }
    );

    res.json({ message: "GMP updated" });
  }
);

/* ======================================================
   DELETE GMP ENTRY
   DELETE /api/admin/ipos/:id/gmp/:date
====================================================== */
router.delete(
  "/ipos/:id/gmp/:date",
  protect,
  adminOnly,
  async (req, res) => {
    const { id, date } = req.params;

    await Ipo.updateOne(
      { _id: id },
      { $pull: { gmpHistory: { date } } }
    );

    res.json({ message: "GMP entry deleted" });
  }
);

export default router;
