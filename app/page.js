"use client";

import { useState, useEffect } from "react";
import { requestUserLocation, filterShows } from "@/utils/showUtils";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StateSelector from "@/components/StateSelector";
import SearchAndFilter from "@/components/SearchAndFilter";
import ShowList from "@/components/ShowList";
import AddShowModal from "@/components/AddShowModal";
import ShowDetailsModal from "@/components/ShowDetailsModal";
import Footer from "@/components/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Shows");
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState("unknown");
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("TX");

  // Auto-load shows for selected state on component mount and state change
  useEffect(() => {
    const loadShows = async () => {
      setIsLoading(true);

      // Show loading toast
      const loadingToast = toast.loading(
        `Loading ${selectedState} coin shows from Coinzip...`
      );

      try {
        const response = await fetch(`/api/scrape?state=${selectedState}`);
        const data = await response.json();

        if (data.success && data.shows.length > 0) {
          setShows(data.shows);

          // Success toast
          toast.success(
            `✅ Loaded ${data.shows.length} ${selectedState} coin shows`,
            { id: loadingToast }
          );
        } else {
          setShows([]);

          // Error toast
          toast.error(`No shows found for ${selectedState}`, {
            id: loadingToast,
          });
        }
      } catch (error) {
        console.error("Loading error:", error);
        setShows([]);

        // Error toast
        toast.error(`Error loading ${selectedState} coin shows!`, {
          id: loadingToast,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadShows();
  }, [selectedState]);

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

  // Handle state change
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    setActiveFilter("All Shows");
    setSearchTerm("");
  };

  // Handle show details view
  const handleViewDetails = (show) => {
    setSelectedShow(show);
    setShowDetailsModal(true);
  };

  // Get filtered shows
  const filteredShows = filterShows(
    shows,
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

        {/* State Selector */}
        <div className="flex justify-center mb-8">
          <StateSelector
            selectedState={selectedState}
            onStateChange={handleStateChange}
            isLoading={isLoading}
          />
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
          isLoading={isLoading}
          selectedState={selectedState}
          onViewDetails={handleViewDetails}
        />
      </main>

      <AddShowModal
        isOpen={showAddShowModal}
        onClose={() => setShowAddShowModal(false)}
      />

      <ShowDetailsModal
        show={selectedShow}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedShow(null);
        }}
      />

      <Footer />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
          },
          success: {
            duration: 2000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </div>
  );
}
