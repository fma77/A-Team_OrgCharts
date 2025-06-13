import { ChevronLeft, ChevronRight, Upload, FileText, Settings } from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
  files,
  selectedIndex,
  onSelectFile,
  onUpload,
}) {
  return (
    <div
      className={`h-screen bg-white border-r border-ascgrey flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-72" : "w-16"
      }`}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ascgrey">
        {sidebarOpen && (
          <img src="/Logo.png" alt="Ascendum" className="h-8 w-auto" />
        )}
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-ascblue">
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Upload area */}
      <div className={`p-4 ${sidebarOpen ? "" : "hidden"}`}>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <Upload size={16} />
          Upload File
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={onUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto px-2">
        {files.map((file, idx) => (
          <div
            key={idx}
            onClick={() => onSelectFile(idx)}
            className={`flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 mb-1 text-sm transition-all ${
              idx === selectedIndex
                ? "bg-ascblue text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
            title={file.name}
          >
            <FileText size={16} />
            {sidebarOpen && <span className="truncate">{file.name}</span>}
          </div>
        ))}
      </div>

      {/* Settings icon */}
      <div className="p-4 border-t border-ascgrey">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-ascblue">
          <Settings size={16} />
          {sidebarOpen && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}
