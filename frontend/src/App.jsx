import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ================= LAYOUTS ================= */
import Layout from "./components/Layout";
import DashboardLayout from "./layouts/DashboardLayout";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home";
import IpoListing from "./pages/IpoListing";
import IpoDetail from "./pages/IpoDetail";
import GmpPage from "./pages/GmpPage";
import CompareIpos from "./pages/CompareIpos";

/* ================= STATIC PAGES ================= */
import About from "./pages/static/About";
import FAQ from "./pages/static/FAQ";
import Privacy from "./pages/static/Privacy";
import Terms from "./pages/static/Terms";
import Contact from "./pages/static/Contact";
import Careers from "./pages/static/Careers";
import HelpCenter from "./pages/static/HelpCenter";

/* ================= AUTH ================= */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

/* ================= USER DASHBOARD ================= */
import Dashboard from "./pages/Dashboard";
import Allotment from "./pages/Allotment";
import ApplicationTracking from "./pages/ApplicationTracking";
import ProfileSettings from "./pages/ProfileSettings";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminIpos from "./pages/admin/AdminIpos";
import AddIpo from "./pages/admin/AddIpo";
import EditIpo from "./pages/admin/EditIpo";

export default function App() {
  return (
    <Routes>

      {/* =================================================
         PUBLIC WEBSITE (NAVBAR + FOOTER VISIBLE)
      ================================================= */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        {/* Public Features */}
        <Route path="ipos" element={<IpoListing />} />
        <Route path="ipos/:id" element={<IpoDetail />} />
        <Route path="gmp" element={<GmpPage />} />
        <Route path="compare" element={<CompareIpos />} />
        <Route path="allotment" element={<Allotment />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Static Pages */}
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="contact" element={<Contact />} />
        <Route path="careers" element={<Careers />} />
        <Route path="help" element={<HelpCenter />} />
      </Route>

      {/* =================================================
         USER DASHBOARD (SIDEBAR LAYOUT)
      ================================================= */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="allotment" element={<Allotment />} />
        <Route path="applications" element={<ApplicationTracking />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>

      {/* Redirect /profile directly to dashboard profile */}
      <Route path="profile" element={<Navigate to="/dashboard/profile" replace />} />


      {/* =================================================
         ADMIN PANEL
      ================================================= */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="admin/ipos"
        element={
          <ProtectedRoute>
            <AdminIpos />
          </ProtectedRoute>
        }
      />

      <Route
        path="admin/ipos/add"
        element={
          <ProtectedRoute>
            <AddIpo />
          </ProtectedRoute>
        }
      />

      <Route
        path="admin/ipos/:id/edit"
        element={
          <ProtectedRoute>
            <EditIpo />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
