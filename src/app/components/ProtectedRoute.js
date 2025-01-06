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
    return <>Please click the verification link sent to {currentUser.email}. If you have already verified, you may need to refresh the page.</>;
  }

  // If logged in and verified, render the protected content
  return <>{children}</>;
}