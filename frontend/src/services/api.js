import axios from "axios";

/* ======================================================
   BASE CONFIG
====================================================== */

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "") + "/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

/* ======================================================
   JWT INTERCEPTOR (SAFE)
====================================================== */

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/* ======================================================
   AUTH APIs
====================================================== */

export const signupUser = async payload => {
  const res = await api.post("/auth/signup", payload);
  return res.data;
};

export const loginUser = async payload => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const fetchMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updatePreferences = async prefs => {
  const res = await api.put("/auth/preferences", prefs);
  return res.data;
};

/* ======================================================
   IPO APIs (PUBLIC)
====================================================== */

export const fetchIpos = async () => {
  const res = await api.get("/ipos");
  return Array.isArray(res.data) ? res.data : [];
};

export const fetchIpoById = async id => {
  if (!id) throw new Error("IPO ID missing");
  const res = await api.get(`/ipos/${id}`);
  return res.data;
};

/* ======================================================
   GMP APIs
====================================================== */

export const fetchGmpData = async () => {
  const res = await api.get("/ipos?includeGmp=true");
  return Array.isArray(res.data) ? res.data : [];
};

/* ======================================================
   WATCHLIST APIs
====================================================== */

export const fetchWatchlist = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];
  try {
    const res = await api.get("/watchlist");
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
};

export const addToWatchlist = async ipoId => {
  if (!ipoId) throw new Error("IPO ID missing");
  const res = await api.post(`/watchlist/${ipoId}`);
  return res.data;
};

export const removeFromWatchlist = async ipoId => {
  if (!ipoId) throw new Error("IPO ID missing");
  const res = await api.delete(`/watchlist/${ipoId}`);
  return res.data;
};

/* ======================================================
   ADMIN IPO APIs
====================================================== */

export const adminAddIpo = async data => {
  const res = await api.post("/admin/ipos", data);
  return res.data;
};

export const adminUpdateIpo = async (id, data) => {
  if (!id) throw new Error("IPO ID missing");
  const res = await api.put(`/admin/ipos/${id}`, data);
  return res.data;
};

export const adminDeleteIpo = async id => {
  if (!id) throw new Error("IPO ID missing");
  const res = await api.delete(`/admin/ipos/${id}`);
  return res.data;
};

/* ======================================================
   ADMIN GMP APIs
====================================================== */

export const adminUpdateGmp = async (ipoId, date, payload) => {
  if (!ipoId || !date) throw new Error("IPO ID / date missing");
  const res = await api.put(
    `/admin/ipos/${ipoId}/gmp/${date}`,
    payload
  );
  return res.data;
};

export const adminDeleteGmp = async (ipoId, date) => {
  if (!ipoId || !date) throw new Error("IPO ID / date missing");
  const res = await api.delete(
    `/admin/ipos/${ipoId}/gmp/${date}`
  );
  return res.data;
};

/* ======================================================
   ADMIN SUBSCRIPTION APIs
====================================================== */

export const adminUpdateSubscription = async (ipoId, data) => {
  if (!ipoId) throw new Error("IPO ID missing");
  const res = await api.put(
    `/admin/ipos/${ipoId}/subscription`,
    data
  );
  return res.data;
};

/* ======================================================
   AI (GROQ) APIs
====================================================== */

export const askGroqAi = async ({ message, ipos }) => {
  const res = await api.post("/ai/groq", {
    message,
    ipos
  });
  return res.data;
};

/* ======================================================
   ALERT APIs
====================================================== */

export const fetchAlerts = async () => {
  const res = await api.get("/alerts");
  return res.data;
};

export const markAlertSeen = async id => {
  await api.put(`/alerts/${id}/seen`);
};

/* ======================================================
   USER IPO APPLICATION
====================================================== */

export const applyIpo = (ipoId, pan) =>
  api.post(`/user-ipos/apply/${ipoId}`, { pan });

export const fetchAppliedIpos = () =>
  api.get("/user-ipos/applied");

/* ======================================================
   IPO ALLOTMENT (FIXED – IMPORTANT)
====================================================== */

/**
 * ✅ CORRECT:
 * - Fetch ALL closed IPOs
 * - Do NOT filter allotmentAvailable here
 * - UI will decide badge & button state
 */
export const fetchClosedIpos = async () => {
  const res = await api.get("/ipos", {
    params: { status: "closed" }
  });

  return Array.isArray(res.data) ? res.data : [];
};

/* ======================================================
   LIVE MARKET TRENDS & AUTO-SYNC APIs
====================================================== */

export const fetchMarketTrends = async (force = false) => {
  const res = await api.get("/market-trends", {
    params: force ? { refresh: "true" } : {}
  });
  return res.data;
};

export const fetchMarketSyncStatus = async () => {
  const res = await api.get("/market-sync/status");
  return res.data;
};

export const triggerMarketSync = async () => {
  const res = await api.post("/market-sync/trigger");
  return res.data;
};

export const fetchMarketSources = async () => {
  const res = await api.get("/market-sync/sources");
  return res.data;
};

export const fetchGrowwLive = async () => {
  const res = await api.get("/market-sync/groww-live");
  return res.data;
};

export const fetchNseLive = async () => {
  const res = await api.get("/market-sync/nse-live");
  return res.data;
};

/* ======================================================
   DEFAULT EXPORT
====================================================== */

export default api;

