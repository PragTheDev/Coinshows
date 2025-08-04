"use client";

import { useState, useEffect } from "react";
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
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(
    "🕷️ Loading Texas coin shows..."
  );

  // Auto-load Texas shows on component mount
  useEffect(() => {
    const loadTexasShows = async () => {
      setIsLoading(true);
      setLoadingStatus("🕷️ Loading Texas coin shows from Coinzip...");

      try {
        const response = await fetch("/api/scrape");
        const data = await response.json();

        if (data.success && data.shows.length > 0) {
          setShows(data.shows);
          setLoadingStatus(`✅ Loaded ${data.shows.length} Texas coin shows`);

          setTimeout(() => {
            setLoadingStatus("");
          }, 2000);
        } else {
          setLoadingStatus("❌ No shows found or scraping failed");
          setShows([]);

          setTimeout(() => {
            setLoadingStatus("");
          }, 3000);
        }
      } catch (error) {
        console.error("Loading error:", error);
        setLoadingStatus("❌ Error loading coin shows");
        setShows([]);

        setTimeout(() => {
          setLoadingStatus("");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    loadTexasShows();
  }, []);

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

  // Get filtered shows
  const filteredShows = filterShows(
    shows, // Use dynamic shows instead of sampleShows
    searchTerm,
    activeFilter,
    userLocation
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header onAddShowClick={() => setShowAddShowModal(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <HeroSection
          onRequestLocation={handleRequestLocation}
          locationPermission={locationPermission}
        />

        {/* Loading Status */}
        {loadingStatus && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8 text-center">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {loadingStatus}
            </p>
          </div>
        )}

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
          isLoading={isLoading}
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
