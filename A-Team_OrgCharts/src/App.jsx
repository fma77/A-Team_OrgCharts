import { useState } from "react";
import * as XLSX from "xlsx";
import OrgChart from "./OrgChart";

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

function App() {
  const [files, setFiles] = useState([]); // [{ name, data }]
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
          const value = row[key];
          fixedRow[fixEncoding(key)] =
            typeof value === "string" ? fixEncoding(value) : value;
        }
        return fixedRow;
      });

      const newFile = { name: file.name, data: cleanedData };
      setFiles((prev) => [...prev, newFile]);
      setSelectedIndex(files.length); // auto-select the new one
    };

    reader.readAsArrayBuffer(file);
  };

  const selectedFile = files[selectedIndex];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-300 p-4 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-12"} overflow-hidden`}>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-blue-600 text-sm">Files</span>
          <button
            className="text-xs text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          className="mb-3 text-xs"
        />

        {sidebarOpen && (
          <ul className="space-y-2 text-sm">
            {files.map((file, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`cursor-pointer px-2 py-1 rounded ${
                  idx === selectedIndex
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main view */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Org Chart App</h1>
        {selectedFile ? (
          <OrgChart data={selectedFile.data} />
        ) : (
          <p className="text-sm text-gray-600">No file selected.</p>
        )}
      </div>
    </div>
  );
}

export default App;
