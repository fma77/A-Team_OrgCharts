import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";

// Custom node component
function NodeCard({ nodeDatum }) {
  const { name, attributes } = nodeDatum;

  return (
    <div className="rounded-xl bg-white shadow-md border border-gray-300 p-3 w-60">
      <div className="font-semibold text-base text-gray-900 mb-1">{name}</div>
      <div className="text-xs text-gray-600 space-y-1">
        <div>
          <span className="font-medium">Position:</span> {attributes?.Position || "-"}
        </div>
        <div>
          <span className="font-medium">Employee ID:</span> {attributes?.EmployeeID || "-"}
        </div>
        <div>
          <span className="font-medium">Country:</span> {attributes?.Country || "-"}
        </div>
        <div>
          <span className="font-medium">Company:</span> {attributes?.Company || "-"}
        </div>
        <div>
          <span className="font-medium">Location:</span> {attributes?.Location || "-"}
        </div>
        <div>
          <span className="font-medium">Department:</span> {attributes?.Department || "-"}
        </div>
      </div>
    </div>
  );
}


export default function OrgChart({ data }) {
  const [treeData, setTreeData] = useState(null);
  const treeContainer = useRef();

  const buildTree = (flatData) => {
    const idMap = {};
    flatData.forEach((person) => {
      idMap[person["User/Employee ID"]] = {
        name: person["Display Name"],
        attributes: {
          Position: person["Position Title_1"],
          EmployeeID: person["User/Employee ID"],
          Country: person["Country/Region"],
          Company: person["Company"],
          Location: person["Location"],
          Department: person["Functional Area / Department"],
},

        children: [],
      };
    });

    let root = null;
    flatData.forEach((person) => {
      const id = person["User/Employee ID"];
      const managerId = person["Manager User Sys ID"];
      if (!managerId || managerId === "NO_MANAGER") {
        root = idMap[id];
      } else if (idMap[managerId]) {
        idMap[managerId].children.push(idMap[id]);
      }
    });

    return root;
  };

  useEffect(() => {
    const tree = buildTree(data);
    setTreeData(tree);
  }, [data]);

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={treeContainer}>
      {treeData && (
        <Tree
          data={treeData}
          orientation="vertical"
          pathFunc="elbow"
          translate={{ x: 400, y: 100 }}
          collapsible={true}
          zoomable={true}
          nodeSize={{ x: 250, y: 180 }}
          renderCustomNodeElement={({ nodeDatum }) => (
            <foreignObject width={250} height={100} x={-125} y={-50}>
              <NodeCard nodeDatum={nodeDatum} />
            </foreignObject>
          )}
        />
      )}
    </div>
  );
}
