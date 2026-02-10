import React, { useEffect, useState, useMemo } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import {
  Search,
  RotateCcw,
  CalendarDays,
  ArrowRight,
  Download,
} from "lucide-react";

export default function AllLeadsPage() {
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    hasWebsite: "all",
    status: "",
  });

  /* ------------------ LOAD DATA ------------------ */
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await API.get("/leads");
      setAllLeads(res.data || []);
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------ QUICK DATE FILTER ------------------ */
  const setQuickDate = (daysAgoStart, daysAgoEnd = 0) => {
    const start = new Date();
    start.setDate(start.getDate() - daysAgoStart);

    const end = new Date();
    end.setDate(end.getDate() - daysAgoEnd);

    setFilters((prev) => ({
      ...prev,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    }));
    setCurrentPage(1);
  };

  /* ------------------ FILTERING ------------------ */
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      // Search
      if (filters.search) {
        const term = filters.search.toLowerCase();
        const matches = [lead.name, lead.category, lead.email].some((val) =>
          val?.toLowerCase().includes(term)
        );
        if (!matches) return false;
      }

      // Website filter
      if (filters.hasWebsite !== "all") {
        const hasUrl = !!lead.hasWebsite;
        if (
          (filters.hasWebsite === "yes" && !hasUrl) ||
          (filters.hasWebsite === "no" && hasUrl)
        )
          return false;
      }

      // Date range
      const leadDate = lead.createdAt?.slice(0, 10);
      if (filters.startDate && filters.endDate) {
        if (leadDate < filters.startDate || leadDate > filters.endDate)
          return false;
      }

      // Status
      if (
        filters.status &&
        (lead.followup?.status || "New Lead") !== filters.status
      )
        return false;

      return true;
    });
  }, [allLeads, filters]);

  /* ------------------ PAGINATION ------------------ */
  const currentLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  /* ================== RENDER ================== */
  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Leads Database
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            <span className="text-blue-600">
              {filteredLeads.length}
            </span>{" "}
            total leads matches
          </p>
        </div>

        <div className="flex gap-2">
          <button className="p-2.5 text-gray-500 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">
            <Download size={20} />
          </button>

          <button
            onClick={() => {
              setFilters({
                search: "",
                startDate: "",
                endDate: "",
                hasWebsite: "all",
                status: "",
              });
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setCurrentPage(1);
            }}
            placeholder="Search leads..."
            className="w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm"
          />
        </div>

        <div className="md:col-span-4 bg-white p-1 rounded-xl border flex shadow-sm">
          {["all", "yes", "no"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setFilters({ ...filters, hasWebsite: opt });
                setCurrentPage(1);
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition ${
                filters.hasWebsite === opt
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {opt === "all"
                ? "All Leads"
                : opt === "yes"
                ? "With Web"
                : "No Web"}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setCurrentPage(1);
            }}
            className="w-full bg-white border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium"
          >
            <option value="">All Pipeline Status</option>
            <option value="New Lead">🆕 New Lead</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="CONTACTED">📞 Contacted</option>
          </select>
        </div>
      </div>

      {/* DATE RANGE */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-3 px-5 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase border-r pr-4">
          <CalendarDays size={16} className="text-blue-500" />
          Quick Filter
        </div>

        <div className="flex gap-1">
          <button onClick={() => setQuickDate(0)} className="px-4 py-1.5 text-xs font-bold rounded-lg hover:bg-gray-50">
            Today
          </button>
          <button onClick={() => setQuickDate(1, 1)} className="px-4 py-1.5 text-xs font-bold rounded-lg hover:bg-gray-50">
            Yesterday
          </button>
          <button onClick={() => setQuickDate(7)} className="px-4 py-1.5 text-xs font-bold rounded-lg hover:bg-gray-50">
            Last 7 Days
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => {
              setFilters({ ...filters, startDate: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-gray-50 rounded-lg px-3 py-1 text-xs font-semibold"
          />
          <ArrowRight size={14} className="text-gray-300" />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => {
              setFilters({ ...filters, endDate: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-gray-50 rounded-lg px-3 py-1 text-xs font-semibold"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm font-medium">
              Fetching leads...
            </p>
          </div>
        ) : (
          <LeadTable
            leads={currentLeads}
            totalItems={filteredLeads.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}