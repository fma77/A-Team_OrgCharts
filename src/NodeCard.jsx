export default function NodeCard({ nodeDatum, fields = [], exportMode = false }) {
  const { name, attributes } = nodeDatum;
  console.log("NodeCard attributes:", attributes);

  const cleanValue = (value, type = "") => {
    if (!value) return "-";

    let result = value;

    if (type === "location") {
      result = value.length > 10 ? value.substring(10).trim() : value;
      console.log("Location cleaned:", value, "→", result);
      return result;
    }

    if (typeof value === "string") {
      result = value.replace(/^\d{3,}[ _-]?/, "").trim();
      console.log("Value cleaned:", value, "→", result);
      return result;
    }

    return value;
  };

  const getValue = (key) =>
    key === "Location"
      ? cleanValue(attributes?.[key], "location")
      : cleanValue(attributes?.[key]);

  if (exportMode) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "320px",
          padding: "12px",
          fontSize: "12px",
          color: "#000000",
          border: "none",
          boxShadow: "none",
          outline: "none",
        }}
      >
        <div
          style={{
            fontWeight: "600",
            fontSize: "14px",
            marginBottom: "4px",
          }}
        >
          {name}
        </div>
        {fields.map((key) => (
          <div key={key}>
            <strong>{key}:</strong> {getValue(key)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="rounded-xl bg-white shadow-md p-3 w-[320px]"
      style={{ transition: "all 0.5s ease-in-out" }}
    >
      <div className="font-semibold text-base text-gray-900 mb-1">{name}</div>
      <div className="font-bold text-sm text-gray-800 mb-1">
        {getValue("Position")}
      </div>
      <div className="text-xs text-gray-600 space-y-[1px]">
        {fields.map((key) => (
          <div key={key}>
            <span className="font-medium">{key}:</span> {getValue(key)}
          </div>
        ))}
      </div>
    </div>
  );
}
