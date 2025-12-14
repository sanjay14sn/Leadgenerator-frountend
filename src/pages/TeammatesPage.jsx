// src/pages/TeammatesPage.jsx

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

// --- PROFESSIONAL ICONS (SVG Placeholders) ---
const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const TeamIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a4.5 4.5 0 0 0 2.378-3.348A1.5 1.5 0 0 0 21 14.5c0-.66-.466-1.205-1.077-1.385A11.25 11.25 0 0 0 12 11.25M6 18.72a4.5 4.5 0 0 1-2.378-3.348A1.5 1.5 0 0 1 3 14.5c0-.66.466-1.205 1.077-1.385A11.25 11.25 0 0 1 12 11.25m6-1.042c0 2.593-2.107 4.701-4.701 4.701S8.599 12.701 8.599 10.108s2.107-4.701 4.701-4.701 4.701 2.108 4.701 4.701Z" /></svg>;
const AddUserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h-3m3 0h3m-9.75-5.625h4.5a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-4.5a2.25 2.25 0 0 1-2.25-2.25v-2.25a2.25 2.25 0 0 1 2.25-2.25ZM6 12a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.5A2.25 2.25 0 0 0 8.25 12H6Z" /></svg>;
const ChartBarIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;
const TargetIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25S16.556 3.75 12 3.75 3.75 7.444 3.75 12s3.694 8.25 8.25 8.25Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.125 10.125l3.75 3.75M13.875 10.125l-3.75 3.75M12 16.5c-2.485 0-4.5-2.015-4.5-4.5S9.515 7.5 12 7.5s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5Z" /></svg>;

// --- Helper Components ---

// Currency formatter (assuming USD/generic currency)
const formatCurrency = (amount) => {
    if (!amount) return "-";
    // Convert to number and format as currency
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // No cents for targets
    }).format(amount);
};

const formatRate = (rate) => {
    if (typeof rate !== 'number' || isNaN(rate)) return 'N/A';
    return `${(rate * 100).toFixed(1)}%`;
};

// Custom Toggle Switch 
const ToggleSwitch = ({ isActive, onToggle }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={isActive} onChange={onToggle} className="sr-only peer" />
    <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 transition duration-300 ease-in-out ${
        isActive ? "bg-[#1ABC9C]" : "bg-gray-400"
    } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
    ></div>
  </label>
);


export default function TeammatesPage() {
  const [list, setList] = useState([]);
  const [performanceData, setPerformanceData] = useState({}); // 🔥 NEW: State for performance metrics
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
        // 1. Fetch the list of all teammates
        const teamRes = await API.get("/teammates");
        setList(teamRes.data);
        
        // 2. Fetch the performance metrics
        // Assuming /teammates/performance fetches an object mapping ID -> metrics
        const perfRes = await API.get("/teammates/performance"); 
        setPerformanceData(perfRes.data.metrics || {});
        
    } catch (error) {
        console.error("Failed to fetch teammates or performance data:", error);
    } finally {
        setLoading(false);
    }
  }

  async function toggle(id) {
    try {
        await API.patch(`/teammates/${id}/toggle`);
        // Optimistically update the list state
        setList(prevList => prevList.map(t => 
            t._id === id ? { ...t, isActive: !t.isActive } : t
        ));
    } catch (error) {
        console.error("Failed to toggle teammate status:", error);
        load(); 
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Combine list with performance data
  const teamData = list.map(t => ({
    ...t,
    performance: performanceData[t._id] || { 
        total_assigned: 0, 
        conversion_rate: 0, 
        target_achieved_pct: 0,
        completed_leads: 0
    },
  }));
  
  // Calculate Team Totals for the summary cards
  const totalLeads = teamData.reduce((sum, t) => sum + (t.performance.total_assigned || 0), 0);
  const totalCompleted = teamData.reduce((sum, t) => sum + (t.performance.completed_leads || 0), 0);
  const teamConversionRate = totalLeads > 0 ? totalCompleted / totalLeads : 0;
  
  // Performance Summary Cards Data
  const summaryCards = [
    { title: "Total Assigned Leads", value: totalLeads, icon: UserIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Leads Converted (MTD)", value: totalCompleted, icon: TargetIcon, color: "text-green-600", bg: "bg-green-50" },
    { title: "Team Conversion Rate", value: formatRate(teamConversionRate), icon: ChartBarIcon, color: "text-purple-600", bg: "bg-purple-50" },
  ];


  // --- Render Logic ---

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
             <div className="text-gray-500 flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-[#1ABC9C]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Loading Team Data...
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* --- MNC-LEVEL APP BAR (Themed Header) --- */}
      <nav className="sticky top-0 z-50 bg-[#1ABC9C] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-white font-extrabold text-xl tracking-wider">
                TEAM HUB
              </div>
              <h1 className="ml-8 text-white text-lg font-semibold border-l border-white/30 pl-4 hidden sm:block">
                Team Performance & Directory
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/followups")}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-medium"
              >
                ← Back to Leads
              </button>
              <button
                onClick={() => navigate("/admin/teammates/new")}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-medium flex items-center"
              >
                <AddUserIcon className="w-5 h-5 mr-1" />
                Add Teammate
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">

            {/* 🔥 NEW: PERFORMANCE SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {summaryCards.map((card) => (
                    <div key={card.title} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <div className={`p-2 rounded-full ${card.bg}`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                        </div>
                        <p className="mt-1 text-3xl font-extrabold text-gray-900">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* TEAM DIRECTORY / MANAGEMENT TABLE */}
            <div className="bg-white shadow-xl rounded-xl border border-gray-200">
            
              {/* HEADER SECTION */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-2xl font-extrabold text-gray-800 flex items-center">
                    <TeamIcon className="w-7 h-7 mr-3 text-[#1ABC9C]" />
                    Team Member Directory ({list.length})
                </h2>
                <button
                    onClick={load}
                    className="text-sm text-gray-600 hover:text-gray-800 transition font-medium flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992h-.001M19.644 3.344h-4.992m4.992 0L20.5 7.5l-4.992 4.992" /></svg>
                    Reload
                </button>
              </div>

              {/* TEAM MEMBERS TABLE */}
              {list.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider">
                      <tr>
                        <th className="p-4 text-left font-bold w-1/4">Member Name</th>
                        <th className="p-4 text-left font-bold hidden sm:table-cell">Email</th>
                        <th className="p-4 text-left font-bold">Role</th>
                        <th className="p-4 text-center font-bold">Status</th>
                        <th className="p-4 text-center font-bold hidden lg:table-cell">Assigned Leads</th>
                        <th className="p-4 text-right font-bold hidden md:table-cell">Monthly Target</th>
                        <th className="p-4 text-center font-bold">Conversion Rate</th> {/* 🔥 NEW COLUMN */}
                        <th className="p-4 text-center font-bold">Active Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {teamData.map((t) => (
                        <tr key={t._id} className="hover:bg-teal-50/50 transition duration-150">
                          <td className="p-4 text-gray-800 font-semibold flex items-center">
                              <UserIcon className="w-5 h-5 mr-2 text-gray-400 hidden sm:block"/>
                              {t.name}
                          </td>
                          <td className="text-gray-600 hidden sm:table-cell">{t.email}</td>
                          <td className="text-gray-600">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                t.role === "MANAGER"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {t.role}
                            </span>
                          </td>
                          <td className="text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                t.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {t.isActive ? "ONLINE" : "OFFLINE"}
                            </span>
                          </td>
                          {/* 🔥 NEW PERFORMANCE COLUMNS */}
                          <td className="text-center font-semibold text-gray-800 hidden lg:table-cell">
                              {t.performance.total_assigned}
                          </td>
                          <td className="text-right font-mono text-gray-700 hidden md:table-cell">
                              {formatCurrency(t.monthly_target)}
                          </td>
                          <td className="text-center font-semibold">
                            <span className={`${t.performance.conversion_rate >= 0.15 ? 'text-green-600' : 'text-orange-600'}`}>
                              {formatRate(t.performance.conversion_rate)}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <ToggleSwitch 
                                isActive={t.isActive} 
                                onToggle={() => toggle(t._id)} 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Empty State
                <div className="p-12 text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                        <TeamIcon />
                    </div>
                    <p className="text-lg font-medium mb-3">No Team Members Found</p>
                    <p className="mb-6">Start by adding your first agent or manager to the system.</p>
                    <button
                        onClick={() => navigate("/admin/teammates/new")}
                        className="bg-[#1ABC9C] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-teal-600 transition"
                    >
                        <AddUserIcon className="w-5 h-5 mr-2 inline-block"/>
                        Add New Teammate
                    </button>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}