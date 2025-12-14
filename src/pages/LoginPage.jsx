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
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* ---------------- LEFT SIDE ---------------- */}
      <div className="flex-1 bg-gradient-to-br from-green-500 to-teal-400 text-white px-10 lg:px-20 py-20 flex flex-col justify-center">
        <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl">
          IQSync
          <br />
          Lead Automation
        </h1>

        <p className="mt-6 text-lg text-white/90 max-w-md">
          Automate scraping, website creation, WhatsApp follow-ups, and lead
          management — all in one dashboard.
        </p>

        <div className="mt-14 space-y-6 max-w-md">
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

        <div className="mt-16 text-2xl font-bold">IQSync</div>
      </div>

      {/* ---------------- RIGHT SIDE ---------------- */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-10">
        <form
          onSubmit={handleLogin}
          className="bg-white w-full max-w-md shadow-xl rounded-2xl px-10 py-12 border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Login to manage your IQSync dashboard
          </p>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mt-8">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="admin@iqsync.in"
            />
          </div>

          {/* Password */}
          <div className="mt-6">
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`w-full mt-8 py-3 rounded-xl font-semibold shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
