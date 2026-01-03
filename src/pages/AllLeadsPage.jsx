import React, { useEffect, useState, useMemo } from "react";
import API from "../api/api";
import LeadTable from "../components/LeadTable";
import AppLayout from "../layouts/AppLayout";
import { 
  Search, Filter, RotateCcw, LayoutGrid, CalendarDays, ArrowRight, Download
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

  const setQuickDate = (daysAgoStart, daysAgoEnd = 0) => {
    const start = new Date();
    start.setDate(start.getDate() - daysAgoStart);
    const end = new Date();
    end.setDate(end.getDate() - daysAgoEnd);
    
    setFilters(prev => ({ 
      ...prev, 
      startDate: start.toISOString().split('T')[0], 
      endDate: end.toISOString().split('T')[0] 
    }));
    setCurrentPage(1);
  };

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      if (filters.search) {
        const term = filters.search.toLowerCase();
        const matches = [lead.name, lead.category, lead.email].some(val => val?.toLowerCase().includes(term));
        if (!matches) return false;
      }

      if (filters.hasWebsite !== "all") {
        const hasUrl = !!lead.hasWebsite;
        if ((filters.hasWebsite === "yes" && !hasUrl) || (filters.hasWebsite === "no" && hasUrl)) return false;
      }

      const leadDate = lead.createdAt?.slice(0, 10);
      if (filters.startDate && filters.endDate) {
        if (leadDate < filters.startDate || leadDate > filters.endDate) return false;
      }

      if (filters.status && (lead.followup?.status || "New Lead") !== filters.status) return false;

      return true;
    });
  }, [allLeads, filters]);

  const currentLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  return (
    <AppLayout>
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-4 bg-gray-50/30 min-h-screen">
        
        {/* COMPACT HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Leads Database</h1>
            <p className="text-sm text-gray-500 font-medium">
              <span className="text-blue-600">{filteredLeads.length}</span> total leads matches
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 text-gray-500 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Download size={20} />
            </button>
            <button 
              onClick={() => setFilters({ search: "", startDate: "", endDate: "", hasWebsite: "all", status: "" })}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={filters.search}
              onChange={(e) => { setFilters({...filters, search: e.target.value}); setCurrentPage(1); }}
              placeholder="Search leads..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="md:col-span-4 bg-white p-1 rounded-xl border border-gray-200 flex shadow-sm">
            {['all', 'yes', 'no'].map((opt) => (
              <button
                key={opt}
                onClick={() => { setFilters({...filters, hasWebsite: opt}); setCurrentPage(1); }}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  filters.hasWebsite === opt ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                {opt === 'all' ? 'All Leads' : opt === 'yes' ? 'With Web' : 'No Web'}
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            <select
              value={filters.status}
              onChange={(e) => { setFilters({...filters, status: e.target.value}); setCurrentPage(1); }}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-700 appearance-none"
            >
              <option value="">All Pipeline Status</option>
              <option value="New Lead">🆕 New Lead</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="CONTACTED">📞 Contacted</option>
            </select>
          </div>
        </div>

        {/* COMPACT DATE RANGE BAR */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 px-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-wider border-r pr-4">
            <CalendarDays size={16} className="text-blue-500" />
            Quick Filter
          </div>
          
          <div className="flex gap-1">
            <button onClick={() => setQuickDate(0)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filters.startDate === new Date().toISOString().split('T')[0] ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Today</button>
            <button onClick={() => setQuickDate(1, 1)} className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg">Yesterday</button>
            <button onClick={() => setQuickDate(7)} className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg">Last 7 Days</button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => { setFilters({...filters, startDate: e.target.value}); setCurrentPage(1); }}
              className="bg-gray-50 border-none rounded-lg px-3 py-1 text-xs font-semibold text-gray-600 focus:ring-1 focus:ring-blue-500"
            />
            <ArrowRight size={14} className="text-gray-300" />
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => { setFilters({...filters, endDate: e.target.value}); setCurrentPage(1); }}
              className="bg-gray-50 border-none rounded-lg px-3 py-1 text-xs font-semibold text-gray-600 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm font-medium">Fetching leads...</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[400px]">
              <LeadTable
                leads={currentLeads}
                totalItems={filteredLeads.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}