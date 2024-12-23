"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  if (!currentUser) {
    router.push("/signup");
    return <p>Redirecting to signup...</p>;
  }

  // If logged in, render the protected content
  return <>{children}</>
}