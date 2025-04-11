"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ImageCarousel from "../../components/ImageCarousel";

export default function ListingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { currentUser } = useAuth();

  useEffect(() => {
    if (id) {
      async function fetchListing() {
        try {
          const res = await fetch(`/api/listings/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch listing");
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerEmail: listing.userEmail,
          ownerDisplayName: listing.userDisplayName,
          interestedUserEmail: currentUser.email,
          interestedUserDisplayName: currentUser.displayName,
          topic: listing.title,
          firstMessage: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start conversation");
      }

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: listing.userEmail,
          subject: `Someone is interested in ${listing.title}!`,
          text:
`Hi ${listing.userDisplayName},

${currentUser.displayName} is interested in "${listing.title}" and sent you a message: 
          
Message: ${message}


—
Handoff Team
https://handoff.shop
You received this email because someone contacted you via your listing.
`
        }),
      })

      router.push(`/chat`);
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("Could not start a conversation with the owner.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!listing) {
    return <p>Loading...</p>;
  }

  const isOwner = currentUser?.email === listing.userEmail;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Image Carousel */}
      <ImageCarousel imgUrls={listing.imgUrls} />

      <div className="mt-6">
        <h1 className="text-3xl font-bold">{listing.title}</h1>

        {/* ✅ Display Owner's Name */}
        <p className="text-lg text-gray-500 mt-2">
          Listed by: {listing.userDisplayName || "Unknown Seller"}
        </p>

        <p className="text-2xl font-medium text-blue-500 mt-3">
          {listing.resolved ? "SOLD" : `$${listing.price}`}
        </p>
        
        <p className="text-lg text-gray-500 mt-4">
          {listing.resolved
            ? "This item has been marked as SOLD by the owner"
            : listing.description}
        </p>
      </div>

      {/* Button Section */}
      <div className="mt-8 flex justify-center">
        {isOwner ? (
          <button
            onClick={() => router.push(`/listings/edit/${id}`)}
            className="bg-blue-500 text-white py-3 w-full text-lg rounded hover:bg-blue-600"
          >
            Edit Listing
          </button>
        ) : (
          !listing.resolved && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-500 text-white py-3 w-full text-lg rounded hover:bg-purple-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Messaging..." : "Message Owner"}
            </button>
          )
        )}
      </div>

      {/* Message Modal */}
      {isModalOpen && !isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Send a Message</h2>
            <textarea
              className="w-full p-3 border rounded mb-4"
              rows="4"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:bg-gray-400"
                disabled={loading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}