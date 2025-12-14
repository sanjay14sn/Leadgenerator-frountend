import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

// --- PROFESSIONAL ICONS (SVG Placeholders) ---
// 🚨 MISSING ICON DEFINITIONS ADDED HERE TO FIX THE ERROR
const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const TeamIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a4.5 4.5 0 0 0 2.378-3.348A1.5 1.5 0 0 0 21 14.5c0-.66-.466-1.205-1.077-1.385A11.25 11.25 0 0 0 12 11.25M6 18.72a4.5 4.5 0 0 1-2.378-3.348A1.5 1.5 0 0 1 3 14.5c0-.66.466-1.205 1.077-1.385A11.25 11.25 0 0 1 12 11.25m6-1.042c0 2.593-2.107 4.701-4.701 4.701S8.599 12.701 8.599 10.108s2.107-4.701 4.701-4.701 4.701 2.108 4.701 4.701Z" /></svg>;
const AddUserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h-3m3 0h3m-9.75-5.625h4.5a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-4.5a2.25 2.25 0 0 1-2.25-2.25v-2.25a2.25 2.25 0 0 1 2.25-2.25ZM6 12a2.25 2.25 0 0 0-2.25 2.25v1.5a2.25 2.25 0 0 0 2.25 2.25h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.5A2.25 2.25 0 0 0 8.25 12H6Z" /></svg>;

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

// Custom Toggle Switch (MNC-level UX for activation)
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
        const res = await API.get("/teammates");
        setList(res.data);
    } catch (error) {
        console.error("Failed to fetch teammates:", error);
    } finally {
        setLoading(false);
    }
  }

  async function toggle(id) {
    try {
        await API.patch(`/teammates/${id}/toggle`);
        // Optimistically update the list state before full reload
        setList(prevList => prevList.map(t => 
            t._id === id ? { ...t, isActive: !t.isActive } : t
        ));
    } catch (error) {
        console.error("Failed to toggle teammate status:", error);
        // If the toggle fails, reload the list to restore consistency
        load(); 
    }
  }

  useEffect(() => {
    load();
  }, []);

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
                TEAM | DASHBOARD
              </div>
              <h1 className="ml-8 text-white text-lg font-semibold border-l border-white/30 pl-4 hidden sm:block">
                All Team Members
              </h1>
            </div>
            <button
              onClick={() => navigate("/admin/teammates/new")}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-medium flex items-center"
            >
              <AddUserIcon className="w-5 h-5 mr-1" />
              Add Teammate
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
          
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center">
                <TeamIcon className="w-7 h-7 mr-3 text-[#1ABC9C]" />
                Team Member Directory ({list.length})
            </h2>
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
                    <th className="p-4 text-right font-bold hidden md:table-cell">Monthly Target</th>
                    <th className="p-4 text-center font-bold">Active Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {list.map((t) => (
                    <tr key={t._id} className="hover:bg-teal-50/50 transition duration-150">
                      <td className="p-4 text-gray-800 font-semibold flex items-center">
                          {/* 🚨 This is Line 140 (corrected) */}
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
                      <td className="text-right font-mono text-gray-700 hidden md:table-cell">
                          {formatCurrency(t.monthly_target)}
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
  );
}