"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Clock,
  Users,
  Loader2,
} from "lucide-react";

export default function ShowDetailsModal({ show, isOpen, onClose }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch detailed information when modal opens
  useEffect(() => {
    const fetchShowDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/show-details?url=${encodeURIComponent(show.url)}`
        );
        const data = await response.json();

        if (data.success) {
          setDetails(data.details);
        } else {
          setError("Failed to load show details");
        }
      } catch (err) {
        setError("Error loading show details");
        console.error("Failed to fetch show details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && show && show.url) {
      fetchShowDetails();
    }
  }, [isOpen, show]);

  if (!isOpen || !show) return null;

  // Use fetched details or fall back to basic show data
  const displayData = details || show;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {show.title}
              </h2>
              {show.nextDate && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />
                  Next show: {show.nextDate}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-gray-600 dark:text-gray-300">
                Loading detailed information...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Showing basic information only.
              </p>
            </div>
          )}

          {/* Content - show when not loading or when error (fallback to basic data) */}
          {(!isLoading || error) && (
            <>
              {/* Venue Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Venue Information
                </h3>
                <div className="space-y-2">
                  {show.venue && (
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {show.venue}
                    </p>
                  )}
                  {show.address && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {show.address}
                    </p>
                  )}
                  {show.city && show.state && (
                    <p className="text-gray-600 dark:text-gray-300">
                      {show.city}, {show.state} {show.zip}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(show.contact || show.phone || show.email) && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    {show.contact && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Contact:{" "}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {show.contact}
                        </span>
                      </div>
                    )}
                    {show.phone && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Phone:{" "}
                        </span>
                        <a
                          href={`tel:${show.phone}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {show.phone}
                        </a>
                      </div>
                    )}
                    {show.email && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Email:{" "}
                        </span>
                        <a
                          href={`mailto:${show.email}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {show.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show Times & Details */}
              {(show.time || show.description) && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Show Details
                  </h3>
                  <div className="space-y-3">
                    {show.time && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Hours:{" "}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {show.time}
                        </span>
                      </div>
                    )}
                    {show.description && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Description:{" "}
                        </span>
                        <div className="text-gray-600 dark:text-gray-400 mt-1">
                          {show.description.split("\n").map((line, index) => (
                            <p key={index} className="mb-1">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Future Dates */}
              {show.futureDates && show.futureDates.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Future Show Dates
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {show.futureDates.map((date, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dealers */}
              {show.dealers && show.dealers.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Dealers at this Show
                  </h3>
                  <div className="space-y-2">
                    {show.dealers.map((dealer, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-600"
                            : "bg-gray-100 dark:bg-gray-650"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {dealer.name}
                          </span>
                          {dealer.location && (
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {dealer.location}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                {show.website && (
                  <a
                    href={show.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                )}
                {show.address && (
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(
                      `${show.address} ${show.city} ${show.state} ${show.zip}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
