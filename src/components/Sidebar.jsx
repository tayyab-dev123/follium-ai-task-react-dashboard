import React, { useState } from "react";
import { useSelector } from "react-redux";

const Sidebar = ({ setActiveView }) => {
  const { selectedStock } = useSelector((state) => state.stock);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <h3
          className={`font-bold text-slate-800 dark:text-white transition-opacity duration-200 ${
            collapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
        >
          Dashboard Views
        </h3>
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="py-4">
        <button
          onClick={() => setActiveView("overview")}
          className="w-full flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <span
            className={`ml-3 transition-opacity duration-200 ${
              collapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            Stock Overview
          </span>
        </button>

        <button
          onClick={() => setActiveView("chart")}
          className="w-full flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left mt-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span
            className={`ml-3 transition-opacity duration-200 ${
              collapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            Historical Chart
          </span>
        </button>

        <button
          onClick={() => setActiveView("both")}
          className="w-full flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left mt-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-600 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span
            className={`ml-3 transition-opacity duration-200 ${
              collapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            Show Both
          </span>
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 mt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Currently Viewing
            </p>
            <p className="font-medium text-sm text-slate-800 dark:text-white mt-1">
              {selectedStock || "AAPL"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
