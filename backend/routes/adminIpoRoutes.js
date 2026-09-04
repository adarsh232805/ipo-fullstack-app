import express from "express";
import Ipo from "../models/Ipo.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { updateAllotmentStatus } from "../controllers/adminIpo.controller.js";

const router = express.Router();

/* ======================================================
   IPO CRUD
====================================================== */

// Get all IPOs
router.get("/", protect, adminOnly, async (req, res) => {
  const ipos = await Ipo.find().sort({ createdAt: -1 });
  res.json(ipos);
});

// Create IPO
router.post("/", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.create(req.body);
  res.json(ipo);
});

// Get IPO by ID
router.get("/:id", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findById(req.params.id);
  res.json(ipo);
});

// Update IPO
router.put("/:id", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(ipo);
});

// Delete IPO
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Ipo.findByIdAndDelete(req.params.id);
  res.json({ message: "IPO deleted" });
});

/* ======================================================
   GMP MANAGEMENT
====================================================== */

// Add / update today's GMP (push to history)
router.post("/:id/gmp", protect, adminOnly, async (req, res) => {
  const { gmp } = req.body;
  const today = new Date().toISOString().split("T")[0];

  const ipo = await Ipo.findById(req.params.id);

  ipo.gmp = gmp;
  ipo.gmpHistory.push({ date: today, gmp });

  await ipo.save();
  res.json(ipo);
});

// Update specific GMP entry
router.put("/:id/gmp/:date", protect, adminOnly, async (req, res) => {
  const { gmp } = req.body;
  const ipo = await Ipo.findById(req.params.id);

  const entry = ipo.gmpHistory.find(
    h => h.date.toISOString().split("T")[0] === req.params.date
  );
  if (entry) entry.gmp = gmp;

  await ipo.save();
  res.json(ipo);
});

// Delete GMP entry
router.delete("/:id/gmp/:date", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findById(req.params.id);
  ipo.gmpHistory = ipo.gmpHistory.filter(
    h => h.date.toISOString().split("T")[0] !== req.params.date
  );
  await ipo.save();
  res.json(ipo);
});

/* ======================================================
   🔥 ALLOTMENT MANAGEMENT (NEW – FIXED)
====================================================== */

router.put(
  "/:id/allotment",
  protect,
  adminOnly,
  updateAllotmentStatus
);

/* ======================================================
   SUBSCRIPTION DATA
====================================================== */

router.put("/:id/subscription", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(
    req.params.id,
    { subscription: req.body },
    { new: true }
  );
  res.json(ipo);
});

/* ======================================================
   APPLICATION DETAILS (TABLE)
====================================================== */

router.put(
  "/:id/application-details",
  protect,
  adminOnly,
  async (req, res) => {
    const ipo = await Ipo.findByIdAndUpdate(
      req.params.id,
      { applicationDetails: req.body },
      { new: true }
    );
    res.json(ipo);
  }
);

/* ======================================================
   CMS SECTIONS
====================================================== */

router.put("/:id/about", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(
    req.params.id,
    { about: req.body.aboutCompany },
    { new: true }
  );
  res.json(ipo);
});

router.put("/:id/strengths", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(
    req.params.id,
    { strengths: req.body.strengths },
    { new: true }
  );
  res.json(ipo);
});

router.put("/:id/risks", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(
    req.params.id,
    { risks: req.body.risks },
    { new: true }
  );
  res.json(ipo);
});

router.put("/:id/faqs", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(
    req.params.id,
    { faqs: req.body.faqs },
    { new: true }
  );
  res.json(ipo);
});

router.put("/:id/financials", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(
    req.params.id,
    { financials: req.body.financials },
    { new: true }
  );
  res.json(ipo);
});

/* ======================================================
   VIDEO
====================================================== */

router.put("/:id/video", protect, adminOnly, async (req, res) => {
  const ipo = await Ipo.findByIdAndUpdate(
    req.params.id,
    { videoUrl: req.body.videoUrl },
    { new: true }
  );
  res.json(ipo);
});

export default router;
