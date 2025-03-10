"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Listings = ({ userEmail }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Stores the user input
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Stores the debounced search term

  const router = useRouter();

  // Debounce effect - Updates `debouncedSearch` after user stops typing for 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch listings based on userEmail and debouncedSearch
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);

        let url = "/api/listings/";
        const queryParams = new URLSearchParams();

        if (userEmail) queryParams.append("user", userEmail);
        if (debouncedSearch) queryParams.append("title", debouncedSearch);

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userEmail, debouncedSearch]);

  return (
    <div className="mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg text-gray-900 text-indent-2"
        />
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:px-14">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-60">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
              <p className="mt-4 text-gray-600 text-lg font-semibold">Loading listings...</p>
            </div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold col-span-full">Error: {error}</p>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-500 font-semibold col-span-full">No listings found</p>
        ) : (
          listings.map((listing) => (
            <div
              key={listing._id}
              className={`relative border rounded-lg shadow-sm overflow-hidden bg-white transition-all duration-300 ${
                listing.resolved ? "" : "cursor-pointer hover:shadow-md hover:-translate-y-1.5 group"
              }`}
              onClick={() => {
                if (!listing.resolved) {
                  router.push(`/listings/${listing._id}`);
                }
              }}
            >
              {/* Image Section */}
              <div className="relative overflow-hidden h-40">
                <img
                  src={listing.thumbnailUrl || "/images/fallback-image.jpg"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.resolved && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    SOLD
                  </div>
                )}
              </div>

              {/* Listing Details - Compact Design */}
              <div className="p-3">
                <h2 className="text-lg mb-1 font-semibold text-gray-900 truncate">{listing.title}</h2>
                <p className="text-xs mb-1.5 text-gray-500">{listing.userDisplayName || "Unknown Seller"}</p>
                <p className="text-sm mb-2 font-semibold">${listing.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Listings;
