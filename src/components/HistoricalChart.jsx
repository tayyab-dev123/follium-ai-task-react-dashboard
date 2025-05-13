import { useDispatch, useSelector } from "react-redux";
import { useHistoricalData } from "../api/stockApi";
import { setError, setHistoricalData, setTimeRange } from "../store/stockSlice";
import { memo, useRef, useCallback, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HistoricalChart = () => {
  const dispatch = useDispatch();
  const {
    selectedStock,
    timeRange,
    error: reduxError,
    historicalData,
  } = useSelector((state) => state.stock);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [showMockData, setShowMockData] = useState(false);

  const chartRef = useRef(null);

  // Define available time ranges with icons
  const timeRanges = [
    {
      label: "1 Week",
      value: "1week",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
      ),
    },
    {
      label: "1 Month",
      value: "1month",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      label: "3 Months",
      value: "3months",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
    },
  ];

  // Use TanStack Query for fetching historical data
  const {
    data,
    error: queryError,
    isLoading,
    isError,
  } = useHistoricalData(selectedStock, timeRange, {
    enabled: !!selectedStock && !showMockData,
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Add 30-second refetch interval for real-time updates
  });

  // Set error message if TanStack Query returns an error
  useEffect(() => {
    if (isError && queryError) {
      dispatch(
        setError(queryError.message || "Failed to fetch historical data")
      );
    }
  }, [isError, queryError, dispatch]);

  // Process API data or use mock data based on conditions
  useEffect(() => {
    // If showing mock data, use hardcoded data
    if (showMockData) {
      const mockData = processHardcodedData();
      dispatch(setHistoricalData(mockData));
      return;
    }

    // If no selected stock, use demo data
    if (!selectedStock) {
      const hardcodedData = processHardcodedData();
      dispatch(setHistoricalData(hardcodedData));
      return;
    }

    // Handle API response data
    if (data && !isLoading) {
      console.log("Fetched historical data:", data);

      // Check if data is empty or has error info (premium API message)
      if (
        !data ||
        Object.keys(data).length === 0 ||
        data.Note ||
        data.Information
      ) {
        // This indicates the API returned a premium message or error
        const errorMsg =
          data?.Note ||
          data?.Information ||
          "This endpoint requires a premium API key";
        dispatch(setError(errorMsg));

        // Set empty chart data to prevent crashes
        dispatch(
          setHistoricalData({
            symbol: selectedStock,
            interval: "5min",
            data: [],
          })
        );
      } else {
        // Valid data received
        dispatch(setHistoricalData(data));
        // Clear any previous errors
        dispatch(setError(null));
      }
    }
  }, [data, isLoading, selectedStock, showMockData, dispatch]);

  // Function to process the hardcoded data - wrapped in useCallback
  const processHardcodedData = useCallback(() => {
    // Mock data from the provided JSON
    const mockData = {
      "Meta Data": {
        Information: "Intraday (5min) open, high, low, close prices and volume",
        Symbol: "AAPL",
        "Last Refreshed": "2025-05-09 19:55:00",
        Interval: "5min",
        "Output Size": "Compact",
        "Time Zone": "US/Eastern",
      },
      "Time Series (5min)": {
        "2025-05-09 19:55:00": {
          open: "198.5600",
          high: "198.5800",
          low: "198.5100",
          close: "198.5800",
          volume: "2904",
        },
        "2025-05-09 19:50:00": {
          open: "198.5300",
          high: "198.5900",
          low: "198.5100",
          close: "198.5600",
          volume: "3588",
        },
        // Additional entries would be here in the actual hardcoded data
      },
    };

    // Transform the hardcoded data to the format needed for the chart
    const timeSeriesData = mockData["Time Series (5min)"];

    // Extract and sort timestamps
    const timestamps = Object.keys(timeSeriesData).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Limit data points based on the selected time range
    let filteredTimestamps = timestamps;
    if (timeRange === "1week") {
      // Get only the last week of data (assume 5 trading days, ~8 hours per day, 12 entries per hour)
      filteredTimestamps = timestamps.slice(-480); // 5 days * 8 hours * 12 entries per hour
    } else if (timeRange === "1month") {
      // Get only the last month of data
      filteredTimestamps = timestamps.slice(-1920); // ~20 trading days * 8 hours * 12 entries per hour
    }
    // For 3months, use all available data

    // Create the chart data
    const chartData = filteredTimestamps.map((timestamp) => {
      const data = timeSeriesData[timestamp];
      return {
        timestamp: timestamp,
        close: parseFloat(data.close),
        open: parseFloat(data.open),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        volume: parseInt(data.volume),
      };
    });

    return {
      symbol: mockData["Meta Data"].Symbol,
      interval: mockData["Meta Data"].Interval,
      data: chartData,
    };
  }, [timeRange]);

  // Handle time range change - wrapped in useCallback
  const handleTimeRangeChange = useCallback(
    (e) => {
      dispatch(setTimeRange(e.target.value));
    },
    [dispatch]
  );

  // Prepare chart data - wrapped in useCallback
  const prepareChartData = useCallback(() => {
    if (
      !historicalData ||
      !historicalData?.data ||
      historicalData?.data?.length === 0
    ) {
      return {
        labels: [],
        datasets: [
          {
            label: "Loading...",
            data: [],
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.1,
          },
        ],
      };
    }

    // Get the sorted time series data
    const sortedData = [...historicalData.data].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Format timestamps for display
    const formattedLabels = sortedData.map((item) => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    const closingPrices = sortedData.map((item) => item.close);

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: `${historicalData?.symbol || selectedStock} Closing Price`,
          data: closingPrices,
          borderColor: "rgba(59, 130, 246, 1)", // blue-500
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "rgba(59, 130, 246, 1)",
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [historicalData, selectedStock]);

  // Chart options - wrapped in useCallback
  const chartOptions = useCallback(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(17, 24, 39, 0.8)", // gray-900 with opacity
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          boxPadding: 5,
          usePointStyle: true,
          callbacks: {
            label: function (context) {
              return `Closing Price: $${context.parsed.y.toFixed(2)}`;
            },
            title: function (context) {
              if (!context[0] || !historicalData?.data) return "";

              const index = context[0].dataIndex;
              if (index >= 0 && historicalData.data[index]) {
                const timestamp = historicalData.data[index].timestamp;
                if (timestamp) {
                  return new Date(timestamp).toLocaleString();
                }
              }
              return "";
            },
          },
        },
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            color: document.documentElement.classList.contains("dark")
              ? "#f1f5f9" // slate-100 for dark mode
              : "#1e293b", // slate-800 for light mode
          },
        },
        title: {
          display: true,
          text: `${selectedStock || "AAPL"} Historical Data (${timeRange})`,
          color: document.documentElement.classList.contains("dark")
            ? "#f1f5f9" // slate-100 for dark mode
            : "#1e293b", // slate-800 for light mode
          font: {
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true,
            color: "rgba(148, 163, 184, 0.1)", // slate-400 with low opacity
          },
          title: {
            display: true,
            text: "Time",
            color: document.documentElement.classList.contains("dark")
              ? "#cbd5e1" // slate-300 for dark mode
              : "#64748b", // slate-500 for light mode
            padding: {
              top: 10,
            },
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            maxTicksLimit: 10,
            color: document.documentElement.classList.contains("dark")
              ? "#cbd5e1" // slate-300 for dark mode
              : "#64748b", // slate-500 for light mode
          },
        },
        y: {
          display: true,
          grid: {
            display: true,
            color: "rgba(148, 163, 184, 0.1)", // slate-400 with low opacity
            drawBorder: false,
          },
          title: {
            display: true,
            text: "Price ($)",
            color: document.documentElement.classList.contains("dark")
              ? "#cbd5e1" // slate-300 for dark mode
              : "#64748b", // slate-500 for light mode
            padding: {
              bottom: 10,
            },
          },
          ticks: {
            callback: function (value) {
              return "$" + value.toFixed(2);
            },
            color: document.documentElement.classList.contains("dark")
              ? "#cbd5e1" // slate-300 for dark mode
              : "#64748b", // slate-500 for light mode
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "nearest",
      },
      elements: {
        line: {
          tension: 0.4, // Smoother curve
        },
        point: {
          radius: 0, // Hide points by default
          hoverRadius: 6, // Show on hover
        },
      },
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
    }),
    [historicalData, selectedStock, timeRange]
  );

  // Toggle mock data handler
  const handleToggleMockData = useCallback(() => {
    setShowMockData((prevState) => {
      const newState = !prevState;

      // If toggling to true, immediately process and display mock data
      if (newState) {
        const mockData = processHardcodedData();
        dispatch(setHistoricalData(mockData));
        // Clear any previous errors when showing mock data
        dispatch(setError(null));
      } else if (reduxError) {
        // If turning off mock data and there's an error, set empty data
        dispatch(
          setHistoricalData({
            symbol: selectedStock,
            interval: "5min",
            data: [],
          })
        );
      }

      return newState;
    });
  }, [dispatch, processHardcodedData, selectedStock, reduxError]);

  // Combine loading state from Redux and React Query
  const loading = isLoading && !showMockData;

  // Combine errors from Redux and React Query
  const error = reduxError;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 md:mb-0 flex items-center text-center md:text-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 dark:text-blue-400"
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
          {selectedStock || "AAPL"} Historical Price Chart
        </h2>

        <div className="w-full md:w-auto">
          <div className="relative">
            {/* Premium API tooltip */}
            <button
              className="absolute right-14 top-3 z-10 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
              onClick={() => setTooltipVisible(!tooltipVisible)}
            >
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {tooltipVisible && (
              <div className="absolute right-0 sm:right-14 top-10 z-20 w-full sm:w-72 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4 text-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-800 dark:text-white">
                    Premium API Required
                  </h4>
                  <button
                    onClick={() => setTooltipVisible(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Alpha Vantage API requires a premium subscription for full
                  historical data access. The chart might display sample data or
                  be limited.
                </p>
                <a
                  href="https://www.alphavantage.co/premium/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Learn about premium access →
                </a>
              </div>
            )}

            <div className="relative bg-slate-50 dark:bg-slate-700 rounded-lg shadow-md w-full">
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="appearance-none w-full pl-10 pr-10 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-slate-800 dark:text-white font-medium"
              >
                {timeRanges.map((range) => (
                  <option
                    key={range.value}
                    value={range.value}
                    className="bg-slate-50 dark:bg-slate-700"
                  >
                    {range.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {timeRanges.find((range) => range.value === timeRange)
                  ?.icon || (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
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
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-10">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 sm:p-5 my-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 flex justify-center sm:justify-start">
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
              <p className="text-red-800 dark:text-red-200 font-medium text-center sm:text-left">
                Error: {error}
              </p>
              {error && error.includes("premium") && (
                <p className="text-red-700 dark:text-red-300 text-sm mt-1 text-center sm:text-left">
                  The historical chart data requires a premium API subscription.
                </p>
              )}

              {/* Toggle button for mock data - improved for mobile */}
              <div className="mt-4 flex flex-col sm:flex-row items-center">
                <button
                  onClick={handleToggleMockData}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all w-full sm:w-auto justify-center
                    ${
                      showMockData
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                >
                  <span className="mr-2">
                    {showMockData ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </span>
                  {showMockData ? "Using Demo Data" : "Show Demo Data"}
                </button>
                <span className="mt-2 sm:mt-0 sm:ml-3 text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
                  {showMockData
                    ? "Showing sample visualization with mock data"
                    : "Click to see a demonstration with sample data"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && historicalData && (
        <div className="h-96 relative bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4 shadow-inner">
          {historicalData?.data?.length === 0 && !loading && !showMockData && (
            <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-slate-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p className="text-slate-500 dark:text-slate-400 text-center px-4">
                Premium API subscription required for historical data.
                <br />
                <span className="text-sm">
                  Click "Show Demo Data" to see sample visualization.
                </span>
              </p>
            </div>
          )}
          <Line
            ref={chartRef}
            data={prepareChartData()}
            options={chartOptions()}
          />
        </div>
      )}

      {/* Chart Legend and Information */}
      {!loading &&
        historicalData &&
        historicalData.data &&
        historicalData.data.length > 0 && (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-3 sm:p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Current
                </p>
                <span className="bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs px-2 py-0.5 sm:py-1 rounded-full">
                  NOW
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-300 group-hover:scale-110 transform transition-transform duration-300">
                $
                {historicalData.data.length > 0
                  ? (
                      historicalData.data[historicalData.data.length - 1]
                        ?.close || 0
                    ).toFixed(2)
                  : "0.00"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
                Last recorded price
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-3 sm:p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Highest
                </p>
                <span className="bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs px-2 py-0.5 sm:py-1 rounded-full">
                  MAX
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300 group-hover:scale-110 transform transition-transform duration-300">
                $
                {historicalData.data.length > 0
                  ? Math.max(
                      ...(historicalData.data.map((d) => d.high || 0) || [0])
                    ).toFixed(2)
                  : "0.00"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
                Highest price in period
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-3 sm:p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg group">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Lowest
                </p>
                <span className="bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 text-xs px-2 py-0.5 sm:py-1 rounded-full">
                  MIN
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-red-700 dark:text-red-300 group-hover:scale-110 transform transition-transform duration-300">
                $
                {historicalData.data.length > 0
                  ? Math.min(
                      ...(historicalData.data.map((d) => d.low || 0) || [0])
                    ).toFixed(2)
                  : "0.00"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
                Lowest price in period
              </p>
            </div>
          </div>
        )}

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2 text-blue-500 hidden sm:block"
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
        <p className="text-center sm:text-left">
          <span className="flex justify-center sm:hidden items-center mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1 text-blue-500"
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
            Chart Information
          </span>
          Data interval:{" "}
          <span className="font-medium">
            {historicalData?.interval || "5min"}
          </span>{" "}
          <span className="hidden sm:inline">|</span>{" "}
          <span className="block sm:inline mt-1 sm:mt-0">
            Last updated:{" "}
            <span className="font-medium">{new Date().toLocaleString()}</span>{" "}
          </span>
          <button
            className="text-blue-500 cursor-help mt-1 sm:mt-0 sm:ml-1 inline-flex items-center"
            onClick={() => setTooltipVisible(!tooltipVisible)}
          >
            <span>({showMockData ? "Demo Data" : "Premium API"})</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </p>
      </div>
    </div>
  );
};

export default memo(HistoricalChart);
