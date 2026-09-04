import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = async (e, customEmail, customPass) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const targetEmail = customEmail || email;
    const targetPassword = customPass || password;

    try {
      await login(targetEmail, targetPassword);
      navigate("/dashboard/profile");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@ipo.com");
    setPassword("password123");
    handleLogin(null, "demo@ipo.com", "password123");
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email address above first.");
      return;
    }
    setError("");
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Ambient background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN: HERO / VALUE PROP (Visible on desktop & tablet) ================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
            <div>
              {/* Brand Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <TrendingUp className="w-3.5 h-3.5" />
                India's #1 IPO & GMP Intelligence Platform
              </div>

              <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Invest with clarity. <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Track every GMP tick.
                </span>
              </h1>
              <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-lg">
                Join over 45,000+ smart retail and HNI investors who leverage real-time grey market premiums, AI subscription forecasts, and instant allotment notifications.
              </p>
            </div>

            {/* Live Preview Card Widget */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-inner">
                    T
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Tata Technologies Ltd</h4>
                    <span className="text-xs text-slate-400">Mainboard • Bidding Closed</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  GMP +96.4%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Issue Price</span>
                  <span className="font-semibold text-white mt-0.5 block">₹500</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Est. Listing</span>
                  <span className="font-semibold text-emerald-400 mt-0.5 block">₹982 (+96%)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Subscription</span>
                  <span className="font-semibold text-indigo-300 mt-0.5 block">69.43x</span>
                </div>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Live GMP tracking updated every 15 minutes from 12+ brokers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>AI-driven risk scoring, fair value estimation & balance sheet checks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Instant PAN-based allotment search directly linked with registrars</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>256-Bit SSL Encrypted • Zero Spam Guarantee • SEBI Registered Data</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: LOGIN FORM ================= */}
          <div className="w-full lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative">
              
              {/* Top Mobile Brand Heading */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-slate-950">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">IPOPulse Pro</span>
              </div>

              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Welcome back
                </h2>
                <p className="text-sm text-slate-400 mt-1.5">
                  Sign in to your account to monitor live IPOs & alerts
                </p>
              </div>

              {/* ⚡ One-Click Demo Login Banner */}
              <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/50 border border-indigo-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Testing the app?</p>
                    <p className="text-[11px] text-indigo-300">Use pre-configured demo account</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition shadow-sm"
                >
                  ⚡ Auto Login
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Forgot alert */}
              {forgotSent && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Reset link dispatched! Check your inbox ({email}).</span>
                </div>
              )}

              <form onSubmit={e => handleLogin(e)} className="space-y-4">
                {/* Email input */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0"
                    />
                    <span className="text-xs text-slate-400">Remember me for 30 days</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Switch to Signup */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">
                  Don't have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 ml-1 transition"
                  >
                    Create a free account
                  </Link>
                </p>
              </div>

              {/* Back to Home Link */}
              <div className="mt-4 text-center">
                <Link
                  to="/"
                  className="text-xs text-slate-500 hover:text-slate-400 transition inline-flex items-center gap-1"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
