"use client";

import { useState } from "react";
import { sampleShows } from "@/data/sampleShows";
import { requestUserLocation, filterShows } from "@/utils/showUtils";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchAndFilter from "@/components/SearchAndFilter";
import ShowList from "@/components/ShowList";
import AddShowModal from "@/components/AddShowModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Shows");
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState("unknown");
  const [shows, setShows] = useState(sampleShows);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingStatus, setScrapingStatus] = useState("");

  // Handle location request
  const handleRequestLocation = async () => {
    setLocationPermission("requesting");
    try {
      const location = await requestUserLocation();
      setUserLocation(location);
      setLocationPermission("granted");
      setActiveFilter("Near Me");
    } catch (error) {
      setLocationPermission("denied");
      alert("Location access denied. Showing all shows instead.");
    }
  };

  // Handle scraping Texas shows from Coinzip
  const handleScrapeTexasShows = async () => {
    setIsLoading(true);
    setScrapingStatus("🕷️ Scraping Texas shows from Coinzip...");

    try {
      const response = await fetch("/api/scrape");
      const data = await response.json();

      if (data.success) {
        setShows(data.shows);
        setScrapingStatus(
          `✅ Successfully loaded ${data.shows.length} real Texas coin shows!`
        );
        setActiveFilter("All Shows"); // Reset filter to show all scraped shows

        setTimeout(() => {
          setScrapingStatus("");
        }, 3000);
      } else {
        setScrapingStatus("❌ Scraping failed, using fallback data");
        setShows(data.shows || sampleShows); // Use fallback shows if available

        setTimeout(() => {
          setScrapingStatus("");
        }, 3000);
      }
    } catch (error) {
      console.error("Scraping error:", error);
      setScrapingStatus("❌ Error connecting to scraper");

      setTimeout(() => {
        setScrapingStatus("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Get filtered shows
  const filteredShows = filterShows(
    shows, // Use dynamic shows instead of sampleShows
    searchTerm,
    activeFilter,
    userLocation
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAddShowClick={() => setShowAddShowModal(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <HeroSection
          onRequestLocation={handleRequestLocation}
          locationPermission={locationPermission}
        />

        {/* Scraping Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Real Data from Coinzip
              </h3>
              <p className="text-sm text-gray-600">
                Load current Texas coin shows scraped from Coinzip.com
              </p>
              {scrapingStatus && (
                <p className="text-sm font-medium mt-2 text-blue-600">
                  {scrapingStatus}
                </p>
              )}
            </div>
            <button
              onClick={handleScrapeTexasShows}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Scraping...
                </span>
              ) : (
                "🕷️ Load Real Texas Shows"
              )}
            </button>
          </div>
        </div>

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          userLocation={userLocation}
        />

        <ShowList
          shows={filteredShows}
          activeFilter={activeFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setActiveFilter={setActiveFilter}
        />
      </main>

      <AddShowModal
        isOpen={showAddShowModal}
        onClose={() => setShowAddShowModal(false)}
      />

      <Footer />
    </div>
  );
}
