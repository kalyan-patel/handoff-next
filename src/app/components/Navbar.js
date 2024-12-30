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
    <nav
      style={{
        position: "sticky",
        top: "0",
        zIndex: "1000",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
      }}
    >
      <button onClick={() => router.push("/")}>
        <h2>HANDOFF</h2>
      </button>

      <p>
        {currentUser
          ? `Logged in as: ${currentUser.displayName || "Anonymous"}`
          : "Guest"}

        {currentUser && (
          <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Logout
          </button>
        )}
      </p>
    </nav>
  );
}