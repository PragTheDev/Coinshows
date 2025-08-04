import { Button } from "@/components/ui/button";
import CoinShowCard from "./CoinShowCard";

export default function ShowList({
  shows,
  activeFilter,
  searchTerm,
  setSearchTerm,
  setActiveFilter,
}) {
  return (
    <>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {activeFilter === "All Shows" ? "Upcoming Coin Shows" : activeFilter}(
          {shows.length} found)
        </h3>
        <Button variant="ghost" size="sm" className="text-blue-600">
          View on Map
        </Button>
      </div>

      {/* Coin Show Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.length > 0 ? (
          shows.map((show) => <CoinShowCard key={show.id} show={show} />)
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
    </>
  );
}
