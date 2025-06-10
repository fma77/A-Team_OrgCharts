import { useState } from "react";
import * as XLSX from "xlsx";
import OrgChart from "./OrgChart";

function fixEncoding(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

function App() {
  const [fileName, setFileName] = useState("");
  const [orgData, setOrgData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

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

      console.log("Sample cleaned row:", cleanedData[0]);
      setOrgData(cleanedData);
      console.log("Available columns:", Object.keys(cleanedData[0]));

    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Org Chart App</h1>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          className="mb-2"
        />
        {fileName && (
          <p className="text-sm text-gray-700">
            Uploaded file: <strong>{fileName}</strong>
          </p>
        )}
      </div>

      {orgData && <OrgChart data={orgData} />}
    </div>
  );
}

export default App;
