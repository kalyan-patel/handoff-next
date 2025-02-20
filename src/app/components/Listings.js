"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings/");
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
  }, []);

  if (loading) {
    return <p className="text-center text-lg font-semibold">Loading listings...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;
  }

  return (
    <div className="mx-auto px-4 py-8 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:px-14">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className={`relative border rounded-lg shadow-sm overflow-hidden bg-white transition-all duration-300 ${
              listing.resolved ? "" : "cursor-pointer hover:shadow-md hover:-translate-y-1 group"
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
        ))}
      </div>
    </div>
  );
};

export default Listings;