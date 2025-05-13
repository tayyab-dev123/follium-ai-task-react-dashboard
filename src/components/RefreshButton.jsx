import React, { memo, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../store/stockSlice";

const RefreshButton = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { selectedStock, timeRange, loading } = useSelector(
    (state) => state.stock
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (refreshing || loading) return;

    setRefreshing(true);
    dispatch(setError(null)); // Clear any previous errors

    try {
      // Invalidate and refetch the stock overview data
      await queryClient.invalidateQueries({
        queryKey: ["stockOverview", selectedStock],
      });

      // Invalidate and refetch the historical data
      await queryClient.invalidateQueries({
        queryKey: ["historicalData", selectedStock, timeRange],
      });
    } catch (error) {
      console.error("Error during data refresh:", error);
      dispatch(setError(error.message || "Failed to refresh data"));
    } finally {
      // Set refreshing state to false when the fetch is complete
      setRefreshing(false);
    }
  }, [dispatch, queryClient, selectedStock, timeRange, loading, refreshing]);

  return (
    <button
      className={`relative overflow-hidden group rounded-lg px-5 py-2.5 text-white font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg
        ${
          loading || refreshing
            ? "bg-blue-500/70 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        }`}
      onClick={handleRefresh}
      disabled={loading || refreshing}
      aria-label="Refresh stock data"
    >
      {/* Ripple effect */}
      {!loading && !refreshing && (
        <span className="absolute top-0 left-0 w-full h-full bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
      )}

      <span className="relative flex items-center justify-center">
        {loading || refreshing ? (
          <>
            <svg
              className="animate-spin h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Refreshing</span>
            <span className="animate-pulse ml-1">...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 transform group-hover:rotate-180 transition-transform duration-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Refresh Data</span>
          </>
        )}
      </span>
    </button>
  );
};

export default memo(RefreshButton);
