import Ipo from "../../models/Ipo.js";

/* =========================================================
   GET ALL IPOs (SEARCH + FILTER + PAGINATION)
========================================================= */
export const getAllIpos = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 8
    } = req.query;

    const query = {};

    /* 🔍 SEARCH BY COMPANY NAME */
    if (search) {
      query.companyName = {
        $regex: search,
        $options: "i"
      };
    }

    /* 🎯 STATUS FILTER */
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [ipos, total] = await Promise.all([
      Ipo.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Ipo.countDocuments(query)
    ]);

    res.json({
      ipos,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("Fetch IPOs error:", err);
    res.status(500).json({ message: "Failed to fetch IPOs" });
  }
};

/* =========================================================
   CREATE IPO
========================================================= */
export const createIpo = async (req, res) => {
  try {
    const payload = {
      ...req.body,

      /* ✅ GMP HISTORY INIT */
      gmpHistory: req.body.gmp
        ? [{ date: new Date(), gmp: Number(req.body.gmp) }]
        : [],

      /* ✅ SAFE DEFAULTS */
      strengths: req.body.strengths || [],
      risks: req.body.risks || [],
      faqs: req.body.faqs || [],
      applicationCategories: req.body.applicationCategories || [],

      /* ✅ NEW (OPTIONAL) */
      registrar: req.body.registrar || "KFIN",
      registrarUrl: req.body.registrarUrl || ""
    };

    const ipo = await Ipo.create(payload);
    res.status(201).json(ipo);
  } catch (err) {
    console.error("Create IPO error:", err);
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   GET IPO BY ID
========================================================= */
export const getIpoById = async (req, res) => {
  try {
    const ipo = await Ipo.findById(req.params.id);

    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    res.json(ipo);
  } catch (err) {
    res.status(400).json({ message: "Invalid IPO ID" });
  }
};

/* =========================================================
   UPDATE IPO (SAFE + EXTENDED)
========================================================= */
export const updateIpo = async (req, res) => {
  try {
    const ipo = await Ipo.findById(req.params.id);

    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    /* 🔐 SAFE FIELD UPDATE (NO BREAKING) */
    Object.assign(ipo, {
      companyName: req.body.companyName ?? ipo.companyName,
      board: req.body.board ?? ipo.board,
      status: req.body.status ?? ipo.status,
      priceBand: req.body.priceBand ?? ipo.priceBand,
      lotSize: req.body.lotSize ?? ipo.lotSize,
      minInvestment: req.body.minInvestment ?? ipo.minInvestment,
      issueSize: req.body.issueSize ?? ipo.issueSize,

      openDate: req.body.openDate ?? ipo.openDate,
      closeDate: req.body.closeDate ?? ipo.closeDate,
      allotmentDate: req.body.allotmentDate ?? ipo.allotmentDate,
      listingDate: req.body.listingDate ?? ipo.listingDate,

      about: req.body.about ?? ipo.about,
      founded: req.body.founded ?? ipo.founded,
      ceo: req.body.ceo ?? ipo.ceo,
      videoUrl: req.body.videoUrl ?? ipo.videoUrl,

      financials: req.body.financials ?? ipo.financials,
      subscription: req.body.subscription ?? ipo.subscription,

      strengths: req.body.strengths ?? ipo.strengths,
      risks: req.body.risks ?? ipo.risks,
      faqs: req.body.faqs ?? ipo.faqs,

      /* ✅ NEW: ALLOTMENT CONFIG */
      registrar: req.body.registrar ?? ipo.registrar,
      registrarUrl: req.body.registrarUrl ?? ipo.registrarUrl
    });

    await ipo.save();
    res.json(ipo);
  } catch (err) {
    console.error("Update IPO error:", err);
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   DELETE IPO
========================================================= */
export const deleteIpo = async (req, res) => {
  try {
    await Ipo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete IPO" });
  }
};
/* =========================================================
   TOGGLE ALLOTMENT AVAILABILITY + LINK
   ========================================================= */
export const updateAllotmentStatus = async (req, res) => {
  try {
    const { allotmentAvailable, allotmentLink, registrar } = req.body;

    const ipo = await Ipo.findById(req.params.id);
    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    ipo.allotmentAvailable =
      typeof allotmentAvailable === "boolean"
        ? allotmentAvailable
        : ipo.allotmentAvailable;

    ipo.allotmentLink =
      allotmentLink !== undefined
        ? allotmentLink
        : ipo.allotmentLink;

    ipo.registrar =
      registrar !== undefined
        ? registrar
        : ipo.registrar;

    await ipo.save();

    res.json({
      success: true,
      ipo
    });
  } catch (err) {
    console.error("Update allotment error:", err);
    res.status(500).json({ message: "Failed to update allotment status" });
  }
};


/* =========================================================
   UPDATE GMP (WITH HISTORY)
========================================================= */
export const updateGmp = async (req, res) => {
  try {
    const { gmp } = req.body;

    const ipo = await Ipo.findById(req.params.id);
    if (!ipo) {
      return res.status(404).json({ message: "IPO not found" });
    }

    const numericGmp = Number(gmp);
    ipo.gmp = numericGmp;

    if (!Array.isArray(ipo.gmpHistory)) {
      ipo.gmpHistory = [];
    }

    /* ✅ AVOID DUPLICATE SAME-DAY ENTRY */
    const today = new Date().toDateString();
    const last = ipo.gmpHistory.at(-1);

    if (!last || new Date(last.date).toDateString() !== today) {
      ipo.gmpHistory.push({
        date: new Date(),
        gmp: numericGmp
      });
    }

    await ipo.save();
    res.json(ipo);
  } catch (err) {
    console.error("GMP update error:", err);
    res.status(500).json({ message: "Failed to update GMP" });
  }
};
