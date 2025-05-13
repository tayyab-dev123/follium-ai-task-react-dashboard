import HistoricalChart from "./components/HistoricalChart";
import TrackOverView from "./components/TrackOverView";
import RefreshButton from "./components/RefreshButton";
import Sidebar from "./components/Sidebar";
import { Suspense, useState, useEffect } from "react";

function App() {
  const [activeView, setActiveView] = useState("both"); // Default to showing both views
  const [showNotification, setShowNotification] = useState(true);

  // Check if this is the first time user opens the app in this session
  useEffect(() => {
    // Get the stored value or default to true if not found
    const notificationState = localStorage.getItem("showApiLimitsNotification");

    if (notificationState === null) {
      // First visit, show notification
      setShowNotification(true);
      // Store the value for future sessions
      localStorage.setItem("showApiLimitsNotification", "shown");
    } else {
      // Not first visit, but still show notification for this demo
      // In production, you might want to set it to false here
      setShowNotification(true);
    }
  }, []);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <section className="w-full">
            <Suspense
              fallback={
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 animate-pulse">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
                  <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 bg-slate-200 dark:bg-slate-700 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              }
            >
              <TrackOverView />
            </Suspense>
          </section>
        );
      case "chart":
        return (
          <section className="w-full">
            <Suspense
              fallback={
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 animate-pulse">
                  <div className="flex justify-between mb-6">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
                  </div>
                  <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              }
            >
              <HistoricalChart />
            </Suspense>
          </section>
        );
      default: // "both"
        return (
          <div className="grid grid-cols-1 gap-8 w-full">
            {/* Overview Section */}
            <section>
              <Suspense
                fallback={
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-32 bg-slate-200 dark:bg-slate-700 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                }
              >
                <TrackOverView />
              </Suspense>
            </section>

            {/* Chart Section */}
            <section>
              <Suspense
                fallback={
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 animate-pulse">
                    <div className="flex justify-between mb-6">
                      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
                    </div>
                    <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                }
              >
                <HistoricalChart />
              </Suspense>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h12a1 1 0 100-2H3zm9-9a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V2z"
                  clipRule="evenodd"
                />
              </svg>
              <h1 className="text-3xl font-bold tracking-tight">
                Stock Market Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium">
                  {new Date().toLocaleString()}
                </p>
              </div>
              <Suspense
                fallback={
                  <div className="animate-pulse h-10 w-32 bg-white/20 rounded-lg"></div>
                }
              >
                <RefreshButton />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      {/* API Notification Banner */}
      {showNotification && (
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-l-4 border-blue-500 p-4 shadow-md">
          <div className="container mx-auto px-6">
            <div className="flex items-start justify-between">
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                    Welcome to the Stock Market Dashboard
                  </h3>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    <p className="mb-2">
                      <strong>API Limitations:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                      <li>
                        Overview data has a standard limit of 25 API calls per
                        day
                      </li>
                      <li>
                        Historical chart data requires a premium API
                        subscription
                      </li>
                      <li>
                        The application will display sample data when premium
                        API data is unavailable
                      </li>
                    </ul>
                    <p className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-300">
                        <svg
                          className="mr-1.5 h-2 w-2 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 8 8"
                        >
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Note
                      </span>{" "}
                      You can toggle between real API data and sample data using
                      the "Show Demo Data" button when available.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="flex-shrink-0 ml-4 bg-blue-50 dark:bg-blue-900/30 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white focus:outline-none"
                onClick={handleCloseNotification}
              >
                <span className="sr-only">Close notification</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
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
          </div>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:sticky md:top-8 md:self-start h-min">
            <Sidebar setActiveView={setActiveView} />
          </aside>

          {/* Main Content Area */}
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-medium mb-4 md:mb-0">
              © {new Date().getFullYear()} Stock Dashboard | Market data
              provided for educational purposes
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
