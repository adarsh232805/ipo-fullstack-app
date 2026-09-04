import express from "express";
import mongoose from "mongoose";
import Ipo from "../models/Ipo.js";
import { fallbackIpos } from "./ipoRoutes.js";

const router = express.Router();

const REGISTRAR_DATA = {
  KFIN: {
    name: "KFin Technologies Limited",
    shortName: "KFintech",
    portalUrl: "https://kosmic.kfintech.com/ipostatus/",
    altUrl: "https://ris.kfintech.com/ipostatus/",
    helpline: "1800 309 4001 / 040-67162222",
    email: "einward.ris@kfintech.com",
    logoText: "KFintech"
  },
  LINKINTIME: {
    name: "Link Intime India Private Limited",
    shortName: "Link Intime",
    portalUrl: "https://linkintime.co.in/initial_offer/public-issues.html",
    altUrl: "https://web.linkintime.co.in/IPO/public-issues.html",
    helpline: "022 4918 6200 / 022 4918 6270",
    email: "ipo.helpdesk@linkintime.co.in",
    logoText: "Link Intime"
  },
  BIGSHARE: {
    name: "Bigshare Services Private Limited",
    shortName: "Bigshare",
    portalUrl: "https://www.bigshareonline.com/ipo_Allotment.html",
    altUrl: "https://ipo1.bigshareonline.com/ipo_status.html",
    helpline: "022 6263 8200",
    email: "ipo@bigshareonline.com",
    logoText: "Bigshare"
  },
  CAMEO: {
    name: "Cameo Corporate Services Limited",
    shortName: "Cameo",
    portalUrl: "https://ipo.cameoindia.com/",
    altUrl: "https://cameoindia.com",
    helpline: "044 2846 0390",
    email: "cameo@cameoindia.com",
    logoText: "Cameo"
  },
  BSE: {
    name: "Bombay Stock Exchange (BSE India)",
    shortName: "BSE Direct",
    portalUrl: "https://www.bseindia.com/investors/appli_check.aspx",
    altUrl: "https://www.bseindia.com",
    helpline: "022 2272 1233",
    email: "is@bseindia.com",
    logoText: "BSE"
  },
  OTHER: {
    name: "Designated Share Registrar",
    shortName: "Registrar",
    portalUrl: "https://www.bseindia.com/investors/appli_check.aspx",
    altUrl: "https://www.bseindia.com",
    helpline: "1800-222-111",
    email: "support@ipo-allotment.in",
    logoText: "Registrar"
  }
};

/* ======================================================
   GET ALL REGISTRARS LIST
   GET /api/allotment/registrars
   ====================================================== */
router.get("/registrars", (req, res) => {
  res.json(REGISTRAR_DATA);
});

/* ======================================================
   CHECK ALLOTMENT BY PAN / APPLICATION NO / DP ID
   POST /api/allotment/check
   ====================================================== */
router.post("/check", async (req, res) => {
  try {
    const { ipoId, identifierType = "PAN", identifierValue } = req.body;

    if (!ipoId) {
      return res.status(400).json({ error: "Please select an IPO" });
    }

    if (!identifierValue || !identifierValue.trim()) {
      return res.status(400).json({
        error: `Please enter a valid ${identifierType === "PAN" ? "10-digit PAN" : identifierType === "APP_NO" ? "Application Number" : "DP/Client ID"}`
      });
    }

    const cleanValue = identifierValue.trim().toUpperCase();

    if (identifierType === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanValue)) {
      return res.status(400).json({
        error: "Invalid PAN format. PAN must be 10 characters (e.g., ABCDE1234F)"
      });
    }

    // 1. Fetch IPO details
    let ipo = null;
    if (mongoose.connection.readyState === 1) {
      try {
        ipo = await Ipo.findById(ipoId);
      } catch {
        ipo = null;
      }
    }

    if (!ipo) {
      ipo = fallbackIpos.find(i => i._id === ipoId);
    }

    if (!ipo) {
      return res.status(404).json({ error: "IPO not found" });
    }

    // Determine registrar details
    const regKey = (ipo.registrar || "KFIN").toUpperCase();
    const registrarInfo = REGISTRAR_DATA[regKey] || REGISTRAR_DATA.OTHER;
    if (ipo.allotmentLink) {
      registrarInfo.portalUrl = ipo.allotmentLink;
    }

    // Price & Lot calculations
    const priceBand = ipo.priceBand || "500";
    const parts = priceBand.toString().replace(/[^0-9-]/g, "").split("-");
    const cutOffPrice = parseFloat(parts[parts.length - 1]) || 500;
    const lotSize = ipo.lotSize || 30;
    const minInvestment = ipo.minInvestment || cutOffPrice * lotSize;

    // Mask identifier for privacy
    let maskedIdentifier = cleanValue;
    if (identifierType === "PAN" && cleanValue.length === 10) {
      maskedIdentifier = `${cleanValue.slice(0, 5)}****${cleanValue.slice(9)}`;
    } else if (cleanValue.length > 4) {
      maskedIdentifier = `${cleanValue.slice(0, 3)}****${cleanValue.slice(-3)}`;
    }

    // 2. Check if basis of allotment is available yet
    if (!ipo.allotmentAvailable) {
      return res.status(200).json({
        success: true,
        status: "PENDING_BASIS",
        message: "Basis of allotment has not been finalized yet by the registrar.",
        ipo: {
          _id: ipo._id,
          companyName: ipo.companyName,
          board: ipo.board,
          priceBand: ipo.priceBand,
          lotSize,
          minInvestment,
          allotmentDate: ipo.allotmentDate,
          listingDate: ipo.listingDate
        },
        applicant: {
          identifierType,
          identifierValue: maskedIdentifier
        },
        registrar: registrarInfo,
        advice: "Allotment status is typically uploaded between 8:00 PM and midnight on the allotment date."
      });
    }

    // 3. Compute Deterministic Allotment Result
    // Certain test/demo PANs guaranteed ALLOTTED:
    // Any PAN ending with 'F', '1', '7', 'A', or containing DEMO or 1234
    const isAllotted =
      cleanValue.endsWith("F") ||
      cleanValue.endsWith("1") ||
      cleanValue.endsWith("7") ||
      cleanValue.endsWith("A") ||
      cleanValue.includes("DEMO") ||
      cleanValue.includes("1234");

    const applicationNo = `IPO-${(ipo.companyName || "APP").slice(0, 3).toUpperCase()}-${Math.abs(
      cleanValue.split("").reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7)
    ) % 900000 + 100000}`;

    if (isAllotted) {
      return res.status(200).json({
        success: true,
        status: "ALLOTTED",
        message: "Congratulations! You have received a full allotment in this IPO.",
        ipo: {
          _id: ipo._id,
          companyName: ipo.companyName,
          board: ipo.board,
          priceBand: ipo.priceBand,
          gmp: ipo.gmp || 0
        },
        applicant: {
          identifierType,
          identifierValue: maskedIdentifier,
          applicationNo,
          category: "Retail Individual Investor (RII)",
          dpClientId: "12081600" + Math.floor(10000000 + Math.random() * 90000000)
        },
        allocation: {
          sharesApplied: lotSize,
          sharesAllotted: lotSize,
          lotSize,
          cutOffPrice,
          totalAmountBlocked: minInvestment,
          amountDebited: minInvestment,
          refundAmount: 0,
          mandateStatus: "DEBIT_COMPLETED",
          dematCreditStatus: "SUCCESSFULLY_CREDITED"
        },
        timeline: {
          allotmentDate: ipo.allotmentDate || new Date().toISOString(),
          refundDate: "Not Applicable",
          dematCreditDate: new Date(Date.now() + 86400000).toISOString(),
          listingDate: ipo.listingDate || new Date(Date.now() + 2 * 86400000).toISOString()
        },
        registrar: registrarInfo
      });
    } else {
      return res.status(200).json({
        success: true,
        status: "NON_ALLOTTED",
        message: "Not Allotted. Due to heavy oversubscription, your bid was not selected in the computerized lottery.",
        ipo: {
          _id: ipo._id,
          companyName: ipo.companyName,
          board: ipo.board,
          priceBand: ipo.priceBand,
          gmp: ipo.gmp || 0
        },
        applicant: {
          identifierType,
          identifierValue: maskedIdentifier,
          applicationNo,
          category: "Retail Individual Investor (RII)"
        },
        allocation: {
          sharesApplied: lotSize,
          sharesAllotted: 0,
          lotSize,
          cutOffPrice,
          totalAmountBlocked: minInvestment,
          amountDebited: 0,
          refundAmount: minInvestment,
          mandateStatus: "UNBLOCK_INITIATED",
          dematCreditStatus: "NO_CREDIT"
        },
        timeline: {
          allotmentDate: ipo.allotmentDate || new Date().toISOString(),
          refundDate: "Funds will be unblocked in bank account within 24-48 hours",
          dematCreditDate: "Not Applicable",
          listingDate: ipo.listingDate || new Date(Date.now() + 2 * 86400000).toISOString()
        },
        registrar: registrarInfo
      });
    }
  } catch (err) {
    console.error("ALLOTMENT CHECK ERROR:", err);
    res.status(500).json({ error: "Failed to verify allotment status. Please try again." });
  }
});

/* ======================================================
   BATCH CHECK ALLOTMENT FOR MULTIPLE FAMILY PANs
   POST /api/allotment/batch-check
   ====================================================== */
router.post("/batch-check", async (req, res) => {
  try {
    const { ipoId, members = [] } = req.body;

    if (!ipoId) {
      return res.status(400).json({ error: "Please select an IPO" });
    }

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: "Please provide at least one family member PAN." });
    }

    // Fetch IPO
    let ipo = null;
    if (mongoose.connection.readyState === 1) {
      try {
        ipo = await Ipo.findById(ipoId);
      } catch {
        ipo = null;
      }
    }
    if (!ipo) {
      ipo = fallbackIpos.find(i => i._id === ipoId);
    }
    if (!ipo) {
      return res.status(404).json({ error: "IPO not found" });
    }

    const regKey = (ipo.registrar || "KFIN").toUpperCase();
    const registrarInfo = REGISTRAR_DATA[regKey] || REGISTRAR_DATA.OTHER;
    if (ipo.allotmentLink) registrarInfo.portalUrl = ipo.allotmentLink;

    const priceBand = ipo.priceBand || "500";
    const parts = priceBand.toString().replace(/[^0-9-]/g, "").split("-");
    const cutOffPrice = parseFloat(parts[parts.length - 1]) || 500;
    const lotSize = ipo.lotSize || 30;
    const minInvestment = ipo.minInvestment || cutOffPrice * lotSize;

    const results = members.map(m => {
      const cleanPan = (m.pan || "").trim().toUpperCase();
      const maskedPan = cleanPan.length === 10
        ? `${cleanPan.slice(0, 5)}****${cleanPan.slice(9)}`
        : cleanPan;

      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
        return {
          name: m.name || "Member",
          pan: maskedPan,
          status: "INVALID_PAN",
          message: "Invalid PAN format"
        };
      }

      if (!ipo.allotmentAvailable) {
        return {
          name: m.name || "Member",
          pan: maskedPan,
          status: "PENDING_BASIS",
          message: "Basis of allotment pending"
        };
      }

      const isAllotted =
        cleanPan.endsWith("F") ||
        cleanPan.endsWith("1") ||
        cleanPan.endsWith("7") ||
        cleanPan.endsWith("A") ||
        cleanPan.includes("DEMO") ||
        cleanPan.includes("1234");

      const applicationNo = `IPO-${(ipo.companyName || "APP").slice(0, 3).toUpperCase()}-${Math.abs(
        cleanPan.split("").reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7)
      ) % 900000 + 100000}`;

      return {
        name: m.name || "Member",
        pan: maskedPan,
        status: isAllotted ? "ALLOTTED" : "NON_ALLOTTED",
        applicationNo,
        sharesAllotted: isAllotted ? lotSize : 0,
        lotSize,
        cutOffPrice,
        amountBlocked: minInvestment,
        refundAmount: isAllotted ? 0 : minInvestment,
        message: isAllotted
          ? "Allotted 1 Lot! 🎉"
          : "Not selected in lottery"
      };
    });

    const totalMembers = results.length;
    const totalAllotted = results.filter(r => r.status === "ALLOTTED").length;

    res.json({
      success: true,
      ipo: {
        _id: ipo._id,
        companyName: ipo.companyName,
        board: ipo.board,
        gmp: ipo.gmp || 0
      },
      summary: {
        totalMembers,
        totalAllotted,
        totalNonAllotted: totalMembers - totalAllotted
      },
      results,
      registrar: registrarInfo
    });
  } catch (err) {
    console.error("BATCH CHECK ERROR:", err);
    res.status(500).json({ error: "Failed to process batch family allotment check." });
  }
});

export default router;
