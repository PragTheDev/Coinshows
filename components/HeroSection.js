import { Button } from "@/components/ui/button";

export default function HeroSection({ onRequestLocation, locationPermission }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Welcome to CoinShows!
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto mb-8">
        Discover coin shows, numismatic events, and collectible exhibitions
        happening near you. Our platform makes it easy to find and plan your
        next coin collecting adventure.
      </p>
      <Button
        className="bg-blue-600 hover:bg-blue-800"
        onClick={onRequestLocation}
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
          Location access was denied! Showing popular shows instead.
        </p>
      )}
    </div>
  );
}
