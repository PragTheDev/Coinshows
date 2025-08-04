"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

// Sample coin show data (temporary - later we'll get this from a database)
const sampleShows = [
  {
    id: 1,
    name: "Chicago Coin & Currency Show",
    date: "2025-03-15",
    location: "Chicago, IL",
    venue: "Chicago Convention Center",
    description:
      "One of the Midwest's largest coin shows featuring dealers from across the country.",
  },
  {
    id: 2,
    name: "California Numismatic Society Show",
    date: "2025-03-22",
    location: "Los Angeles, CA",
    venue: "LA Convention Center",
    description:
      "Annual show featuring rare coins, currency, and collectibles.",
  },
  {
    id: 3,
    name: "New York Coin Expo",
    date: "2025-04-05",
    location: "New York, NY",
    venue: "Javits Center",
    description:
      "Premier East Coast coin show with international dealers and exhibits.",
  },
  {
    id: 4,
    name: "Texas State Coin Show",
    date: "2025-03-28",
    location: "Dallas, TX",
    venue: "Dallas Market Hall",
    description:
      "Largest coin show in Texas with over 200 dealers and special exhibits.",
  },
  {
    id: 5,
    name: "Florida United Numismatists Convention",
    date: "2025-04-12",
    location: "Orlando, FL",
    venue: "Orange County Convention Center",
    description:
      "Premier Florida coin show featuring ancient coins, world coins, and US rarities.",
  },
  {
    id: 6,
    name: "Denver Coin & Collectibles Show",
    date: "2025-03-30",
    location: "Denver, CO",
    venue: "National Ballpark Museum",
    description:
      "Mountain West's favorite coin show with family-friendly atmosphere.",
  },
  {
    id: 7,
    name: "Philadelphia Coin & Currency Show",
    date: "2025-04-18",
    location: "Philadelphia, PA",
    venue: "Pennsylvania Convention Center",
    description: "Historic coin show in the birthplace of American coinage.",
  },
  {
    id: 8,
    name: "Seattle Numismatic Society Spring Show",
    date: "2025-04-25",
    location: "Seattle, WA",
    venue: "Seattle Center Exhibition Hall",
    description: "Pacific Northwest premier coin and currency exhibition.",
  },
  {
    id: 9,
    name: "Atlanta Coin Show",
    date: "2025-03-08",
    location: "Atlanta, GA",
    venue: "Cobb Galleria Centre",
    description:
      "Southeast's leading coin show with educational seminars and auctions.",
  },
  {
    id: 10,
    name: "Phoenix Coin Club Show",
    date: "2025-04-02",
    location: "Phoenix, AZ",
    venue: "Arizona State Fairgrounds",
    description:
      "Desert Southwest coin show featuring Western and territorial coins.",
  },
];

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Shows");
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState("unknown"); // "unknown", "granted", "denied"

  // Request user location
  const requestLocation = () => {
    if ("geolocation" in navigator) {
      setLocationPermission("requesting");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationPermission("granted");
          setActiveFilter("Near Me");
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission("denied");
          // Fallback to showing all shows
          alert("Location access denied. Showing all shows instead.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLocationPermission("denied");
    }
  };

  // Helper function to format dates nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter shows based on search and active filter
  const filteredShows = sampleShows.filter((show) => {
    const matchesSearch =
      show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.venue.toLowerCase().includes(searchTerm.toLowerCase());

    const currentDate = new Date();
    const showDate = new Date(show.date);

    if (activeFilter === "This Month") {
      const isThisMonth =
        showDate.getMonth() === currentDate.getMonth() &&
        showDate.getFullYear() === currentDate.getFullYear();
      return matchesSearch && isThisMonth;
    } else if (activeFilter === "Next Month") {
      const nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
      const isNextMonth =
        showDate.getMonth() === nextMonth.getMonth() &&
        showDate.getFullYear() === nextMonth.getFullYear();
      return matchesSearch && isNextMonth;
    } else if (activeFilter === "Near Me") {
      if (userLocation) {
        // If we have real location, show shows from nearby states (simplified logic)
        // In a real app, you'd calculate actual distances
        const nearbyStates = ["CA", "IL", "NY", "TX", "FL"]; // Popular states for demo.
        const isNearby = nearbyStates.some((state) =>
          show.location.includes(state)
        );
        return matchesSearch && isNearby;
      } else {
        // Fallback: show some popular locations
        const popularStates = ["CA", "IL", "NY", "TX", "NJ"];
        const isPopular = popularStates.some((state) =>
          show.location.includes(state)
        );
        return matchesSearch && isPopular;
      }
    }

    return matchesSearch; // "All Shows"
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                CoinShows
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Discover coin shows nationwide
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Events
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </a>

              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <Button
                    size="sm"
                    onClick={() => setShowAddShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 shadow-md"
                  >
                    Add Show
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Welcome,{" "}
                      {user?.firstName ||
                        user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 shadow-md"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content*/}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to CoinShows!
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover coin shows, numismatic events, and collectible exhibitions
            happening near you. Our platform makes it easy to find and plan your
            next coin collecting adventure.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={requestLocation}
            disabled={locationPermission === "requesting"}
          >
            {locationPermission === "requesting"
              ? "Getting Your Location..."
              : locationPermission === "granted"
              ? "✓ Location Enabled - Find More Shows"
              : "Find Shows Near Me"}
          </Button>
          {locationPermission === "denied" && (
            <p className="text-sm text-gray-500 mt-2">
              Location access denied. Showing popular shows instead.
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search coin shows by name or location..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {["This Month", "Next Month", "Near Me", "All Shows"].map(
              (filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={`text-sm ${
                    activeFilter === filter
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : ""
                  }`}
                >
                  {filter}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeFilter === "All Shows"
              ? "Upcoming Coin Shows"
              : activeFilter}
            ({filteredShows.length} found)
          </h3>
          <Button variant="ghost" size="sm" className="text-blue-600">
            View on Map
          </Button>
        </div>

        {/* Coin Show Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShows.length > 0 ? (
            filteredShows.map((show) => (
              <div
                key={show.id}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {show.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-blue-600 font-medium">📅 {show.date}</p>
                  <p className="text-gray-600">📍 {show.location}</p>
                  <p className="text-gray-600">🏢 {show.venue}</p>
                </div>
                <p className="text-gray-700 text-sm mb-4">{show.description}</p>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No shows found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("All Shows");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add Show Modal */}
      {showAddShowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Add New Coin Show
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                // In a real app, you'd send this to your backend
                alert("Show submitted for review! (This is just a demo)");
                setShowAddShowModal(false);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Show Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Denver Coin Show"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Denver, CO"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    name="venue"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Denver Convention Center"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the coin show..."
                  />
                </div>
              </div>
              <div className="flex justify-between space-x-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  Submit Show
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 CoinShows. Find coin shows and numismatic events.</p>
            <p className="mt-2 text-sm">
              Making coin collecting more accessible, one show at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
