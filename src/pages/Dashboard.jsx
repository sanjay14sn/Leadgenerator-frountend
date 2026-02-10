import React, { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";

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
const MetricCard = ({ title, value, icon }) => (
  <div className="p-5 rounded-xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-lg text-[#1ABC9C]">{icon}</div>
    </div>
    <div className="text-sm mt-3 font-medium text-gray-500">{title}</div>
  </div>
);

/* ================== HOME PAGE ================== */
export default function Home() {
  const [leads, setLeads] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [locationText, setLocationText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------ LOAD LEADS ------------------ */
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

  /* ------------------ SCRAPE ------------------ */
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
    } catch (error) {
      console.error("Scraping failed:", error);
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
      interested: leads.filter(
        (l) => l.followup?.status === "INTERESTED"
      ).length,
      followups: leads.filter(
        (l) =>
          l.followup?.last_whatsapp_sent &&
          l.followup?.status === "PENDING"
      ).length,
    }),
    [leads]
  );

  const todayLeads = useMemo(
    () => leads.filter((l) => isToday(l.createdAt)),
    [leads]
  );

  /* ================== RENDER ================== */
  return (
    <>
      {/* KPI CARDS */}
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
            className="flex-1 border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#1ABC9C]"
            placeholder="Keyword (e.g., HVAC, Dentist)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <input
            className="flex-1 border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#1ABC9C]"
            placeholder="Location (e.g., London, UK)"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
          />

          <button
            onClick={scrapeNow}
            disabled={loading}
            className="bg-[#1ABC9C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
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
    </>
  );
}