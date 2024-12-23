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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => router.push(`/listings/${listing._id}`)}
          >
            {/* Check if the image path exists and render a fallback image */}
            <img
              src={listing.thumbnailUrl || "/images/fallback-image.jpg"}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{listing.title}</h2>
              <p className="text-lg text-gray-700">${listing.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;