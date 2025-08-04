// Location services utilities
export const requestUserLocation = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser"));
    }
  });
};

// Helper function to format dates nicely
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Filter shows based on search term and active filter
export const filterShows = (shows, searchTerm, activeFilter, userLocation) => {
  return shows.filter((show) => {
    const matchesSearch =
      show.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.venue.toLowerCase().includes(searchTerm.toLowerCase());

    const currentDate = new Date();
    const showDate = new Date(show.date);

    if (activeFilter === "This Month") {
      const isThisMonth =
        showDate.getMonth() === currentDate.getMonth() &&
        showDate.getFullYear() === currentDate.getFullYear();
      return matchesSearch && isThisMonth;
    } else if (activeFilter === "Next Month") {
      const nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
      const isNextMonth =
        showDate.getMonth() === nextMonth.getMonth() &&
        showDate.getFullYear() === nextMonth.getFullYear();
      return matchesSearch && isNextMonth;
    } else if (activeFilter === "Near Me") {
      if (userLocation) {
        // If we have real location, show shows from nearby states (simplified logic)
        // In a real app, you'd calculate actual distances
        const nearbyStates = ["CA", "IL", "NY", "TX", "FL"]; // Popular states for demo
        const isNearby = nearbyStates.some((state) =>
          show.location.includes(state)
        );
        return matchesSearch && isNearby;
      } else {
        // Fallback: show some popular locations
        const popularStates = ["CA", "IL", "NY", "TX"];
        const isPopular = popularStates.some((state) =>
          show.location.includes(state)
        );
        return matchesSearch && isPopular;
      }
    }

    return matchesSearch; // "All Shows"
  });
};
