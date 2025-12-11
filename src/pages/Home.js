import React, { useState, useEffect } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import { useNavigate } from "react-router-dom";
// import Lottie from "lottie-react";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await API.get("/leads");
      setLeads(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const scrapeNow = async () => {
    if (!keyword || !location) {
      alert("Please enter keyword and location");
      return;
    }

    setLoading(true);
    try {
      await API.post("/leads/scrape", { keyword, location });
      await fetchLeads();
    } catch (err) {
      console.error(err);
      alert("Scraping failed");
    }
    setLoading(false);
  };

  // ScrapeInstaNow function has been REMOVED.

  const exportCSV = () => {
    window.open(`${API.defaults.baseURL}/leads/export`, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9FBF9" }}>
      {/* NAV BAR */}
      <nav
        className="px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: "#1ABC9C" }}
      >
        <h1 className="text-2xl font-bold text-white">LeadGen Pro</h1>

        <div className="flex gap-3">
          {/* InstaLeads Button WITH ICON */}
          <button
            onClick={() => navigate("/instaleads")}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#1ABC9C] px-3 py-2 rounded-lg text-sm font-semibold transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="6"
                stroke="#E1306C"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="5" stroke="#E1306C" strokeWidth="2" />
              <circle cx="17" cy="7" r="1.5" fill="#E1306C" />
            </svg>
            InstaLeads
          </button>

          {/* All Leads Button WITH GOOGLE ICON */}
          <button
            onClick={() => navigate("/all-leads")}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#1ABC9C] px-3 py-2 rounded-lg text-sm font-semibold transition"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.42 2.56 13.26l7.98 6.19C12.53 13.07 17.78 9.5 24 9.5z"
              />
              <path
                fill="#FBBC05"
                d="M46.5 24c0-1.67-.15-3.29-.44-4.85H24v9.19h12.65c-.55 2.97-2.23 5.5-4.73 7.17l7.34 5.7C43.46 37.09 46.5 31 46.5 24z"
              />
              <path
                fill="#34A853"
                d="M10.53 28.07A14.43 14.43 0 019.5 24c0-1.41.22-2.77.61-4.07l-7.55-6C.85 17.73 0 20.78 0 24c0 3.17.84 6.21 2.56 9l7.97-6.19z"
              />
              <path
                fill="#4285F4"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.34-5.7c-2.02 1.35-4.63 2.15-8.55 2.15-6.22 0-11.47-3.57-13.47-8.95l-7.98 6.19C6.51 42.58 14.62 48 24 48z"
              />
            </svg>
            All Leads
          </button>

          <button
            onClick={exportCSV}
            className="bg-white hover:bg-gray-100 text-[#1ABC9C] px-3 py-2 rounded-lg text-sm font-semibold transition"
          >
            Export CSV
          </button>
        </div>
      </nav>

      {/* CONTENT (Rest of Home.jsx content remains the same) */}
      <div className="p-8">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Scrape Leads
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Keyword (e.g., tuition centre)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />

            <input
              placeholder="Location (e.g., Anna Nagar)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />

            <button
              onClick={scrapeNow}
              disabled={loading}
              className={`${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-2 rounded-lg font-semibold transition`}
            >
              {loading ? "Scraping..." : "Scrape"}
            </button>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
            {/* SVG Illustration */}
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" fill="#E8FFF4" />
              <rect
                x="45"
                y="70"
                width="110"
                height="70"
                rx="12"
                fill="#C9F3E2"
              />
              <path
                d="M60 85 H140"
                stroke="#1ABC9C"
                strokeWidth="6"
                strokeLinecap="round"
                opacity=".8"
              />
              <circle cx="75" cy="115" r="8" fill="#1ABC9C" />
              <circle cx="100" cy="115" r="8" fill="#1ABC9C" />
              <circle cx="125" cy="115" r="8" fill="#1ABC9C" />
              <path
                d="M70 140 Q100 160 130 140"
                stroke="#1ABC9C"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No leads found yet
            </h2>
            <p className="text-gray-600">Start scraping to see results.</p>
          </div>
        ) : (
          <div className="mt-8">
            <LeadTable leads={leads} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
