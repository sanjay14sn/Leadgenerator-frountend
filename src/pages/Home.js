// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import { useNavigate, useLocation } from "react-router-dom";

/* ------------------ HELPERS ------------------ */
const isToday = (dateString) => {
  const d = new Date(dateString);
  const t = new Date();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
};

// Function to determine current page title
const getCurrentTitle = (pathname) => {
  if (pathname === "/") return "Dashboard Overview";
  if (pathname === "/all-leads") return "All Leads Database";
  if (pathname === "/followups") return "Assigned Leads (Follow-Up)";
  if (pathname === "/instaleads") return "Insta Leads (BETA)";
  if (pathname === "/cloudflare") return "Cloudflare Management";
  return "IQSync Dashboard";
};

/* ------------------ METRIC CARD ------------------ */
const MetricCard = ({ title, value, icon }) => (
  <div
    className={`p-5 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition duration-150`}
  >
    <div className="flex justify-between items-start">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-lg text-[#1ABC9C]">{icon}</div>
    </div>
    <div className={`text-sm mt-3 font-medium text-gray-500`}>{title}</div>
  </div>
);

/* ------------------ HORIZONTAL NAV ITEM ------------------ */
const HorizontalNavItem = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`relative px-6 py-3 text-sm font-semibold transition duration-200
      ${
        active
          ? "text-[#1ABC9C] border-b-2 border-[#1ABC9C]"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
  >
    {label}
  </button>
);

/* ================== MAIN ================== */
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [leads, setLeads] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [locationText, setLocationText] = useState("");
  const [loading, setLoading] = useState(false);
  // NEW STATE for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (error) {
      console.error("Failed to load leads:", error);
    }
  }

  async function scrapeNow() {
    if (!keyword || !locationText) {
      alert("Enter keyword & location");
      return;
    }
    setLoading(true);
    try {
      await API.post("/leads/scrape", {
        keyword,
        location: locationText,
      });
      await loadLeads();
    } catch (err) {
      console.error("Scrape failed:", err);
      alert("Scraping failed");
    } finally {
      setLoading(false);
    }
  }

  /* ------------------ METRICS ------------------ */
  const metrics = useMemo(
    () => ({
      total: leads.length,
      today: leads.filter((l) => isToday(l.createdAt)).length,
      interested: leads.filter((l) => l.followup?.status === "INTERESTED")
        .length,
      followups: leads.filter(
        (l) =>
          l.followup?.last_whatsapp_sent && l.followup?.status === "PENDING"
      ).length,
    }),
    [leads]
  );

  const todayLeads = useMemo(
    () => leads.filter((l) => isToday(l.createdAt)),
    [leads]
  );

  const topBarHeight = "64px";
  const secondaryNavHeight = "56px";

  const currentTitle = getCurrentTitle(location.pathname);

  const mainContentClass =
    location.pathname === "/"
      ? "p-8 bg-gradient-to-br from-gray-50 to-teal-50"
      : "p-8 bg-gray-50";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================== FIXED PRIMARY HEADER (TOP BAR) - BRANDED & MOBILE ================== */}
      <header
        // Changed bg-white to bg-[#1ABC9C] (theme color)
        className="fixed top-0 left-0 right-0 h-16 bg-[#1ABC9C] shadow-md flex items-center justify-between px-4 md:px-8 z-30"
        style={{ height: topBarHeight }}
      >
        <div className="flex items-center gap-4 md:gap-6">
          {/* Mobile Menu Button (Visible on small screens) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white md:hidden"
            title="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* Branding/Logo */}
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wider">
            IQSync
          </h1>

          {/* Global Search - Hidden on small screens */}
          <input
            type="text"
            placeholder="Search leads..."
            className="hidden md:block w-96 p-2 border border-teal-200 rounded-lg text-sm bg-white text-gray-800 focus:ring-2 focus:ring-white focus:border-white transition placeholder-gray-500"
          />
        </div>

        {/* Global Actions (Right side) */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button
            className="relative p-2 text-white rounded-full hover:bg-teal-600 transition"
            title="Notifications"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.16 6 8.356 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>

          {/* User Profile/Logout */}
          <div className="flex items-center gap-2 border-l border-teal-600 pl-4">
            <div className="flex items-center gap-2">
              {/* Updated User Icon/Avatar color */}
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sm text-[#1ABC9C] font-bold shadow-md">
                AU
              </div>
              {/* Hidden on small screens */}
              <span className="hidden md:inline text-sm font-medium text-white">
                Admin User
              </span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              // Updated Logout button styling for theme color
              className="ml-2 px-3 py-1 text-sm font-medium text-white border border-white rounded-lg hover:bg-white hover:text-[#1ABC9C] transition"
              title="Sign Out"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================== FIXED SECONDARY NAVIGATION (TABS) ================== */}
      <nav
        // TABS: Use full width on desktop, but apply max-w-7xl for content alignment
        className="fixed top-16 left-0 right-0 border-b bg-white z-20 shadow-sm"
        style={{ height: secondaryNavHeight }}
      >
        <div className="max-w-7xl mx-auto flex gap-1 h-full overflow-x-auto">
          {/* Updated Tab Structure */}
          <HorizontalNavItem
            label="Home"
            active={location.pathname === "/"}
            onClick={() => navigate("/")}
          />
          <HorizontalNavItem
            label="All Leads"
            active={location.pathname === "/all-leads"}
            onClick={() => navigate("/all-leads")}
          />
          <HorizontalNavItem
            label="Assign Leads"
            active={location.pathname === "/followups"}
            onClick={() => navigate("/followups")}
          />
          <HorizontalNavItem
            label="Insta (BETA)"
            active={location.pathname === "/instaleads"}
            onClick={() => navigate("/instaleads")}
          />
          <HorizontalNavItem
            label="Cloudflare"
            active={location.pathname === "/cloudflare"}
            onClick={() => navigate("/cloudflare")}
          />
          <HorizontalNavItem
            label="AI Poster"
            active={location.pathname === "/aiposter"}
            onClick={() => navigate("/aiposter")}
          />
        </div>
      </nav>

      {/* MOBILE MENU (Conditional overlay for small screens) - Not fully implemented, just a placeholder */}
      {isMobileMenuOpen && (
        <div className="fixed top-[120px] left-0 right-0 bg-white shadow-xl z-20 md:hidden p-4 border-b">
          {/* You would typically use this space for the main navigation links,
                or hide the horizontal nav and show vertical links here. */}
          <p className="text-sm text-gray-600">
            Mobile Navigation placeholder...
          </p>
        </div>
      )}

      {/* ================== MAIN CONTENT AREA ================== */}
      <main
        className={`flex-1 min-h-screen ${mainContentClass}`}
        style={{ marginTop: `calc(${topBarHeight} + ${secondaryNavHeight})` }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Content Page Title & Context */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">
              IQSync / {currentTitle}
            </p>
            <h1 className="text-3xl font-bold text-gray-800">{currentTitle}</h1>
          </div>

          {/* KPI CARDS (Minimalist style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <MetricCard title="Today Leads" value={metrics.today} icon="☀️" />
            <MetricCard title="Total Leads" value={metrics.total} icon="🌐" />
            <MetricCard
              title="Interested Leads"
              value={metrics.interested}
              icon="⭐"
            />
            <MetricCard
              title="Pending Follow-Ups"
              value={metrics.followups}
              icon="🔔"
            />
          </div>

          {/* SCRAPER */}
          <div className="bg-white p-6 rounded-xl shadow mb-10 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Lead Scraper
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] bg-gray-50"
                placeholder="Keyword (e.g., HVAC, Dentist)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <input
                className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] bg-gray-50"
                placeholder="Location (e.g., London, UK)"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
              <button
                onClick={scrapeNow}
                disabled={loading}
                className="bg-[#1ABC9C] text-white px-6 py-3 sm:py-0 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
              >
                {loading ? "Scraping…" : "Scrape"}
              </button>
            </div>
          </div>

          {/* TODAY LEADS */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Today’s Leads
              </h2>
              <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
                {todayLeads.length} New
              </span>
            </div>
            <LeadTable leads={todayLeads} />
          </div>
        </div>
      </main>
    </div>
  );
}
