import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  BellRing
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Compute password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "Empty", color: "bg-slate-700" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
    if (score <= 3) return { score: 2, label: "Moderate", color: "bg-amber-500", text: "text-amber-400" };
    return { score: 3, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  }, [password]);

  const handleSignup = async e => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      navigate("/dashboard/profile");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again or use another email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Ambient glowing radial shapes */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[550px] h-[550px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN: SHOWCASE & PERKS (Desktop) ================= */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Free Investor Membership
              </div>

              <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Unlock early edge on <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  every upcoming IPO.
                </span>
              </h1>
              <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-lg">
                Create your free account today and get full access to live grey market premiums, broker sentiment radars, and automated allotment alerts.
              </p>
            </div>

            {/* Testimonial / Trust Metric Card */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 flex-shrink-0 shadow-lg shadow-emerald-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold mb-1">
                    ★★★★★ <span className="text-slate-400 ml-1">4.9 / 5 from retail investors</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                    "IPOPulse helped me capture 80%+ listing gains on IREDA & Jyoti CNC by timing bids right before QIB closure. The live GMP accuracy is unmatched."
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    — Siddharth Mehta, Active Primary Market Investor
                  </p>
                </div>
              </div>
            </div>

            {/* Value Proposition List */}
            <div className="space-y-3.5 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <span>Instant allotment alerts straight to your dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span>Historical GMP movement graphs & listing gain estimates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Completely ad-free, 100% free forever for retail users</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 border-t border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Bank-grade security • No credit card required • Instant setup</span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: SIGNUP FORM ================= */}
          <div className="w-full lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative">
              
              {/* Mobile Brand Heading */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-extrabold text-slate-950">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">IPOPulse Pro</span>
              </div>

              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Create an account
                </h2>
                <p className="text-sm text-slate-400 mt-1.5">
                  Sign up in 30 seconds to track live IPOs & grey market trends
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Adarsh Singh"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Email Address */}
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

                {/* Password with Show/Hide and Strength Meter */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 1 ? passwordStrength.color : "bg-slate-700"
                          } flex-1`}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 2 ? passwordStrength.color : "bg-slate-700"
                          } flex-1`}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 3 ? passwordStrength.color : "bg-slate-700"
                          } flex-1`}
                        />
                      </div>
                      <span className={`text-[11px] font-medium ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0"
                    />
                    <span className="text-xs text-slate-400 leading-snug">
                      I agree to the{" "}
                      <span className="text-slate-300 underline">Terms of Service</span> and{" "}
                      <span className="text-slate-300 underline">Privacy Policy</span>.
                    </span>
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Free Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 ml-1 transition"
                  >
                    Sign in here
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
