export default function NodeCard({ nodeDatum }) {
  const { name, attributes } = nodeDatum;

  return (
    <div className="rounded-xl bg-white shadow-lg border border-gray-300 p-3 w-52">
      <div className="font-semibold text-sm text-gray-800">{name}</div>
      <div className="text-xs text-gray-500 mt-1">
        <div>
          <span className="font-medium">Position:</span>{" "}
          {attributes?.Position || "-"}
        </div>
        <div>
          <span className="font-medium">Country:</span>{" "}
          {attributes?.Country || "-"}
        </div>
      </div>
    </div>
  );
}
