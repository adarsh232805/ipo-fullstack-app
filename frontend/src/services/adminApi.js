import axios from "./axiosInstance";

/* ================================
   IPO CRUD (ADMIN)
================================ */

// ✅ Create IPO
export const createIpo = (data) =>
  axios.post("/admin/ipos", data);

// Backward compatibility
export const addIpo = createIpo;

// Get all IPOs
export const getAdminIpos = () =>
  axios.get("/admin/ipos");

// ✅ Get single IPO (aliases)
export const getAdminIpoById = (id) =>
  axios.get(`/admin/ipos/${id}`);

export const getIpo = getAdminIpoById;

// Update IPO (full edit)
export const updateIpo = (id, data) =>
  axios.put(`/admin/ipos/${id}`, data);

// Update IPO status only
export const updateIpoStatus = (id, status) =>
  axios.put(`/admin/ipos/${id}`, { status });

// Delete IPO
export const deleteIpo = (id) =>
  axios.delete(`/admin/ipos/${id}`);


/* ================================
   GMP MANAGEMENT
================================ */

export const updateDailyGmp = (ipoId, gmp) =>
  axios.post(`/admin/ipos/${ipoId}/gmp`, { gmp });

export const updateGmpEntry = (ipoId, date, gmp) =>
  axios.put(`/admin/ipos/${ipoId}/gmp/${date}`, { gmp });

export const deleteGmpEntry = (ipoId, date) =>
  axios.delete(`/admin/ipos/${ipoId}/gmp/${date}`);


/* ================================
   SUBSCRIPTION
================================ */

export const updateSubscription = (ipoId, subscription) =>
  axios.put(`/admin/ipos/${ipoId}/subscription`, subscription);


/* ================================
   APPLICATION DETAILS
================================ */

export const updateApplicationDetails = (ipoId, data) =>
  axios.put(`/admin/ipos/${ipoId}/application-details`, data);


/* ================================
   CMS SECTIONS
================================ */

export const updateAboutCompany = (ipoId, about) =>
  axios.put(`/admin/ipos/${ipoId}/about`, { about });

export const updateStrengths = (ipoId, strengths) =>
  axios.put(`/admin/ipos/${ipoId}/strengths`, { strengths });

export const updateRisks = (ipoId, risks) =>
  axios.put(`/admin/ipos/${ipoId}/risks`, { risks });

export const updateFaqs = (ipoId, faqs) =>
  axios.put(`/admin/ipos/${ipoId}/faqs`, { faqs });

export const updateFinancials = (ipoId, financials) =>
  axios.put(`/admin/ipos/${ipoId}/financials`, { financials });


/* ================================
   MEDIA
================================ */

export const updateIpoVideo = (ipoId, videoUrl) =>
  axios.put(`/admin/ipos/${ipoId}/video`, { videoUrl });

/* ================================
   ANALYTICS & SYSTEM SYNC
================================ */

export const getAdminAnalytics = () =>
  axios.get("/admin/analytics");

export const triggerMarketSync = () =>
  axios.post("/market-sync/trigger");

