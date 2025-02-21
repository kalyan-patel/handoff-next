"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaHandshake } from "react-icons/fa";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleNavigation = (path) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 w-full h-28 bg-white shadow-sm flex items-center justify-between px-4 z-50">
      {/* Logo */}
      <button
        onClick={() => handleNavigation("/")}
        className="font-bold text-blue-400 text-3xl flex items-center gap-2 ml-4 md:ml-10 lg:ml-20"
      >
        <FaHandshake className="w-14 h-14 mt-1 text-blue-400" />
        Tufts Handoff
      </button>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-gray-400 focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <FaBars className="w-8 h-8" />
      </button>

      {/* Full-Screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out">
          <button onClick={() => setMobileMenuOpen(false)} className="absolute top-5 right-5 text-2xl text-gray-500">✕</button>
          <button onClick={() => handleNavigation("/chat")} className="py-4 text-xl w-full text-center text-gray-500 hover:bg-gray-100">Your Messages</button>
          <button onClick={() => handleNavigation("/listings/newlisting")} className="py-4 text-xl w-full text-center text-gray-500 hover:bg-gray-100">Add a Listing</button>
          {currentUser ? (
            <>
              <button
                onClick={() => handleNavigation("/listings/mylistings")}
                className="py-4 text-xl w-full text-center text-gray-500 hover:bg-gray-100"
              >
                My Listings
              </button>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="py-4 text-xl w-full text-center text-red-500 hover:bg-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => handleNavigation("/login")} className="py-4 text-xl w-full text-center text-gray-500 hover:bg-gray-100">Login/Signup</button>
          )}
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 md:mr-12 lg:mr-20">
        <button onClick={() => handleNavigation("/chat")} className="text-gray-600 text-lg hover:text-indigo-700">Your Messages</button>
        <button onClick={() => handleNavigation("/listings/newlisting")} className="text-gray-600 text-lg hover:text-indigo-700">Add a Listing</button>
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              {currentUser.displayName || "Anonymous"}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                <button
                  onClick={() => handleNavigation("/listings/mylistings")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  My Listings
                </button>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => handleNavigation("/login")}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Login/Signup
          </button>
        )}
      </div>
    </nav>
  );
}