import { Routes, Route } from "react-router-dom";

import AdminLogin from "./auth/AdminLogin";
import AdminRoute from "./auth/AdminRoute";
import AdminLayout from "./layout/AdminLayout";

import Dashboard from "./pages/Dashboard";
import IpoList from "./pages/IpoList";
import IpoCreate from "./pages/IpoCreate";
import IpoEdit from "./pages/IpoEdit";
import Analytics from "./pages/Analytics";
import AdminUsers from "./pages/AdminUsers";

export default function App() {
  return (
    <Routes>
      {/* ================= LOGIN ================= */}
      <Route path="/login" element={<AdminLogin />} />

      {/* ================= ADMIN PANEL ================= */}
      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* DASHBOARD */}
        <Route index element={<Dashboard />} />

        {/* IPOs */}
        <Route path="ipos" element={<IpoList />} />
        <Route path="ipos/create" element={<IpoCreate />} />
        <Route path="ipos/edit/:id" element={<IpoEdit />} />

        {/* ANALYTICS */}
        <Route path="analytics" element={<Analytics />} />

        {/* USERS */}
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
