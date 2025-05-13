import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY;
const API_URL = import.meta.env.VITE_ALPHAVANTAGE_API_URL;

export const fetchStockOverview = async (symbol) => {
  const response = await axios.get(API_URL, {
    params: {
      function: "OVERVIEW",
      symbol: symbol,
      apikey: API_KEY,
    },
  });
  return response.data;
};

export const fetchHistoricalData = async (symbol, timeRange) => {
  try {
    let functionName, interval;
    switch (timeRange) {
      case "1week":
        functionName = "TIME_SERIES_DAILY_ADJUSTED";
        interval = "5min";
        break;
      case "1month":
        functionName = "TIME_SERIES_DAILY_ADJUSTED";
        interval = "5min";
        break;
      case "3month":
        functionName = "TIME_SERIES_DAILY_ADJUSTED";
        interval = "5min";
        break;
      default:
        functionName = "TIME_SERIES_DAILY_ADJUSTED";
        interval = "5min";
        break;
    }
    const response = await axios.get(API_URL, {
      params: {
        function: functionName,
        symbol: symbol,
        interval: interval,
        apikey: API_KEY,
        outputsize: "full", // 'compact' returns the latest 100 data points, 'full' returns up to 1-2 months of data
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};

// Keep the old function name as an alias for backward compatibility
// to avoid breaking other components that might be using it
export const fetehHistoricalData = fetchHistoricalData;

// TanStack Query hooks that use the original functions
export const useStockOverview = (symbol, options = {}) => {
  return useQuery({
    queryKey: ["stockOverview", symbol],
    queryFn: () => fetchStockOverview(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options,
  });
};

export const useHistoricalData = (symbol, timeRange, options = {}) => {
  return useQuery({
    queryKey: ["historicalData", symbol, timeRange],
    queryFn: () => fetchHistoricalData(symbol, timeRange),
    enabled: !!symbol && !!timeRange,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    ...options,
  });
};
