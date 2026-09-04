import dotenv from "dotenv";
dotenv.config();

/* ================= CLOUDINARY CHECK ================= */
console.log("CLOUDINARY CHECK →", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING"
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

/* ================= REGISTER MODELS ================= */
import "./models/Ipo.js";
import "./models/User.js";
import "./admin/models/Admin.js";

/* ================= CRON JOBS ================= */
import "./cron/gmpAlertJob.js";
import "./cron/marketDataSyncCron.js";

/* ================= USER / PUBLIC ROUTES ================= */
import ipoRoutes from "./routes/ipoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import userIpoRoutes from "./routes/userIpoRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import footerRoutes from "./routes/footerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import newsRoutes from "./routes/news.js";
import allotmentRoutes from "./routes/allotmentRoutes.js";
import marketSyncRoutes from "./routes/marketSyncRoutes.js";

/* ================= ADMIN ROUTES (NEW SYSTEM) ================= */
import adminAuthRoutes from "./admin/routes/adminAuth.routes.js";
import adminIpoRoutes from "./admin/routes/adminIpo.routes.js";
import adminAnalyticsRoutes from "./admin/routes/adminAnalytics.routes.js";
import adminUserRoutes from "./admin/routes/adminUser.routes.js";

/* ================= APP INIT ================= */
const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= DATABASE ================= */
mongoose.set("bufferCommands", false);

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.warn("⚠️ Mongo connection warning:", err.message);
    console.warn("⚠️ Running backend in mock/resilient fallback mode");
  });


/* ================= PUBLIC / USER APIs ================= */
app.use("/api/ipos", ipoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/user-ipos", userIpoRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/footer-links", footerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/allotment", allotmentRoutes);
app.use("/api", newsRoutes);
app.use("/api", marketSyncRoutes);

/* ================= ADMIN APIs ================= */
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/ipos", adminIpoRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("IPO Backend Running 🚀");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
if (process.env.VERCEL !== "1") {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Backend running on port ${PORT}`)
  );
}

export default app;
