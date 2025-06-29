import { Search, CircleArrowLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function NodeCard({
  nodeDatum,
  fields = [],
  exportMode = false,
  onZoomIn,
  onZoomOut,
  isZoomedRoot,
  canZoomOut,
  showZoomControls,
  isCollapsed,
}) {
  const { name, attributes, descendantCount = 0, _hasChildren } = nodeDatum;

  // Configurable cleanup rules by field
  const cleanupAfterHyphenFields = ["Job Grade", "Division"];

  const cleanValue = (value, type = "", key = "") => {
    if (!value) return "-";

    let result = value;

    if (type === "location") {
      result = value.length > 10 ? value.substring(10).trim() : value;
      return result;
    }

    if (typeof value === "string") {
      // If the field is in our cleanup list and contains a hyphen
      if (cleanupAfterHyphenFields.includes(key) && value.includes("-")) {
        result = value.split("-")[1]?.trim() || "";
        return result || "-";
      }

      // Generic numeric code cleanup
      result = value.replace(/^\d{3,}[ _-]?/, "").trim();
      return result;
    }

    return value;
  };

  const getValue = (key) =>
    key === "Location"
      ? cleanValue(attributes?.[key], "location", key)
      : cleanValue(attributes?.[key], "", key);

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
        <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
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
      className="relative rounded-xl bg-white shadow-md p-3 w-[320px]"
      style={{ transition: "all 0.5s ease-in-out" }}
    >
      {/* Zoom controls top-right */}
      {canZoomOut ? (
        <div className="absolute top-1.5 right-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoomOut();
            }}
            title="Go back to previous view"
            className="text-gray-500 hover:text-ascblue bg-white p-1 rounded-full shadow border"
          >
            <CircleArrowLeft size={16} />
          </button>
        </div>
      ) : showZoomControls ? (
        <div className="absolute top-1.5 right-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoomIn();
            }}
            title="Zoom into this subtree"
            className="text-gray-500 hover:text-ascblue bg-white p-1 rounded-full shadow border"
          >
            <Search size={16} />
          </button>
        </div>
      ) : null}

      {/* Node content */}
      <div className="font-semibold text-base text-gray-900 mb-1">{name}</div>
      <div className="font-bold text-sm text-gray-800 mb-1">
        {getValue("Position")}
      </div>
      <div className="text-xs text-gray-600 space-y-[1px] font-sans">
        {fields.map((key) => (
          <div key={key}>
            <span className="font-medium">{key}:</span>{" "}
            <span className="font-bold font-montserrat">{getValue(key)}</span>
          </div>
        ))}
      </div>

      {/* Descendant count bottom-right */}
      {_hasChildren && (
        <div
          className="absolute bottom-2 right-2 px-2 py-[2px] rounded-full border text-xs font-bold flex items-center gap-1 text-ascblue"
          style={{
            backgroundColor: "#e2e8f0",
            border: "1px solid #cbd5e1",
          }}
        >
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${
              isCollapsed ? "rotate-0" : "rotate-90"
            } text-ascblue`}
          />
          <span>{descendantCount}</span>
        </div>
      )}
    </div>
  );
}
