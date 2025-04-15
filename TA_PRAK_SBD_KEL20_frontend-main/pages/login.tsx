/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../lib/axios";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      router.push("/mobil"); // Redirect to /mobil after successful login
    } catch (error: any) {
      console.error("Error during login:", error);

      // Detailed error logging
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
        // Check if the response is not JSON (e.g., HTML error page)
        if (typeof error.response.data !== "object") {
          setErrorMessage(
            "Server returned an invalid response. Please try again later."
          );
        } else {
          setErrorMessage(error.response.data.message || "Login failed");
        }
      } else if (error.request) {
        console.log("Request made but no response received:", error.request);
        setErrorMessage(
          "No response from server. Please check if the server is running."
        );
      } else {
        console.log("Error setting up the request:", error.message);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-black text-2xl font-bold mb-6 text-center">
          Login
        </h1>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-black w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded-md text-white ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-black mt-4 text-center">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
