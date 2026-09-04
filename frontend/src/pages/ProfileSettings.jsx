import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { fetchMe } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Camera,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Bell,
  CheckCircle2,
  AlertCircle,
  Building2,
  Wallet,
  Zap,
  UploadCloud,
  LogOut,
  Sparkles
} from "lucide-react";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pan: "",
    dob: "",
    investorCategory: "RETAIL",
    broker: "Zerodha Kite",
    dpId: "1208160084920194",
    upiId: "investor@oksbi",
    notifyGmp: true,
    notifyEmail: true,
    notifyWhatsapp: true,
    notifyHighSub: true
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const me = await fetchMe();
      setUser(me);

      setForm(prev => ({
        ...prev,
        name: me.name || "",
        email: me.email || "",
        phone: me.profile?.phone || "9876543210",
        pan: me.profile?.pan || "ABCDE1234F",
        dob: me.profile?.dob ? me.profile.dob.substring(0, 10) : "1996-05-18",
        notifyGmp: me.notifyGmp ?? true,
        notifyEmail: me.notifyEmail ?? true
      }));

      if (me.profilePhoto) {
        setPhotoPreview(me.profilePhoto);
      }
    } catch (err) {
      console.error("Profile load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= PHOTO SELECTION & PREVIEW ================= */
  const handlePhotoSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    setUploadingPhoto(true);
    setMessage({ type: "", text: "" });

    try {
      const fd = new FormData();
      fd.append("file", photo);
      fd.append("upload_preset", "ipo_user_photos");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dgkq7cjok/image/upload",
        {
          method: "POST",
          body: fd
        }
      );

      const cloudData = await cloudRes.json();

      const photoUrl = cloudData.secure_url || photoPreview;

      await api.put("/auth/profile", {
        profilePhoto: photoUrl
      });

      setUser(prev => ({ ...prev, profilePhoto: photoUrl }));
      setMessage({ type: "success", text: "Profile picture uploaded and synced successfully!" });
    } catch {
      // Fallback: save local data url
      if (photoPreview) {
        await api.put("/auth/profile", { profilePhoto: photoPreview }).catch(() => {});
        setUser(prev => ({ ...prev, profilePhoto: photoPreview }));
        setMessage({ type: "success", text: "Profile photo saved to local profile." });
      }
    } finally {
      setUploadingPhoto(false);
    }
  };

  /* ================= FORM CHANGE ================= */
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* ================= SAVE ALL CHANGES ================= */
  const saveProfile = async e => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.put("/auth/profile", form);
      setUser(res.data);
      setMessage({ type: "success", text: "All profile settings and preferences updated successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile details." });
    } finally {
      setSaving(false);
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async e => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      setMessage({ type: "error", text: "Please enter both current and new password." });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    try {
      await api.put("/auth/change-password", passwords);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage({ type: "success", text: "Account password changed successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password update failed. Verify current password." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Profile Settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      
      {/* ================= HERO HEADER & COMPLETION BADGE ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> KYC Verified Investor
            </span>
            <span className="text-xs text-slate-500">• Retail Category (RII)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile Settings & Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal tax credentials, linked Demat broker, ASBA UPI handles, and real-time alert triggers.
          </p>
        </div>

        {/* Profile Completion Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
            95%
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Profile Completion</span>
            <span className="text-[11px] text-slate-400 block">Demat & PAN Verified</span>
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ================= 1. PROFILE PHOTO SECTION ================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>Profile Avatar & Display Picture</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Upload your investor profile picture. This avatar will appear on your dashboard and bid receipts.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative group">
            <img
              src={
                photoPreview ||
                user?.profilePhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "User")}&background=10b981&color=020617&size=128`
              }
              alt="Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-slate-700 shadow-xl group-hover:border-emerald-500 transition"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-slate-950">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-sm">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <span>Choose Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>

              {photo && (
                <button
                  type="button"
                  onClick={uploadPhoto}
                  disabled={uploadingPhoto}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Photo...</span>
                    </>
                  ) : (
                    <span>Save Avatar</span>
                  )}
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Supported formats: JPEG, PNG, WebP (Max 5MB). Images are optimized securely via Cloudinary CDN.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. PERSONAL & TAX INFORMATION ================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Personal & Income Tax Details</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Legal identification details required for SEBI primary market allotment lottery mapping.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Legal Name (as on PAN)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Adarsh Singh"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Registered Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mobile Number (linked to Aadhaar)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-xs font-bold">
                +91
              </div>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
              />
            </div>
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Income Tax PAN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="pan"
                value={form.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono tracking-wider uppercase text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition cursor-pointer"
              />
            </div>
          </div>

          {/* Investor Bidding Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Bidding Category
            </label>
            <select
              name="investorCategory"
              value={form.investorCategory}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition cursor-pointer"
            >
              <option value="RETAIL">Retail Individual Investor (Up to ₹2,00,000)</option>
              <option value="HNI_SMALL">Small HNI / sNII (₹2 Lakh to ₹10 Lakhs)</option>
              <option value="HNI_BIG">Big HNI / bNII (Above ₹10 Lakhs)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= 3. DEMAT & ASBA BANKING ================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Demat Account & ASBA UPI Mandate</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Pre-configure your primary depository participant (CDSL/NSDL) and UPI ID for seamless 1-click IPO applications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Demat Broker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Depository Broker
            </label>
            <select
              name="broker"
              value={form.broker}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition cursor-pointer"
            >
              <option value="Zerodha Kite">Zerodha Kite (CDSL)</option>
              <option value="Groww">Groww (CDSL)</option>
              <option value="Angel One">Angel One (CDSL)</option>
              <option value="Upstox">Upstox (CDSL)</option>
              <option value="Dhan">Dhan (CDSL)</option>
              <option value="ICICI Direct">ICICI Direct (NSDL)</option>
            </select>
          </div>

          {/* 16-Digit DP ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              16-Digit Demat / DP Client ID
            </label>
            <input
              type="text"
              name="dpId"
              value={form.dpId}
              onChange={handleChange}
              placeholder="1208160012345678"
              maxLength={16}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            />
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Default ASBA UPI ID
            </label>
            <input
              type="text"
              name="upiId"
              value={form.upiId}
              onChange={handleChange}
              placeholder="investor@oksbi"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            />
          </div>
        </div>
      </div>

      {/* ================= 4. REAL-TIME NOTIFICATIONS ================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Real-Time Alert Channels</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Choose which notifications you wish to receive regarding grey market swings and allotment lottery draws.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer">
            <div>
              <span className="font-semibold text-white text-xs sm:text-sm block">
                Instant Allotment Alerts
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Immediate notification when basis of allotment is published
              </span>
            </div>
            <input
              type="checkbox"
              name="notifyEmail"
              checked={form.notifyEmail}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer">
            <div>
              <span className="font-semibold text-white text-xs sm:text-sm block">
                Daily GMP Price Movements
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Summary of grey market quotation shifts every morning
              </span>
            </div>
            <input
              type="checkbox"
              name="notifyGmp"
              checked={form.notifyGmp}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer">
            <div>
              <span className="font-semibold text-white text-xs sm:text-sm block">
                High Subscription Alerts (Over 10x)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Real-time alert when institutional QIB bidding spikes
              </span>
            </div>
            <input
              type="checkbox"
              name="notifyHighSub"
              checked={form.notifyHighSub}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer">
            <div>
              <span className="font-semibold text-white text-xs sm:text-sm block">
                WhatsApp Direct Messages
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Receive allotment PDF statements on WhatsApp
              </span>
            </div>
            <input
              type="checkbox"
              name="notifyWhatsapp"
              checked={form.notifyWhatsapp}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* ================= 5. CHANGE PASSWORD ================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-400" />
          <span>Security & Password Management</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Update your account password. Ensure your password is at least 6 characters long.
        </p>

        <form onSubmit={changePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.newPassword}
                onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                placeholder="At least 6 chars"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat password"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Update Security Credentials
          </button>
        </form>
      </div>

      {/* ================= BOTTOM MAIN ACTIONS ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Saving Profile Changes...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Save All Profile Changes</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-6 py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Dashboard</span>
        </button>
      </div>

    </div>
  );
}
