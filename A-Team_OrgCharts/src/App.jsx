import { useState } from "react";
import * as XLSX from "xlsx";
import OrgChart from "./OrgChart";
import Sidebar from "./Sidebar";

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
      setSelectedIndex(files.length);
    };

    reader.readAsArrayBuffer(file);
  };

  const selectedFile = files[selectedIndex];

  return (
    <div className="flex font-sans text-gray-900">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        files={files}
        selectedIndex={selectedIndex}
        onSelectFile={(i) => setSelectedIndex(i)}
        onUpload={handleFileUpload}
      />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        <h1 className="text-2xl font-bold text-ascblue mb-4">Org Chart App</h1>
        {selectedFile ? (
          <OrgChart data={selectedFile.data} />
        ) : (
          <p className="text-sm text-gray-600">No file selected.</p>
        )}
      </main>
    </div>
  );
}

export default App;
