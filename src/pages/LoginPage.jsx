import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* --------------------------------------------------
     Handle Login
  -------------------------------------------------- */
  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      // ✅ Save auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // ✅ Navigate once
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    // IMPROVEMENT: Removed min-h-screen to allow content to naturally expand on small screens
    <div className="w-full flex flex-col lg:flex-row">
      
      {/* ---------------- LEFT SIDE (Branded Section) ---------------- */}
      <div 
        // IMPROVEMENT: Use p-6/p-8 for more flexible padding, ensuring text remains centered vertically on large screens.
        className="lg:flex-1 bg-gradient-to-br from-green-500 to-teal-400 text-white p-8 lg:px-20 lg:py-20 flex flex-col justify-center"
      >
        <h1 
          // IMPROVEMENT: Stronger drop-shadow for better legibility on mobile
          className="text-4xl lg:text-6xl font-extrabold leading-tight drop-shadow-2xl"
        >
          IQSync
          <br />
          Lead Automation
        </h1>

        <p className="mt-4 text-base md:text-lg text-white/90 max-w-md">
          Automate scraping, website creation, WhatsApp follow-ups, and lead
          management — all in one dashboard.
        </p>
        
        {/* Hidden on small screens to save vertical space */}
        <div className="hidden lg:block mt-14 space-y-6 max-w-md">
          <div className="flex items-center gap-3 text-lg">
            <span className="text-3xl">⚡</span> Instant Lead Scraping
          </div>
          <div className="flex items-center gap-3 text-lg">
            <span className="text-3xl">🤖</span> AI Website Writer
          </div>
          <div className="flex items-center gap-3 text-lg">
            <span className="text-3xl">📞</span> WhatsApp Tracking
          </div>
        </div>

        <div className="mt-8 lg:mt-16 text-xl lg:text-2xl font-bold">IQSync</div>
      </div>

      {/* ---------------- RIGHT SIDE (Login Form) ---------------- */}
      <div 
        // IMPROVEMENT: Added min-h-[50vh] on small screens to ensure the form area is large enough, and `min-h-screen` only on large screens.
        className="flex-1 bg-gray-50 flex items-center justify-center p-6 md:p-10 min-h-[50vh] lg:min-h-screen"
      >
        <form
          onSubmit={handleLogin}
          // IMPROVEMENT: Reduced padding on mobile (p-6) for tighter fit
          className="bg-white w-full max-w-sm md:max-w-md shadow-2xl rounded-2xl p-6 md:px-10 md:py-12 border border-gray-200"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mt-2 text-sm md:text-base">
            Login to manage your IQSync dashboard
          </p>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mt-8">
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // IMPROVEMENT: Added border-gray-300 for clearer definition
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="admin@iqsync.in"
            />
          </div>

          {/* Password */}
          <div className="mt-6">
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // IMPROVEMENT: Added border-gray-300 for clearer definition
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500 transition duration-150"
              placeholder="Enter password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            // IMPROVEMENT: Reduced shadow size for flatter look, used a more controlled hover state
            className={`w-full mt-8 py-3 rounded-xl font-semibold shadow-md transition duration-150 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          <div className="mt-4 text-center text-xs text-gray-500">
              Need assistance? Contact support.
          </div>
        </form>
      </div>
    </div>
  );
}