import express from "express";
import Ipo from "../../models/Ipo.js";
import adminProtect from "../middleware/adminProtect.js";
import {
  getAllIpos,
  createIpo,
  getIpoById,
  updateIpo,
  deleteIpo,
  updateGmp,
  updateAllotmentStatus
} from "../controllers/adminIpo.controller.js";

const router = express.Router();

/* 🔐 ADMIN ONLY */
router.use(adminProtect);

/* ================= IPO CRUD ================= */
router.get("/", getAllIpos);
router.post("/", createIpo);
router.get("/:id", getIpoById);
router.put("/:id", updateIpo);
router.delete("/:id", deleteIpo);

/* ================= GMP ================= */
router.put("/:id/gmp", updateGmp);
router.post("/:id/gmp", updateGmp);

/* ================= 🔥 ALLOTMENT (FIXED) ================= */
router.put("/:id/allotment", updateAllotmentStatus);

export default router;
