import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600">CoinShows</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Find coin shows and numismatic events near you
            </p>
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

        {/* Placeholder for future content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-500">
            Coin show listings and search functionality will appear here
          </p>
        </div>
      </main>

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
