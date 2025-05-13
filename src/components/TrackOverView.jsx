import React, { memo, useState } from "react";
import { useStockOverview } from "../api/stockApi.js";
import { setSelectedStock } from "../store/stockSlice.js";
import { useDispatch, useSelector } from "react-redux";

const TrackOverView = () => {
  const dispatch = useDispatch();
  const { selectedStock, availableStocks } = useSelector(
    (state) => state.stock || {}
  );
  const [showMockData, setShowMockData] = useState(false);

  // Use TanStack Query hook instead of direct API calls
  const {
    data: overviewData,
    isLoading: loading,
    error,
  } = useStockOverview(selectedStock);

  const handleStockChange = (e) => {
    dispatch(setSelectedStock(e.target.value));
  };

  // Format large numbers with commas
  const formatLargeNumber = (num) => {
    if (!num) return "0";
    return parseInt(num).toLocaleString();
  };

  // Format percentage values
  const formatPercentage = (val) => {
    if (!val) return "0%";
    return (parseFloat(val) * 100).toFixed(2) + "%";
  };

  // Determine if a value is positive or negative for styling
  const getValueColor = (val) => {
    if (!val) return "";
    return parseFloat(val) >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  // Generate placeholder loading UI for widgets
  const renderWidgetSkeleton = () => (
    <div className="bg-slate-100 dark:bg-slate-700/50 animate-pulse rounded-xl p-5 shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/4"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-16"></div>
      </div>
      <div className="h-7 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
    </div>
  );

  const handleToggleMockData = () => {
    setShowMockData(prev => !prev);
  };

  // Sample mock data for when API limit is reached
  const mockOverviewData = {
    Symbol: selectedStock || "AAPL",
    Name: selectedStock || "Apple Inc.",
    Description: "This is sample data shown because the API's standard 25 requests/day limit has been reached. The sample data demonstrates the UI functionality without making actual API calls.",
    Sector: "Technology",
    Industry: "Consumer Electronics",
    Exchange: "NASDAQ",
    Country: "USA",
    MarketCapitalization: "2500000000",
    SharesOutstanding: "17000000",
    EPS: "6.35",
    PERatio: "28.5",
    "52WeekHigh": "198.23",
    "52WeekLow": "124.17",
    LatestQuarter: "2025-03-31",
    Beta: "1.28",
    DividendYield: "0.005",
    DividendPerShare: "0.92",
    RevenueTTM: "394328000000",
    RevenuePerShareTTM: "23.20",
    ProfitMargin: "0.22",
    EBITDA: "125000000000",
    ReturnOnEquityTTM: "0.315",
    ReturnOnAssetsTTM: "0.195",
    OperatingMarginTTM: "0.292",
    QuarterlyEarningsGrowthYOY: "0.08",
    QuarterlyRevenueGrowthYOY: "0.042",
    TrailingPE: "28.5",
    ForwardPE: "25.8",
    PriceToSalesRatioTTM: "6.84",
    PriceToBookRatio: "32.75",
    PEGRatio: "2.84",
    AnalystRatingStrongBuy: 15,
    AnalystRatingBuy: 22,
    AnalystRatingHold: 8,
    AnalystRatingSell: 2,
    AnalystRatingStrongSell: 0,
    AnalystTargetPrice: "215.00",
    FiscalYearEnd: "September",
    OfficialSite: "https://www.apple.com"
  };

  // Use mock data if toggled or real data if available
  const displayData = showMockData ? mockOverviewData : overviewData;

  // Render the component
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 md:mb-0 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400"
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
          Stock Overview
        </h1>
        <div className="w-full md:w-auto">
          <div className="relative">
            <select
              value={selectedStock}
              onChange={handleStockChange}
              className={`w-full md:w-64 appearance-none pl-4 pr-10 py-3 border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white transition-all duration-200 ${loading ? 'opacity-75' : ''}`}
              disabled={loading}
            >
              {availableStocks.map((stock) => (
                <option key={stock} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && !displayData && (
        <div className="flex items-center justify-center p-10">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {error && !showMockData && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-5 my-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
              <svg
                className="h-6 w-6 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-grow">
              <p className="text-red-800 dark:text-red-200 font-medium">
                Error: {error.message || "Failed to fetch stock data"}
              </p>
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                You may have reached the standard API limit of 25 requests per day. 
              </p>
              
              {/* Toggle button for mock data */}
              <div className="mt-4">
                <button
                  onClick={handleToggleMockData}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${showMockData 
                      ? "bg-green-600 text-white hover:bg-green-700" 
                      : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                >
                  <span className="mr-2">
                    {showMockData ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.789-2.894l3.5-7A2 2 0 0114 10z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      </svg>
                    )}
                  </span>
                  {showMockData ? "Using Demo Data" : "Show Demo Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(displayData && !loading) || (displayData && showMockData) ? (
        <div className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-0 flex items-center">
              {displayData.Name}
              <span className="ml-2 px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {displayData.Symbol}
              </span>
              {showMockData && (
                <span className="ml-2 px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full">
                  Demo Data
                </span>
              )}
            </h2>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                {displayData.Exchange}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                {displayData.Country}
              </span>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-slate-50 dark:bg-slate-700/40 backdrop-filter backdrop-blur-sm p-5 rounded-xl mb-8 shadow-md transform transition-all duration-300 hover:shadow-lg">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {displayData.Description}
            </p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Sector
                </span>
                <p className="font-medium">{displayData.Sector}</p>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Industry
                </span>
                <p className="font-medium">{displayData.Industry}</p>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Exchange
                </span>
                <p className="font-medium">{displayData.Exchange}</p>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Country
                </span>
                <p className="font-medium">{displayData.Country}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {/* Market Cap */}
            {loading && !showMockData ? renderWidgetSkeleton() : (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-indigo-900/40 backdrop-blur-sm rounded-xl p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-px">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Market Cap
                  </p>
                  <span className="bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
                    MCAP
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                  ${formatLargeNumber(displayData.MarketCapitalization)}
                </p>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
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
                  <span>
                    Shares: {formatLargeNumber(displayData.SharesOutstanding)}
                  </span>
                </div>
              </div>
            )}

            {/* Earnings Per Share */}
            {loading && !showMockData ? renderWidgetSkeleton() : (
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-emerald-900/40 backdrop-blur-sm rounded-xl p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-px">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    EPS
                  </p>
                  <span className="bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs px-2 py-1 rounded-full font-medium">
                    EARNINGS
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                  ${parseFloat(displayData.EPS || 0).toFixed(2)}
                </p>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>PE Ratio: {displayData.PERatio}</span>
                </div>
              </div>
            )}

            {/* 52-Week High */}
            {loading && !showMockData ? renderWidgetSkeleton() : (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-violet-900/40 backdrop-blur-sm rounded-xl p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-px">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    52-Week High
                  </p>
                  <span className="bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-xs px-2 py-1 rounded-full font-medium">
                    HIGH
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                  ${parseFloat(displayData["52WeekHigh"] || 0).toFixed(2)}
                </p>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Last Quarter: {displayData.LatestQuarter}</span>
                </div>
              </div>
            )}

            {/* 52-Week Low */}
            {loading && !showMockData ? renderWidgetSkeleton() : (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-yellow-900/40 backdrop-blur-sm rounded-xl p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-px">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    52-Week Low
                  </p>
                  <span className="bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium">
                    LOW
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-1">
                  ${parseFloat(displayData["52WeekLow"] || 0).toFixed(2)}
                </p>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span>Beta: {displayData.Beta}</span>
                </div>
              </div>
            )}
          </div>

          {/* Rest of sections with conditional rendering for loading state */}
          {loading && !showMockData ? (
            <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl shadow-md animate-pulse">
              <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-1/4 mb-6"></div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 h-32 bg-slate-200 dark:bg-slate-600 rounded"></div>
                <div className="w-full md:w-1/3 h-32 bg-slate-200 dark:bg-slate-600 rounded"></div>
                <div className="w-full md:w-1/3 h-32 bg-slate-200 dark:bg-slate-600 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-700/30 backdrop-blur-sm rounded-xl shadow-md">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 text-lg">
                Key Metrics
              </h3>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="w-full md:w-1/3 bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Dividend Yield
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {formatPercentage(displayData.DividendYield)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Dividend: ${displayData.DividendPerShare}/share
                  </p>
                </div>
                <div className="w-full md:w-1/3 bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Revenue (TTM)
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    ${formatLargeNumber(displayData.RevenueTTM)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Per Share: ${displayData.RevenuePerShareTTM}
                  </p>
                </div>
                <div className="w-full md:w-1/3 bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-500 mr-2"
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Profit Margin
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {formatPercentage(displayData.ProfitMargin)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    EBITDA: ${formatLargeNumber(displayData.EBITDA)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analyst Ratings */}
          {loading && !showMockData ? (
            <div className="mt-8 p-5 bg-slate-100 dark:bg-slate-700/50 animate-pulse rounded-xl shadow-md">
              <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-6"></div>
              <div className="flex space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-1 h-20 bg-slate-200 dark:bg-slate-600 rounded"></div>
                ))}
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-600 rounded"></div>
            </div>
          ) : (
            <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-xl shadow-md">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 text-lg flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                Analyst Ratings
              </h3>
              <div className="flex space-x-2 mb-4">
                <div className="flex-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 p-3 rounded-lg text-center shadow-sm transition-transform duration-200 hover:transform hover:scale-105">
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                    Strong Buy
                  </p>
                  <p className="font-bold text-lg text-green-800 dark:text-green-200">
                    {displayData.AnalystRatingStrongBuy || 0}
                  </p>
                </div>
                <div className="flex-1 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-lg text-center shadow-sm transition-transform duration-200 hover:transform hover:scale-105">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Buy
                  </p>
                  <p className="font-bold text-lg text-green-700 dark:text-green-300">
                    {displayData.AnalystRatingBuy || 0}
                  </p>
                </div>
                <div className="flex-1 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800/40 dark:to-slate-700/40 p-3 rounded-lg text-center shadow-sm transition-transform duration-200 hover:transform hover:scale-105">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Hold
                  </p>
                  <p className="font-bold text-lg text-slate-700 dark:text-slate-200">
                    {displayData.AnalystRatingHold || 0}
                  </p>
                </div>
                <div className="flex-1 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-3 rounded-lg text-center shadow-sm transition-transform duration-200 hover:transform hover:scale-105">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Sell
                  </p>
                  <p className="font-bold text-lg text-red-700 dark:text-red-300">
                    {displayData.AnalystRatingSell || 0}
                  </p>
                </div>
                <div className="flex-1 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 p-3 rounded-lg text-center shadow-sm transition-transform duration-200 hover:transform hover:scale-105">
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                    Strong Sell
                  </p>
                  <p className="font-bold text-lg text-red-800 dark:text-red-200">
                    {displayData.AnalystRatingStrongSell || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center bg-white dark:bg-slate-700 p-3 rounded-lg shadow-sm">
                <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
                  Target Price:
                </span>
                <span className="font-semibold text-lg text-slate-800 dark:text-white">
                  ${displayData.AnalystTargetPrice}
                </span>
              </div>
            </div>
          )}

          {/* Performance Metrics & Valuation Metrics sections with loading states */}
          {loading && !showMockData ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-700/50 animate-pulse p-5 rounded-xl shadow-md">
                  <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-6"></div>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-12 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-700 p-5 rounded-xl shadow-md">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Performance Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Return On Equity:
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-lg ${getValueColor(
                        displayData.ReturnOnEquityTTM
                      )} bg-opacity-10`}
                    >
                      {formatPercentage(displayData.ReturnOnEquityTTM)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Return On Assets:
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-lg ${getValueColor(
                        displayData.ReturnOnAssetsTTM
                      )} bg-opacity-10`}
                    >
                      {formatPercentage(displayData.ReturnOnAssetsTTM)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Operating Margin:
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-lg ${getValueColor(
                        displayData.OperatingMarginTTM
                      )} bg-opacity-10`}
                    >
                      {formatPercentage(displayData.OperatingMarginTTM)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Quarterly Earnings Growth:
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-lg ${getValueColor(
                        displayData.QuarterlyEarningsGrowthYOY
                      )} bg-opacity-10`}
                    >
                      {formatPercentage(displayData.QuarterlyEarningsGrowthYOY)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Quarterly Revenue Growth:
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-lg ${getValueColor(
                        displayData.QuarterlyRevenueGrowthYOY
                      )} bg-opacity-10`}
                    >
                      {formatPercentage(displayData.QuarterlyRevenueGrowthYOY)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-700 p-5 rounded-xl shadow-md">
                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                  Valuation Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Trailing PE:
                    </span>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                      {displayData.TrailingPE}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Forward PE:
                    </span>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                      {displayData.ForwardPE}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Price to Sales:
                    </span>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                      {displayData.PriceToSalesRatioTTM}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      Price to Book:
                    </span>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                      {displayData.PriceToBookRatio}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-600 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-500">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      PEG Ratio:
                    </span>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                      {displayData.PEGRatio}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer with website and info */}
          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
              <div className="mb-3 md:mb-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Fiscal Year End: {displayData.FiscalYearEnd}</span>
              </div>
              <div className="mb-3 md:mb-0">
                <a
                  href={displayData.OfficialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Visit Website
                </a>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Latest Trading Day:{" "}
                  {displayData.LatestQuarter ||
                    new Date().toISOString().split("T")[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !error && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-5 my-6 rounded-lg shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  No data available
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                  We couldn't retrieve any stock data. This may be due to API limitations.
                </p>
                <button 
                  onClick={handleToggleMockData} 
                  className="mt-3 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/50 dark:hover:bg-yellow-800/70 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Show Demo Data
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default memo(TrackOverView);
