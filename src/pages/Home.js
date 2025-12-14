import React, { useState, useEffect, useMemo } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import { useNavigate } from "react-router-dom";

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

/* ------------------ METRIC CARD ------------------ */
const MetricCard = ({ title, value, icon, gradient }) => (
  <div className={`p-6 rounded-xl shadow text-white ${gradient}`}>
    <div className="flex justify-between items-center">
      <div>
        <div className="text-4xl font-extrabold">{value}</div>
        <div className="text-sm opacity-90 mt-1">{title}</div>
      </div>
      <img src={icon} alt={title} className="w-12 h-12 opacity-90" />
    </div>
  </div>
);

/* ------------------ NAV BUTTON ------------------ */
const NavButton = ({ icon, label, onClick, badge }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition"
  >
    <img src={icon} alt={label} className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
    {badge && (
      <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

/* ================== MAIN ================== */
export default function Home() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    const res = await API.get("/leads");
    setLeads(res.data);
  }

  async function scrapeNow() {
    if (!keyword || !location) return alert("Enter keyword & location");
    setLoading(true);
    await API.post("/leads/scrape", { keyword, location });
    await loadLeads();
    setLoading(false);
  }

  /* ------------------ METRICS ------------------ */
  const metrics = useMemo(() => ({
    total: leads.length,
    today: leads.filter(l => isToday(l.createdAt)).length,
    interested: leads.filter(l => l.followup?.status === "INTERESTED").length,
  }), [leads]);

  const todayLeads = useMemo(
    () => leads.filter(l => isToday(l.createdAt)),
    [leads]
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ------------------ APP BAR ------------------ */}
      <header className="sticky top-0 z-50 bg-[#1ABC9C] shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">IQSync Dashboard</h1>

          <div className="flex items-center gap-2">
            <NavButton
              icon="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
              label="Insta Leads"
              badge="BETA"
              onClick={() => navigate("/instaleads")}
            />
            <NavButton
              icon="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
              label="All Leads"
              onClick={() => navigate("/all-leads")}
            />
            <NavButton
              icon="https://cdn-icons-png.flaticon.com/512/942/942748.png"
              label="Follow-Ups"
              onClick={() => navigate("/followups")}
            />
            <NavButton
              icon="https://cdn-icons-png.flaticon.com/512/4149/4149643.png"
              label="Cloudflare"
              onClick={() => navigate("/cloudflare")}
            />

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="ml-4 bg-white text-[#1ABC9C] px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ------------------ CONTENT ------------------ */}
      <div className="p-8 max-w-7xl mx-auto">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Today Leads"
            value={metrics.today}
            icon="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
            gradient="bg-gradient-to-r from-teal-500 to-emerald-500"
          />
          <MetricCard
            title="Total Leads"
            value={metrics.total}
            icon="https://static.thenounproject.com/png/1800023-200.png"
            gradient="bg-gradient-to-r from-blue-500 to-sky-500"
          />
          <MetricCard
            title="Interested Leads"
            value={metrics.interested}
            icon="https://cdn-icons-png.flaticon.com/512/190/190411.png"
            gradient="bg-gradient-to-r from-orange-500 to-amber-500"
          />
        </div>

        {/* SCRAPER */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-lg font-semibold mb-4">Quick Lead Scraper</h2>
          <div className="flex gap-4">
            <input
              className="flex-1 border p-3 rounded-lg"
              placeholder="Keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              className="flex-1 border p-3 rounded-lg"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              onClick={scrapeNow}
              disabled={loading}
              className="bg-[#1ABC9C] text-white px-6 rounded-lg font-semibold"
            >
              {loading ? "Scraping…" : "Scrape"}
            </button>
          </div>
        </div>

        {/* TODAY LEADS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Today’s Leads
            </h2>
            <span className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
              {todayLeads.length} New
            </span>
          </div>

          <LeadTable leads={todayLeads} />
        </div>
      </div>
    </div>
  );
}
