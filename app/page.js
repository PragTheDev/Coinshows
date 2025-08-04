"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

// Sample coin show data (temporary - later we'll get this from a database)
const sampleShows = [
  {
    id: 1,
    name: "Chicago Coin & Currency Show",
    date: "March 15, 2025",
    location: "Chicago, IL",
    venue: "Chicago Convention Center",
    description:
      "One of the Midwest's largest coin shows featuring dealers from across the country.",
  },
  {
    id: 2,
    name: "California Numismatic Society Show",
    date: "March 22, 2025",
    location: "Los Angeles, CA",
    venue: "LA Convention Center",
    description:
      "Annual show featuring rare coins, currency, and collectibles.",
  },
  {
    id: 3,
    name: "New York Coin Expo",
    date: "April 5, 2025",
    location: "New York, NJ",
    venue: "Javits Center",
    description:
      "Premier East Coast coin show with international dealers and exhibits.",
  },
];

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [showAddShowModal, setShowAddShowModal] = useState(false);

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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to CoinShows
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover coin shows, numismatic events, and collectible exhibitions
            happening near you. Our platform makes it easy to find and plan your
            next coin collecting adventure.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Find Shows Near Me
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
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
            <Button variant="outline" size="sm" className="text-sm">
              This Month
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              Next Month
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              Near Me
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              All Shows
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Upcoming Coin Shows ({sampleShows.length} found)
          </h3>
          <Button variant="ghost" size="sm" className="text-blue-600">
            View on Map
          </Button>
        </div>

        {/* Coin Show Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleShows.map((show) => (
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
          ))}
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
