export default function NodeCard({ nodeDatum }) {
  const { name, attributes } = nodeDatum;

  // Helper to clean values
  const cleanValue = (value, type = "") => {
    if (!value) return "-";

    if (type === "location") {
      return value.length > 10 ? value.substring(10).trim() : value;
    }

    // For company, department (team), etc.
    return value.replace(/^\d{3,}[ _-]?/, "").trim();
  };

  return (
    <div className="rounded-xl bg-white shadow-md border border-gray-300 p-3 w-[320px]">
      <div className="font-semibold text-base text-gray-900 mb-1">{name}</div>
      <div className="font-bold text-sm text-gray-800 mb-1">
        {attributes?.Position || "-"}
      </div>
      <div className="text-xs text-gray-600 space-y-1">
        <div>
          <span className="font-medium">Team:</span>{" "}
          {cleanValue(attributes?.Department)}
        </div>
        <div>
          <span className="font-medium">Company:</span>{" "}
          {cleanValue(attributes?.Company)}
        </div>
        <div>
          <span className="font-medium">Country:</span>{" "}
          {attributes?.Country || "-"}
        </div>
        <div>
          <span className="font-medium">Location:</span>{" "}
          {cleanValue(attributes?.Location, "location")}
        </div>
        <div>
          <span className="font-medium">Employee ID:</span>{" "}
          {attributes?.EmployeeID || "-"}
        </div>
      </div>
    </div>
  );
}
