import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/showUtils";

export default function CoinShowCard({ show, onViewDetails }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {show.name}
      </h3>
      <div className="space-y-2 mb-4">
        <p className="text-blue-600 dark:text-blue-400 font-medium">
          📅 {formatDate(show.date)}
        </p>
        <p className="text-gray-600 dark:text-gray-300">📍 {show.location}</p>
        <p className="text-gray-600 dark:text-gray-300">🏢 {show.venue}</p>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
        {show.description}
      </p>
      <Button
        variant="outline"
        className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => onViewDetails && onViewDetails(show)}
      >
        View Details
      </Button>
    </div>
  );
}
