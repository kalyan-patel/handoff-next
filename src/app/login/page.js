"use client";

import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      router.push("/");
    } catch {
      setError("Failed to sign in.");
    }

    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center h-[calc(100dvh-7rem)] p-3">
      <div className="w-full max-w-md bg-white shadow-md border rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">Log In</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 text-md">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Tufts Email
            </label>
            <input
              id="email"
              type="email"
              ref={emailRef}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="text-center mt-4 text-gray-600">
          Need an account? <Link href="/signup" className="text-blue-500 font-medium hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
