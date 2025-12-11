import React, { useState, useEffect } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import { useNavigate } from "react-router-dom";

function InstaLeads() {
  const [hashtag, setHashtag] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrapeInProgress, setScrapeInProgress] = useState(false); // New state for scraping

  const navigate = useNavigate();

  useEffect(() => {
    fetchInstaLeads();
  }, []);

  const fetchInstaLeads = async () => {
    try {
      setLoading(true);
      // Calls the GET API endpoint we defined: /api/instagram/leads
      const response = await API.get("/instagram/leads"); 
      setLeads(response.data.data);
    } catch (err) {
      console.error("Error fetching Instagram leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrapeNow = async () => {
    if (!hashtag) {
      alert("Please enter a hashtag (e.g., chennaishoes) to start scraping.");
      return;
    }

    setScrapeInProgress(true);
    setLoading(true);

    try {
      // Calls the POST API endpoint: /api/instagram/scrape/:tag
      await API.post(`/instagram/scrape/${hashtag}`); 
      
      // After scraping, fetch the updated list
      await fetchInstaLeads(); 
      alert(`Scraping for #${hashtag} completed and results are loaded.`);
    } catch (err) {
      console.error(err);
      alert("Instagram scraping failed. See console for details.");
    } finally {
      setScrapeInProgress(false);
      setLoading(false);
    }
  };

  const exportCSV = () => {
    // NOTE: You'll need to create a dedicated backend route for exporting Instagram leads, e.g., /instagram/leads/export
    window.open(`${API.defaults.baseURL}/instagram/leads/export`, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9FBF9" }}>
      
      {/* NAV BAR */}
      <nav
        className="px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: "#1ABC9C" }}
      >
        <h1 className="text-2xl font-bold text-white">InstaLeads Dashboard</h1>

        <div className="flex gap-3">
            {/* Back to Home Button */}
            <button
                onClick={() => navigate("/")}
                className="bg-white hover:bg-gray-100 text-[#1ABC9C] px-3 py-2 rounded-lg text-sm font-semibold transition"
            >
                Home
            </button>

            {/* Refresh Button */}
            <button
                onClick={fetchInstaLeads}
                disabled={loading}
                className={`bg-white hover:bg-gray-100 text-[#1ABC9C] px-3 py-2 rounded-lg text-sm font-semibold transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Loading...' : 'Refresh'}
            </button>

            <button
                onClick={exportCSV}
                className="bg-white hover:bg-gray-100 text-[#1ABC9C] px-3 py-2 rounded-lg text-sm font-semibold transition"
            >
                Export CSV
            </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="p-8">
        <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Scrape Instagram by Hashtag</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Enter hashtag or query (e.g., chennaishoes)"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-teal-300"
            />

            <button
              onClick={scrapeNow}
              disabled={scrapeInProgress}
              className={`${
                scrapeInProgress ? "bg-teal-400" : "bg-teal-600 hover:bg-teal-700"
              } text-white px-6 py-2 rounded-lg font-semibold transition`}
            >
              {scrapeInProgress ? "Scraping In Progress..." : "Start Scrape"}
            </button>
          </div>
        </div>

        {/* Lead Table / Empty State */}
        {loading ? (
            <div className="text-center py-10 text-gray-600">Loading leads...</div>
        ) : leads.length === 0 ? (
            <div className="text-center py-10 text-gray-600">No Instagram leads found yet. Start a new scrape!</div>
        ) : (
            <div className="mt-8">
                <LeadTable leads={leads} />
            </div>
        )}
      </div>
    </div>
  );
}

export default InstaLeads;