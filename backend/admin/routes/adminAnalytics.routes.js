import express from "express";
import { getAdminAnalytics } from "../controllers/adminAnalytics.controller.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

/* 🔐 ADMIN ONLY */
router.use(adminProtect);

router.get("/", getAdminAnalytics);

export default router;
