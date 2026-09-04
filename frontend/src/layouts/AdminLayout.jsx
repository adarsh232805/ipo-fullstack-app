import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-100";

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 font-bold text-xl text-blue-600">
          Admin Panel
        </div>

        <nav className="flex-1 px-3 space-y-1 text-sm">
          <NavLink to="/admin" end className={linkClass + " block px-4 py-3 rounded"}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/ipos" className={linkClass + " block px-4 py-3 rounded"}>
            IPO Management
          </NavLink>
          <NavLink to="/admin/users" className={linkClass + " block px-4 py-3 rounded"}>
            Users
          </NavLink>
          <NavLink to="/admin/kyc" className={linkClass + " block px-4 py-3 rounded"}>
            KYC Verification
          </NavLink>
          <NavLink to="/admin/footer" className={linkClass + " block px-4 py-3 rounded"}>
            Footer CMS
          </NavLink>
          <NavLink to="/admin/newsletter" className={linkClass + " block px-4 py-3 rounded"}>
            Newsletter
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
