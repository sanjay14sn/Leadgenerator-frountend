import React, { useEffect, useState } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import { useNavigate } from "react-router-dom";

export default function AllLeadsPage() {
  const [allLeads, setAllLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [category, setCategory] = useState("");
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ------------------------------------
     LOAD ALL LEADS
  ------------------------------------ */
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await API.get("/leads");
      setAllLeads(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------
     APPLY FILTERS
  ------------------------------------ */
  const applyFilters = () => {
    let list = [...allLeads];

    if (category.trim()) {
      list = list.filter((l) =>
        l.category?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (score) {
      list = list.filter((l) => (l.lead_score || 0) >= Number(score));
    }

    if (date) {
      list = list.filter(
        (l) => l.createdAt?.slice(0, 10) === date
      );
    }

    setFiltered(list);
  };

  /* ------------------------------------
     FOLLOW-UP ENTRY POINT (🔥 CORE LOGIC)
  ------------------------------------ */
  async function goToFollowUp(leadId) {
    // ⚠️ DO NOT navigate here
    // LeadTable already does optimistic UI
    // We only mark backend state

    await API.post(`/leads/${leadId}/whatsapp-log`);

    // OPTIONAL: If you want auto-redirect uncomment below
    // navigate("/followup");
  }

  return (
    <div className="min-h-screen bg-[#F9FBF9]">

      {/* TOP BAR */}
      <nav
        className="px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: "#1ABC9C" }}
      >
        <h1 className="text-2xl font-bold text-white">All Leads</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg"
          >
            ← Back
          </button>

          <button
            onClick={loadData}
            className="bg-white text-[#1ABC9C] px-3 py-2 rounded-lg font-semibold"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={() => navigate("/followup")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Follow-up Dashboard →
          </button>
        </div>
      </nav>

      {/* PAGE BODY */}
      <div className="p-6 sm:p-8">

        {/* FILTERS */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Category (e.g. Tuition)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />

            <select
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Score: Any</option>
              <option value="80">80+</option>
              <option value="60">60+</option>
              <option value="40">40+</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            onClick={applyFilters}
            className="mt-4 px-6 py-2 bg-[#1ABC9C] text-white rounded-lg font-semibold hover:bg-teal-700"
          >
            Apply Filters
          </button>
        </div>

        {/* LEAD TABLE */}
        {loading ? (
          <div className="p-10 text-center text-gray-600">
            Loading leads...
          </div>
        ) : (
          <LeadTable
            leads={filtered}
            onFollowUp={goToFollowUp}
          />
        )}
      </div>
    </div>
  );
}
