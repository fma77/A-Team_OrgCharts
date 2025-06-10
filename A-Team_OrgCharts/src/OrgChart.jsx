import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

export default function OrgChart({ data }) {
  const [treeData, setTreeData] = useState(null);
  const treeContainer = useRef();

  // Converts flat array into a tree structure
  const buildTree = (flatData) => {
    const idMap = {};
    flatData.forEach((person) => {
      idMap[person["User/Employee ID"]] = {
        name: person["Display Name"],
        attributes: {
          Position: person["Position Title2"],
          Country: person["Country/Region"],
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
    <div style={containerStyles} ref={treeContainer}>
      {treeData && (
        <Tree
          data={treeData}
          orientation="vertical"
          pathFunc="elbow"
          translate={{ x: 400, y: 100 }}
          collapsible={true}
          zoomable={true}
          nodeSize={{ x: 200, y: 120 }}
        />
      )}
    </div>
  );
}
