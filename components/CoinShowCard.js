import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/showUtils";
export default function CoinShowCard({ show }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      {" "}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {" "}
        {show.name}{" "}
      </h3>{" "}
      <div className="space-y-2 mb-4">
        {" "}
        <p className="text-blue-600 font-medium">
          📅 {formatDate(show.date)}
        </p>{" "}
        <p className="text-gray-600">📍 {show.location}</p>{" "}
        <p className="text-gray-600">🏢 {show.venue}</p>{" "}
      </div>{" "}
      <p className="text-gray-700 text-sm mb-4">{show.description}</p>{" "}
      <Button variant="outline" className="w-full">
        {" "}
        View Details{" "}
      </Button>{" "}
    </div>
  );
}
