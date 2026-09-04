import React from "react";
import { NavLink } from "react-router-dom";

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-xs">

      <Item to="/dashboard" icon="📊" label="Home" />
      <Item to="/dashboard/allotment" icon="🧾" label="Allotment" />
      <Item to="/dashboard/applications" icon="📌" label="Apps" />
      <Item to="/dashboard/profile" icon="👤" label="Profile" />

    </nav>
  );
}

function Item({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center ${
          isActive ? "text-blue-600" : "text-gray-500"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
