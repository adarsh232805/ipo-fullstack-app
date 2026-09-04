const steps = ["applied", "allotted", "refund_initiated", "listed"];

export default function StepTracker({ status }) {
  return (
    <div className="flex justify-between mt-4">
      {steps.map(s => (
        <div key={s} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full ${
              steps.indexOf(status) >= steps.indexOf(s)
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          />
          <span className="text-xs mt-2 capitalize">
            {s.replace("_", " ")}
          </span>
        </div>
      ))}
    </div>
  );
}
