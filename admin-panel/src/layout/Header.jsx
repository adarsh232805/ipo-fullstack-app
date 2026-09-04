export default function Header() {
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold text-gray-700">
        IPO Admin Panel
      </h1>

      <button
        onClick={logout}
        className="text-sm bg-slate-900 text-white px-4 py-1.5 rounded hover:bg-slate-800"
      >
        Logout
      </button>
    </header>
  );
}
