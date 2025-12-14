// src/pages/AllLeadsPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import { useNavigate } from "react-router-dom";

export default function AllLeadsPage() {
  const [allLeads, setAllLeads] = useState([]);
  const [filtered, setFiltered] = useState([]); 
  
  // --- BASIC FILTERS ---
  const [category, setCategory] = useState("");
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");

  // --- ADVANCED FILTERS (NEW) ---
  const [hasWebsiteFilter, setHasWebsiteFilter] = useState("all"); 
  const [whatsappFilter, setWhatsappFilter] = useState("all"); 
  const [statusFilter, setStatusFilter] = useState(""); 

  const [loading, setLoading] = useState(false);
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  
  const navigate = useNavigate();

  // Helper to reset all filter states
  const resetFilters = () => {
    setCategory("");
    setScore("");
    setDate("");
    setHasWebsiteFilter("all");
    setWhatsappFilter("all");
    setStatusFilter("");
    // Trigger filter application to update the table immediately
    // Note: We call applyFilters in useEffect after state update is guaranteed
  };
  
  /* ------------------------------------
     LOAD ALL LEADS
  ------------------------------------ */
  useEffect(() => {
    loadData();
  }, []);

  // Use a second useEffect to apply filters when filter states are reset
  useEffect(() => {
      // This is primarily for when the 'Clear Filters' button is pressed
      applyFilters(); 
  }, [category, score, date, hasWebsiteFilter, whatsappFilter, statusFilter, allLeads]);


  async function loadData() {
    setLoading(true);
    try {
      const res = await API.get("/leads");
      setAllLeads(res.data);
      setFiltered(res.data); // Initial filtering is everything
      setCurrentPage(1);
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------
     APPLY FILTERS (UPDATED LOGIC)
  ------------------------------------ */
  const applyFilters = (manualRun = false) => {
    let list = [...allLeads]; 

    // 1. Basic Filters
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

    // 2. Advanced Filters (Website)
    if (hasWebsiteFilter !== "all") {
        const required = hasWebsiteFilter === "yes";
        list = list.filter(l => !!l.hasWebsite === required);
    }

    // 3. Advanced Filters (WhatsApp)
    if (whatsappFilter !== "all") {
        const required = whatsappFilter === "yes";
        list = list.filter(l => !!l.whatsapp === required);
    }

    // 4. Advanced Filters (Pipeline Status)
    if (statusFilter) {
        list = list.filter(l => (l.followup?.status || 'New Lead') === statusFilter);
    }

    setFiltered(list); 
    setCurrentPage(1); 
  };
  
  // Handle filter changes instantly without an "Apply" button, for better UX
  const handleFilterChange = (setter) => (e) => {
      setter(e.target.value);
      // Filters are applied by the useEffect that watches all filter states
  }


  /* ------------------------------------
     PAGINATION SLICING
  ------------------------------------ */
  const currentLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  /* ------------------------------------
     FOLLOW-UP ENTRY POINT
  ------------------------------------ */
  async function goToFollowUp(leadId) {
    try {
      await API.post(`/leads/${leadId}/whatsapp-log`);
      // Optional: if you update the lead status on the backend, call loadData() here.
    } catch (error) {
      console.error("Failed to log follow-up:", error);
      alert("Failed to log follow-up. Check API.");
    }
  }

  // Function passed to LeadTable to handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="min-h-screen bg-[#F9FBF9]">

      {/* TOP BAR (Unchanged) */}
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

        {/* FILTERS (User-Friendly Design) */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-between">
            Search & Filter Leads
            <button
                onClick={resetFilters}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
                Clear Filters
            </button>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              
            {/* 1. Category Search (Input) */}
            <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Search Keyword/Category</label>
                <input
                    placeholder="e.g., Watch repair, Tuition"
                    value={category}
                    onChange={handleFilterChange(setCategory)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                />
            </div>

            {/* 2. Score Filter (Select) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Min. Score</label>
                <select
                    value={score}
                    onChange={handleFilterChange(setScore)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                >
                    <option value="">Any</option>
                    <option value="80">80+</option>
                    <option value="60">60+</option>
                    <option value="40">40+</option>
                </select>
            </div>

            {/* 3. Date Filter (Input) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date Created</label>
                <input
                    type="date"
                    value={date}
                    onChange={handleFilterChange(setDate)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                />
            </div>
            
            {/* 4. Status Filter (Select) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Pipeline Status</label>
                <select
                    value={statusFilter}
                    onChange={handleFilterChange(setStatusFilter)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                >
                    <option value="">All Statuses</option>
                    <option value="New Lead">New Lead</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="LOST">Lost</option>
                </select>
            </div>

            {/* 5. Website Filter (Select) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Has Website?</label>
                <select
                    value={hasWebsiteFilter}
                    onChange={handleFilterChange(setHasWebsiteFilter)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                >
                    <option value="all">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>

            {/* 6. WhatsApp Filter (Select) */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Has WhatsApp?</label>
                <select
                    value={whatsappFilter}
                    onChange={handleFilterChange(setWhatsappFilter)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#1ABC9C] focus:ring-[#1ABC9C]"
                >
                    <option value="all">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
            
          </div>
          
          {/* Removed the separate Apply button since filters are now applied automatically via useEffect */}
          {/* <button onClick={applyFilters} ...> Apply Filters </button> */}

        </div>
        {/*  */}


        {/* LEAD TABLE */}
        {loading ? (
          <div className="p-10 text-center text-gray-600">
            Loading leads...
          </div>
        ) : (
          <LeadTable
            // Pass the sliced data for the current page
            leads={currentLeads} 
            onFollowUp={goToFollowUp}
            
            // Pass Pagination props
            totalItems={filtered.length} // The total number of filtered leads
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}