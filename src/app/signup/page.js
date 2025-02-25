"use client";

import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, sendEmailVerification } from "firebase/auth";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!emailRef.current.value.endsWith("@tufts.edu")) {
      return setError("You must use a Tufts email address");
    }

    if (nameRef.current.value.length > 12) {
      return setError("Name must be 12 characters or less");
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const userCredential = await signup(
        emailRef.current.value,
        passwordRef.current.value,
        nameRef.current.value
      );

      const auth = getAuth();
      await sendEmailVerification(auth.currentUser);

      setSuccess("Sign-up successful! Check your email for a verification link.");
    } catch (error) {
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100dvh-7rem)] p-3">
      <div className="w-full max-w-md bg-white shadow-md border rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">Sign Up</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 text-md">
          <div>
            <label className="block text-gray-700 font-medium">First Name / Username</label>
            <input
              type="text"
              ref={nameRef}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Tufts Email</label>
            <input
              type="email"
              ref={emailRef}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              ref={passwordRef}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <input
              type="password"
              ref={passwordConfirmRef}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-4 text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-500 font-medium hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
