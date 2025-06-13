import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import NodeCard from "./NodeCard";
import * as htmlToImage from "html-to-image";

export default function OrgChart({ data, collapsedNodes, setCollapsedNodes }) {
  const [treeData, setTreeData] = useState(null);
  const treeRef = useRef();
  const svgRef = useRef(); // new ref to real SVG

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

    const tagParents = (node) => {
      const id = node.attributes?.EmployeeID;
      const reports = flatData.filter((p) => p["Manager User Sys ID"] === id);
      if (reports.length > 0) {
        node._hasChildren = true;
      }
      if (node.children) {
        node.children.forEach(tagParents);
      }
    };

    const countDescendants = (node) => {
      if (!node.children || node.children.length === 0) {
        node.descendantCount = 0;
        return 0;
      }

      let count = 0;
      for (let child of node.children) {
        count += 1 + countDescendants(child);
      }

      node.descendantCount = count;
      return count;
    };

    const applyCollapse = (node) => {
      const id = node.attributes?.EmployeeID;
      if (collapsedSet.has(id)) {
        delete node.children;
      } else if (node.children) {
        node.children.forEach(applyCollapse);
      }
    };

    tagParents(root);
    countDescendants(root);
    applyCollapse(root);

    return root;
  };

  useEffect(() => {
    const tree = buildTree(data, collapsedNodes);
    setTreeData(tree);
  }, [data, collapsedNodes]);

  const handleNodeClick = (nodeData) => {
    const id = nodeData.attributes?.EmployeeID;
    const newSet = new Set(collapsedNodes);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCollapsedNodes(newSet);
  };

  const downloadImage = () => {
    if (!svgRef.current || !treeRef.current) {
      console.warn("SVG or tree ref missing");
      return;
    }

    // Reset view before exporting
    treeRef.current.zoom(1);
    treeRef.current.setTranslate({ x: window.innerWidth / 2, y: 150 });

    // Ensure layout has settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const svg = svgRef.current;

        if (!svg) return;

        const bbox = svg.getBBox();
        console.log("🧪 SVG Bounding Box:", bbox);

        htmlToImage
          .toPng(svg, {
            backgroundColor: "#f8fafa",
            pixelRatio: 2,
          })
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "org-chart.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error("❌ Export failed:", err);
          });
      });
    });
  };

  return (
    <div className="w-full h-screen overflow-auto">
      <div className="flex justify-end p-2">
        <button
          onClick={downloadImage}
          className="bg-ascblue text-white text-sm px-4 py-1 rounded hover:bg-[#00252f] transition"
        >
          Export as Image
        </button>
      </div>

      <div className="overflow-auto">
        {treeData && (
          <Tree
            ref={treeRef}
            data={[treeData]}
            orientation="vertical"
            pathFunc="step"
            translate={{ x: window.innerWidth / 2, y: 150 }}
            zoomable={true}
            nodeSize={{ x: 400, y: 300 }}
            transitionDuration={500}
            svgRef={svgRef} // direct SVG access
            renderCustomNodeElement={({ nodeDatum }) => {
              const id = nodeDatum.attributes?.EmployeeID;
              const isCollapsed = collapsedNodes.has(id);
              const hasChildren = nodeDatum._hasChildren === true;
              const count = nodeDatum.descendantCount;

              return (
                <g onClick={() => handleNodeClick(nodeDatum)}>
                  <foreignObject
                    width={320}
                    height={240}
                    x={-160}
                    y={-120}
                    style={{ pointerEvents: "none" }}
                  >
                    <div style={{ pointerEvents: "all", position: "relative" }}>
                      <NodeCard nodeDatum={nodeDatum} />
                      {hasChildren && (
                        <div
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "8px",
                            padding: "2px 6px",
                            borderRadius: "9999px",
                            backgroundColor: "#e2e8f0",
                            color: "#1f2937",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            border: "1px solid #cbd5e1",
                          }}
                        >
                          <span>{isCollapsed ? "▶" : "🔽"}</span>
                          <span>{count}</span>
                        </div>
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
