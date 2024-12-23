"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ImageCarousel from '../../components/ImageCarousel'; 

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchListing() {
        try {
          const res = await fetch(`/api/listings/${id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch listing');
          }
          const data = await res.json();
          setListing(data);
        } catch (err) {
          setError(err.message);
        }
      }
      fetchListing();
    }
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!listing) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Image Carousel */}
      <ImageCarousel imgUrls={listing.imgUrls} />

      <div className="mt-6">
        <h1 className="text-3xl font-bold">{listing.title}</h1>
        <p className="text-xl text-gray-700 mt-2">${listing.price}</p>
        <p className="text-lg text-gray-500 mt-4">{listing.description}</p>
      </div>
    </div>
  );
}
