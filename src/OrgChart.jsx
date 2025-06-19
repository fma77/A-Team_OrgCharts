import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import NodeCard from "./NodeCard";

export default function OrgChart({ data, collapsedNodes, setCollapsedNodes, fields = [] }) {
  const [treeData, setTreeData] = useState(null);
  const [zoomStack, setZoomStack] = useState([]); // stack of previous root IDs
  const [currentRootId, setCurrentRootId] = useState(null);
  const treeContainer = useRef();

  const buildTree = (flatData, collapsedSet = new Set(), rootId = null) => {
    const idMap = {};
    flatData.forEach((person) => {
      const id = String(person["User/Employee ID"]);
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

    flatData.forEach((person) => {
      const id = String(person["User/Employee ID"]);
      const managerId = String(person["Manager User Sys ID"] || "");
      if (idMap[managerId]) {
        idMap[managerId].children.push(idMap[id]);
      }
    });

    const findRootNode = (startId) => {
      const node = idMap[startId];
      if (!node) return null;

      const collectSubtree = (n) => {
        const children = n.children || [];
        n.children = children.map((child) => collectSubtree(child));
        return n;
      };

      return collectSubtree(node);
    };

    let root = null;
    if (rootId) {
      root = findRootNode(rootId);
    } else {
      const rootCandidate = flatData.find((p) => !p["Manager User Sys ID"] || p["Manager User Sys ID"] === "NO_MANAGER");
      if (rootCandidate) {
        root = findRootNode(String(rootCandidate["User/Employee ID"]));
      }
    }

    if (!root) {
      console.warn("No valid root found for", rootId);
      return null;
    }

    const tagParentsAndCount = (node) => {
      const id = node.attributes?.EmployeeID;
      const reports = flatData.filter((p) => String(p["Manager User Sys ID"]) === id);
      node._hasChildren = reports.length > 0;

      if (!node.children || node.children.length === 0) {
        node.descendantCount = 0;
        return 0;
      }

      let count = 0;
      for (let child of node.children) {
        count += 1 + tagParentsAndCount(child);
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

    tagParentsAndCount(root);
    applyCollapse(root);

    return root;
  };

  useEffect(() => {
    const tree = buildTree(data, collapsedNodes, currentRootId);
    setTreeData(tree);
  }, [data, collapsedNodes, currentRootId]);

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

  const handleZoomIn = (id) => {
    if (id === currentRootId || (!currentRootId && id === getDefaultRootID())) return;
    setZoomStack((prev) => [...prev, currentRootId]);
    setCurrentRootId(id);
  };

  const handleZoomOut = () => {
    setZoomStack((prev) => {
      const updated = [...prev];
      const last = updated.pop();
      setCurrentRootId(last || null);
      return updated;
    });
  };

  const getDefaultRootID = () => {
    const rootCandidate = data.find((p) => !p["Manager User Sys ID"] || p["Manager User Sys ID"] === "NO_MANAGER");
    return rootCandidate ? String(rootCandidate["User/Employee ID"]) : null;
  };

  return (
    <div className="w-full h-screen overflow-auto" ref={treeContainer}>
      {treeData && (
        <Tree
          data={[treeData]}
          orientation="vertical"
          pathFunc="step"
          translate={{ x: window.innerWidth / 2, y: 140 }}
          nodeSize={{ x: 360, y: 260 }}
          zoomable={true}
          transitionDuration={500}
          renderCustomNodeElement={({ nodeDatum }) => {
            const id = nodeDatum.attributes?.EmployeeID;
            const isCollapsed = collapsedNodes.has(id);
            const isZoomedRoot = currentRootId === id;
            const defaultRootId = getDefaultRootID();
            const isDefaultRoot = !currentRootId && id === defaultRootId;

            return (
              <g onClick={() => handleNodeClick(nodeDatum)}>
                <foreignObject
                  width={320}
                  height={300}
                  x={-160}
                  y={-100}
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    style={{
                      pointerEvents: "all",
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    <NodeCard
                      nodeDatum={nodeDatum}
                      fields={fields}
                      onZoomIn={() => handleZoomIn(id)}
                      onZoomOut={handleZoomOut}
                      isZoomedRoot={isZoomedRoot}
                      showZoomControls={!isZoomedRoot && !isDefaultRoot}
                      canZoomOut={zoomStack.length > 0 && isZoomedRoot}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          }}
        />
      )}
    </div>
  );
}
