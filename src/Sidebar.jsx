import {
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  Settings,
  Trash,
  X,
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
}) {
  const [pendingDelete, setPendingDelete] = useState(null);

  return (
    <div
      className={`h-screen bg-white border-r border-ascgrey flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-80" : "w-16"
      }`}
    >
      {/* Logo + App Name */}
      <div className="border-b border-ascgrey">
        {sidebarOpen ? (
          // Expanded state: stacked layout with logo + title
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
              <span className="text-base font-bold text-ascblue">Org Chart app</span>
            </div>
          </div>
        ) : (
          // Collapsed state: keep button in top right of full-width bar
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

      {/* Settings icon */}
      <div className="p-4 border-t border-ascgrey">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-ascblue">
          <Settings size={16} />
          {sidebarOpen && <span>Settings</span>}
        </button>
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
