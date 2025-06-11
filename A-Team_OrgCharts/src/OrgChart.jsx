import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import NodeCard from "./NodeCard";

export default function OrgChart({ data }) {
  const [treeData, setTreeData] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const treeContainer = useRef();

  // Clone helper
  const cloneTree = (obj) => JSON.parse(JSON.stringify(obj));

  const buildTree = (flatData, collapsedSet = new Set()) => {
    const idMap = {};
    flatData.forEach((person) => {
      const id = person["User/Employee ID"];
      idMap[id] = {
        name: person["Display Name"],
        attributes: {
          Position: person["Position Title_1"],
          EmployeeID: id,
          Country: person["Country/Region"],
          Company: person["Company"],
          Location: person["Location"],
          Department: person["Functional Area / Department"],
        },
        children: [],
        collapsed: collapsedSet.has(id), // 👈 this is what react-d3-tree uses
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
    const tree = buildTree(data, collapsedNodes);
    setTreeData(tree);
  }, [data, collapsedNodes]);

  return (
    <div className="w-full h-screen overflow-auto" ref={treeContainer}>
      {treeData && (
        <Tree
          data={[treeData]} // ✅ react-d3-tree requires this to be an array
          orientation="vertical"
          pathFunc="step"
          translate={{ x: window.innerWidth / 2, y: 150 }}
          collapsible={true}
          zoomable={true}
          nodeSize={{ x: 400, y: 300 }}
          onNodeClick={(nodeData) => {
            const id = nodeData.attributes?.EmployeeID;
            const newSet = new Set(collapsedNodes);
            if (newSet.has(id)) {
              newSet.delete(id);
            } else {
              newSet.add(id);
            }
            setCollapsedNodes(newSet);
          }}
          renderCustomNodeElement={({ nodeDatum }) => (
            <foreignObject
              width={320}
              height={240}
              x={-160}
              y={-120}
              style={{ pointerEvents: "none" }}
            >
              <div style={{ pointerEvents: "all" }}>
                <NodeCard nodeDatum={nodeDatum} />
              </div>
            </foreignObject>
          )}
        />
      )}
    </div>
  );
}
