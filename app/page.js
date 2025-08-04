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
    sampleShows,
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
