import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import OrgChart from "./OrgChart";
import Sidebar from "./Sidebar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function fixEncoding(str) {
  if (typeof str !== "string") return str;

  const likelyCorrupted = /Ã|Â|â|ê|î|ô|û/.test(str);
  if (likelyCorrupted) {
    try {
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  }

  return str;
}

const toggleableFields = [
  { key: "Department", label: "Department" },
  { key: "Location", label: "Location" },
  { key: "Country", label: "Country" },
  { key: "Career Level", label: "Career Level" },
  { key: "Job Classification", label: "Job Classification" },
  { key: "Job Grade", label: "Job Grade" },
  { key: "Division", label: "Division" },
  { key: "User/Employee ID", label: "Employee ID" },
];

function App() {
  const [files, setFiles] = useState([]); // [{ name, data }]
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [zoomResetSignal, setZoomResetSignal] = useState(false);

  const [visibleFields, setVisibleFields] = useState([
    "Division",
    "Department",
    "Job Classification",
    "Career Level",
    "Job Grade",
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = null;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      const cleanedData = rawData.map((row) => {
        const fixedRow = {};
        for (const key in row) {
          const cleanedKey = fixEncoding(key).trim().replace(/\s+/g, " ");
          const value = row[key];
          fixedRow[cleanedKey] =
            typeof value === "string" ? fixEncoding(value) : value;
        }
        return fixedRow;
      });

      const newFile = { name: file.name, data: cleanedData };
      setFiles((prev) => [...prev, newFile]);
      setSelectedIndex(files.length);
      setCollapsedNodes(new Set());
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileDelete = (indexToDelete) => {
    setFiles((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToDelete);
      if (indexToDelete === selectedIndex) {
        setSelectedIndex(null);
      } else if (indexToDelete < selectedIndex) {
        setSelectedIndex((i) => i - 1);
      }
      return updated;
    });
  };

  const handleResetZoom = () => {
    setCollapsedNodes(new Set());
    setZoomResetSignal((prev) => !prev); // toggle to trigger re-render
  };

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        handleResetZoom();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const selectedFile = files[selectedIndex];

  return (
    <div className="flex font-sans text-gray-900">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        files={files}
        selectedIndex={selectedIndex}
        onSelectFile={(i) => {
          setSelectedIndex(i);
          setCollapsedNodes(new Set());
          setZoomResetSignal((prev) => !prev);
        }}
        onUpload={handleFileUpload}
        onDelete={handleFileDelete}
        visibleFields={visibleFields}
        setVisibleFields={setVisibleFields}
        toggleableFields={toggleableFields}
      />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <img
            src="/ascendum_iconsintranet_2017_soicon_15-Organizational Development.svg"
            alt="Org Icon"
            className="h-6 w-auto"
          />
          <h1
            className="text-2xl font-bold text-ascblue cursor-pointer"
            onClick={handleResetZoom}
            title="Reset view to root"
          >
            {selectedFile
              ? selectedFile.name.replace(/\.(xlsx|xls|csv)$/i, "")
              : "Org Chart App"}
          </h1>
        </div>

        {selectedFile ? (
          <OrgChart
            key={zoomResetSignal ? "reset-1" : "reset-0"}
            data={selectedFile.data}
            collapsedNodes={collapsedNodes}
            setCollapsedNodes={setCollapsedNodes}
            fields={visibleFields}
          />
        ) : (
          <p className="text-sm text-gray-600">No file selected.</p>
        )}
      </main>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
