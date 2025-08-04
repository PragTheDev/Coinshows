import { Button } from "@/components/ui/button";

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  userLocation,
}) {
  const filters = ["This Month", "Next Month", "Near Me", "All Shows"];

  return (
    <>
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
          {filters.map((filter) => (
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
              {filter === "Near Me" && userLocation && " ✓"}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
