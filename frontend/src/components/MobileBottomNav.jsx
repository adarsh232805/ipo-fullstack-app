import { NavLink } from "react-router-dom";

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t flex justify-around py-2 z-50">
      <NavLink to="/" className="text-sm">🏠<br/>Home</NavLink>
      <NavLink to="/ipos" className="text-sm">📈<br/>IPOs</NavLink>
      <NavLink to="/dashboard" className="text-sm">📊<br/>Dashboard</NavLink>
      <NavLink to="/dashboard/profile" className="text-sm">👤<br/>Profile</NavLink>
    </div>
  );
}
