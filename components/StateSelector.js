"use client";

import { useState } from "react";

const US_STATES = [
  { code: "TX", name: "Texas" },
  { code: "CA", name: "California" },
  { code: "FL", name: "Florida" },
  { code: "NY", name: "New York" },
  { code: "PA", name: "Pennsylvania" },
  { code: "IL", name: "Illinois" },
  { code: "OH", name: "Ohio" },
  { code: "GA", name: "Georgia" },
  { code: "NC", name: "North Carolina" },
  { code: "MI", name: "Michigan" },
  { code: "NJ", name: "New Jersey" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "AZ", name: "Arizona" },
  { code: "MA", name: "Massachusetts" },
  { code: "TN", name: "Tennessee" },
  { code: "IN", name: "Indiana" },
  { code: "MO", name: "Missouri" },
  { code: "MD", name: "Maryland" },
  { code: "WI", name: "Wisconsin" },
  { code: "CO", name: "Colorado" },
  { code: "MN", name: "Minnesota" },
  { code: "SC", name: "South Carolina" },
  { code: "AL", name: "Alabama" },
  { code: "LA", name: "Louisiana" },
  { code: "KY", name: "Kentucky" },
  { code: "OR", name: "Oregon" },
  { code: "OK", name: "Oklahoma" },
  { code: "CT", name: "Connecticut" },
  { code: "UT", name: "Utah" },
  { code: "IA", name: "Iowa" },
  { code: "NV", name: "Nevada" },
  { code: "AR", name: "Arkansas" },
  { code: "MS", name: "Mississippi" },
  { code: "KS", name: "Kansas" },
  { code: "NM", name: "New Mexico" },
  { code: "NE", name: "Nebraska" },
  { code: "WV", name: "West Virginia" },
  { code: "ID", name: "Idaho" },
  { code: "HI", name: "Hawaii" },
  { code: "NH", name: "New Hampshire" },
  { code: "ME", name: "Maine" },
  { code: "MT", name: "Montana" },
  { code: "RI", name: "Rhode Island" },
  { code: "DE", name: "Delaware" },
  { code: "SD", name: "South Dakota" },
  { code: "ND", name: "North Dakota" },
  { code: "AK", name: "Alaska" },
  { code: "VT", name: "Vermont" },
  { code: "WY", name: "Wyoming" },
];

export default function StateSelector({
  selectedState,
  onStateChange,
  isLoading,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStateSelect = (stateCode) => {
    onStateChange(stateCode);
    setIsOpen(false);
  };

  const selectedStateName =
    US_STATES.find((state) => state.code === selectedState)?.name ||
    "Select State";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`w-full min-w-[200px] px-4 py-3 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-900 dark:text-white font-medium">
            🌎 {selectedStateName}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search states..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                const filtered = US_STATES.filter(
                  (state) =>
                    state.name.toLowerCase().includes(value) ||
                    state.code.toLowerCase().includes(value)
                );
                // Filter logic can be added here if needed
              }}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {US_STATES.map((state) => (
              <button
                key={state.code}
                onClick={() => handleStateSelect(state.code)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  selectedState === state.code
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{state.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {state.code}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
