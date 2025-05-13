import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStock: "AAPL",
  timeRange: "1month",
  loading: false,
  error: null,
  stockData: null,
  historicalData: null,
  overviewData: null,
  availableStocks: [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "FB",
    "NFLX",
    "NVDA",
    "AMD",
    "INTC",
  ],
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setSelectedStock: (state, action) => {
      state.selectedStock = action.payload;
    },
    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStockData: (state, action) => {
      state.stockData = action.payload;
    },
    setHistoricalData: (state, action) => {
      state.historicalData = action.payload;
    },
    setOverviewData: (state, action) => {
      state.overviewData = action.payload;
    },
  },
});

export const {
  setSelectedStock,
  setTimeRange,
  setLoading,
  setError,
  setStockData,
  setHistoricalData,
  setOverviewData,
} = stockSlice.actions;

export default stockSlice.reducer;
