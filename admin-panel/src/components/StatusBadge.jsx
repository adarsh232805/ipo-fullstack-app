const statusStyles = {
  upcoming: "bg-yellow-100 text-yellow-700",
  open: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
  listed: "bg-blue-100 text-blue-700"
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        statusStyles[status]
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
