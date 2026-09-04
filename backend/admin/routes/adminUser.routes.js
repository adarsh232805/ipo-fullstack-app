import express from "express";
import {
  getAllUsers,
  getUserById,
  updateKycStatus,
  toggleUserBlock,
  sendUserEmail,
  sendUserNotification
} from "../controllers/adminUser.controller.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

router.use(adminProtect);

/* USERS */
router.get("/", getAllUsers);
router.get("/:id", getUserById);

/* KYC */
router.patch("/:id/kyc", updateKycStatus);

/* BLOCK */
router.patch("/:id/block", toggleUserBlock);

/* COMMUNICATION */
router.post("/:id/email", sendUserEmail);
router.post("/:id/notify", sendUserNotification);

export default router;
