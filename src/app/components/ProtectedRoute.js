"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/signup");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <p>Redirecting to signup...</p>;
  }

  if (!currentUser.emailVerified) {
    return <>Please verify your email at {currentUser.email}</>;
  }

  // If logged in and verified, render the protected content
  return <>{children}</>;
}