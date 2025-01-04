"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiInbox, FiPlus } from "react-icons/fi"; // Importing icons

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 767px)').matches);

  useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.matchMedia('(max-width: 767px)').matches);
      };
    
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="sticky top-0 w-full h-24 bg-gray-100 border-b border-gray-300 shadow-sm flex items-center justify-between px-4 z-50">
      {/* Logo */}
      <button
        onClick={() => router.push("/")}
        className={`text-3xl font-bold text-blue-500 focus:outline-none ${isMobile ? "ml-2" : "md:ml-10 lg:ml-20"}`}
      >
        {(isMobile ? "" : "Tufts ") + "Handoff"}
      </button>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Messages Button */}
        <button
          onClick={() => router.push("/chat")}
          className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
          aria-label="Messages"
        >
          <FiInbox className="w-6 h-6 text-white" />
        </button>

        {/* Create Listing Button */}
        <button
          onClick={() => router.push("/listings/newlisting")}
          className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 text-white focus:outline-none"
          aria-label="Create New Listing"
        >
          <FiPlus className="w-6 h-6" />
        </button>

        {/* Profile Section */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none flex items-center"
            >
              <span className="mr-2 hidden md:block">{currentUser.displayName || "Anonymous"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06-.02L10 10.586l3.71-3.4a.75.75 0 111.02 1.1l-4 3.75a.75.75 0 01-1.04 0l-4-3.75a.75.75 0 01-.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                <button
                  onClick={() => router.push("/listings/mylistings")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Listings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            {"Login" + (isMobile ? "" : "/Signup")}
          </button>
        )}
      </div>
    </nav>
  );
}