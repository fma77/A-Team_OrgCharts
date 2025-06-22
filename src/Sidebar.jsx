import {
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  Settings,
  Trash,
  X,
  ChevronDown,
  ChevronRight as ChevronCollapsed,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
  files,
  selectedIndex,
  onSelectFile,
  onUpload,
  onDelete,
  visibleFields,
  setVisibleFields,
  toggleableFields,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fieldsPanelOpen, setFieldsPanelOpen] = useState(true);

  const toggleField = (key) => {
    setVisibleFields((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div
      className={`h-screen bg-white border-r border-ascgrey flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-80" : "w-16"
      }`}
    >
      {/* Logo + App Name */}
      <div className="border-b border-ascgrey">
        {sidebarOpen ? (
          <div className="relative px-4 pt-4 pb-3">
            <div className="flex flex-col items-center">
              <button
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
                className="absolute top-0 right-0 text-gray-500 hover:text-ascblue rounded-md p-1 hover:bg-gray-100 transition"
              >
                <ChevronLeft size={22} />
              </button>
              <img src="/Logo.png" alt="Ascendum" className="h-12 w-auto mb-1 mt-1" />
              <div className="flex flex-col items-center mt-2 space-y-1">
                <div className="px-3 py-1 rounded-lg border border-ascblue text-[13px] font-semibold text-ascblue bg-white shadow-sm tracking-wide uppercase">
                  Org Chart App
                </div>
                <div className="h-[2px] w-8 bg-ascred rounded-full"></div>
                <div
                  className="text-xs text-[#003846] opacity-70 mt-1 cursor-pointer hover:underline"
                  title="Release notes coming soon"
                >
                  v1.1.0
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-end px-2 py-3">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              className="text-gray-500 hover:text-ascblue rounded-md p-1 hover:bg-gray-100 transition"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </div>

      {/* Upload */}
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
      <div className={`flex-1 overflow-auto px-2 ${sidebarOpen ? "" : "pt-6"}`}>
        {files.map((file, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between rounded-md px-3 py-2 mb-1 text-sm transition-all ${
              idx === selectedIndex
                ? "bg-ascblue text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
            title={file.name}
          >
            <div
              className="flex items-center gap-2 cursor-pointer truncate"
              onClick={() => onSelectFile(idx)}
              title="Click to reset view"
            >
              <FileText size={16} />
              {sidebarOpen && <span className="truncate hover:underline">{file.name}</span>}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setPendingDelete(idx)}
                className="text-gray-400 hover:text-ascred ml-2"
                title="Delete file"
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Settings: toggle + subareas */}
      <div className="p-4 border-t border-ascgrey">
        <button
          onClick={() => setSettingsOpen((open) => !open)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-ascblue"
        >
          <Settings size={16} />
          {sidebarOpen && <span>Settings</span>}
        </button>

        {sidebarOpen && settingsOpen && (
          <div className="mt-3 pl-1 space-y-4 text-xs text-gray-700">
            {/* Field Selection Panel */}
            <div>
              <button
                onClick={() => setFieldsPanelOpen((open) => !open)}
                className="flex items-center gap-1 text-gray-500 hover:text-ascblue mb-1 font-semibold"
              >
                {fieldsPanelOpen ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronCollapsed size={12} />
                )}
                <span className="text-[11px] uppercase tracking-wide">
                  Field selection
                </span>
              </button>

              {fieldsPanelOpen && (
                <div className="space-y-1 pl-4">
                  {toggleableFields.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleFields.includes(key)}
                        onChange={() => toggleField(key)}
                        className="accent-ascblue"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {pendingDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md border border-gray-200">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setPendingDelete(null)}
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {files[pendingDelete]?.name}
              </span>
              ?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-1 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm rounded-md bg-ascred text-white hover:bg-red-600"
                onClick={() => {
                  onDelete(pendingDelete);
                  setPendingDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
