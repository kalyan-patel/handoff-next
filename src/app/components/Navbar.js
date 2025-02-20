"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiInbox, FiPlusSquare, FiUser } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 767px)").matches);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <nav className="sticky top-0 w-full h-28 bg-white shadow-sm flex items-center justify-between px-4 z-50">
      {/* Logo */}
      <button
        onClick={() => router.push("/")}
        className={`font-bold text-blue-500 focus:outline-none flex items-center gap-2 ${
          isMobile ? "text-3xl ml-4" : "text-3xl md:ml-10 lg:ml-20"
        }`}
      >
        {!isMobile && <FaHandshake className="w-14 h-14 mt-1 ml-2 mr-1 text-blue-500" />}
        {isMobile ? "Handoff" : " Tufts Handoff"}
      </button>

      {/* Action Buttons */}
      <div className={`flex items-center ${isMobile ? "space-x-3" : "space-x-6 md:space-x-8 md:mr-12"}`}>
        {/* Messages Button */}
        <button
          onClick={() => router.push("/chat")}
          className={`focus:outline-none ${isMobile ? "p-2 bg-blue-400 rounded-full hover:bg-blue-500" : "text-gray-500 text-lg opacity-90 hover:text-blue-600"}`}
          aria-label="Messages"
        >
          {isMobile ? <FiInbox className="w-6 h-6 text-white" /> : "Your Messages"}
        </button>

        {/* Create Listing Button */}
        <button
          onClick={() => router.push("/listings/newlisting")}
          className={`focus:outline-none ${isMobile ? "p-2 bg-blue-400 rounded-full hover:bg-blue-500 text-white" : "text-gray-500 text-lg opacity-90 hover:text-blue-600"}`}
          aria-label="Create New Listing"
        >
          {isMobile ? <FiPlusSquare className="w-6 h-6" /> : "Add a Listing"}
        </button>

        {/* Profile Section */}
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none flex items-center"
            >
              <span className="mr-2 hidden md:block">{currentUser.displayName || "Anonymous"}</span>
              <FiUser className="w-5 h-5" />
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