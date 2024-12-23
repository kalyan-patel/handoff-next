"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav style={{ padding: "1rem", backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
      <p>
        {currentUser
          ? `Logged in as: ${currentUser.displayName || "Anonymous"}`
          : "Guest"}
      
        {/* Conditionally render the logout button */}
        {currentUser && (
          <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Logout
          </button>
      )}
      </p>
    </nav>
  );
}