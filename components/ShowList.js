import { Button } from "@/components/ui/button";
import CoinShowCard from "./CoinShowCard";

export default function ShowList({
  shows,
  activeFilter,
  searchTerm,
  setSearchTerm,
  setActiveFilter,
  isLoading = false,
  selectedState = "TX",
  onViewDetails,
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
            viewBox="0 0 24 24"
          >
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
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Loading {selectedState} Coin Shows...
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          (Fetching real data from Coinzip.com)
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {activeFilter === "All Shows"
            ? `${selectedState} Coin Shows`
            : activeFilter}{" "}
          ({shows.length} found)
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 dark:text-blue-400"
        >
          View on Map
        </Button>
      </div>

      {/* Coin Show Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.length > 0 ? (
          shows.map((show) => (
            <CoinShowCard
              key={show.id}
              show={show}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              🔍
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No shows found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
    </>
  );
}
