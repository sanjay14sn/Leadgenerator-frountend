import React, { useEffect, useState, useMemo, useCallback } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

// -------------------------------------------------------------------
// ICONS & HELPERS
// -------------------------------------------------------------------

// Icon for scheduling
const CalendarIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v1.5M4.5 9.75h15M21 9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3m18 0v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 19.5V9"
    />
  </svg>
);

// Helper to format history actions
const getActionDisplay = (h) => {
  switch (h.action) {
    case "WHATSAPP_SENT":
      return { title: "✉️ WhatsApp Sent", color: "text-blue-600" };
    case "WHATSAPP_DELIVERED":
      return { title: "✅ WhatsApp Link Clicked", color: "text-green-600" };
    case "OPENED_WEBSITE":
      return { title: "🌐 Website Opened", color: "text-purple-600" };
    case "MANUAL_NOTE":
      return { title: "📝 Manual Note", color: "text-gray-800" };
    default:
      return { title: h.action?.replace("_", " "), color: "text-gray-500" };
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "INTERESTED":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "NOT_INTERESTED":
      return "bg-rose-50 text-rose-700 border-rose-100";
    case "NOT_REACHABLE":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

const getScheduleStatus = (lead) => {
  if (!lead.next_followup_date) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
        No Schedule
      </span>
    );
  }

  const date = new Date(lead.next_followup_date);
  const now = new Date();
  const isOverdue = date < now;

  return (
    <div className="flex flex-col">
      <span className={`text-[11px] font-bold ${isOverdue ? "text-rose-600" : "text-emerald-600 flex items-center gap-1"}`}>
        {isOverdue ? "⚠️ OVERDUE" : "📅 UPCOMING"}
      </span>
      <span className="text-[10px] text-gray-500 font-medium">
        {date.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
      </span>
    </div>
  );
};

// -------------------------------------------------------------------
// MODAL COMPONENTS
// -------------------------------------------------------------------

/* -------------------------------------------------
   LEAD DETAIL MODAL
------------------------------------------------- */
function LeadDetailModal({ id, onClose, onSaved }) {
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Details");

  const fetchLead = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data);
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchLead();
  }, [id, fetchLead]);

  async function addNote() {
    if (!note.trim()) return;

    try {
      await API.post(`/leads/${id}/add-note`, {
        message: note.trim(),
      });

      setNote("");
      await fetchLead();
      onSaved?.();
      setActiveTab("Timeline");
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  }

  async function changeStatus(status) {
    await API.post(`/leads/${id}/update-status`, { status });
    await fetchLead();
    onSaved?.();
  }

  if (isLoading || !lead)
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
        <div className="text-white text-xl">Loading Lead...</div>
      </div>
    );

  const currentStatus = lead.followup?.status || "PENDING";
  const statusClass = getStatusColor(currentStatus);
  const agentName = lead.assigned_to_name || "Unassigned";

  const DetailsTab = (
    <div className="space-y-4">
      <h5 className="font-bold text-gray-700">Contact & Business Info</h5>
      <p>
        **Assigned To:**{" "}
        <span className="font-semibold text-indigo-600">{agentName}</span>
      </p>
      <p>**Phone:** {lead.phone}</p>
      <p>**Address:** {lead.address || "N/A"}</p>
      <p>**Category:** {lead.category || "N/A"}</p>

      <h5 className="font-bold text-gray-700 pt-2 border-t flex items-center">
        <CalendarIcon className="w-5 h-5 mr-1 text-red-500" />
        Next Follow-up
      </h5>
      <p className="text-sm">
        **Date:**{" "}
        <span className="font-semibold text-red-500">
          {lead.next_followup_date
            ? new Date(lead.next_followup_date).toLocaleString()
            : "Not Scheduled"}
        </span>
      </p>
      <p className="text-sm">**Note:** {lead.next_followup_note || "N/A"}</p>

      <h5 className="font-bold text-gray-700 pt-2 border-t">Website & Score</h5>
      <p>
        **Website:**{" "}
        {lead.website ? (
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {lead.website}
          </a>
        ) : (
          "None Found"
        )}
      </p>
      <p>
        **Lead Score:**{" "}
        <span className="font-bold text-xl text-[#1ABC9C]">
          {lead.lead_score}
        </span>
      </p>
      <p>
        **Google Rating:** {lead.rating} ({lead.reviews} reviews)
      </p>
    </div>
  );

  const TimelineTab = (
    <div className="space-y-3 max-h-96 overflow-y-auto p-2 border rounded-lg bg-gray-50">
      {lead.followup?.history
        ?.slice()
        .reverse()
        .map((h, i) => {
          const { title, color } = getActionDisplay(h);
          return (
            <div key={i} className="p-3 bg-white border rounded shadow-sm">
              <div className={`font-semibold ${color}`}>{title}</div>
              {h.message && <div>{h.message}</div>}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(h.timestamp).toLocaleString()}
              </div>
            </div>
          );
        }) || (
          <p className="text-gray-500 text-sm italic">
            No follow-up history yet.
          </p>
        )}
    </div>
  );

  const NotesTab = (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">Add New Note</h4>
      <div className="flex gap-2">
        <textarea
          rows="4"
          className="border rounded p-2 flex-1 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] resize-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a detailed follow-up note..."
        />
      </div>
      <button
        onClick={addNote}
        className="px-4 py-2 bg-[#1ABC9C] text-white rounded hover:bg-teal-700 disabled:opacity-50"
        disabled={!note.trim()}
      >
        Save Note & View Timeline
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 shadow-2xl max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-[#1ABC9C]">
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{lead.name}</h3>
            <span
              className={`text-sm font-semibold px-2 py-0.5 rounded-full ${statusClass}`}
            >
              {currentStatus.replace("_", " ")}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-gray-800 transition"
          >
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-4">
          {["Details", "Timeline", "Notes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-semibold ${activeTab === tab
                ? "border-b-4 border-[#1ABC9C] text-[#1ABC9C]"
                : "text-gray-600 hover:text-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 bg-gray-50 rounded-lg min-h-[400px]">
          {activeTab === "Details" && DetailsTab}
          {activeTab === "Timeline" && TimelineTab}
          {activeTab === "Notes" && NotesTab}
        </div>

        {/* Quick Status Updates (Always visible) */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
          <span className="font-semibold text-gray-700">Quick Status:</span>
          <button
            onClick={() => changeStatus("INTERESTED")}
            className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition"
          >
            Interested
          </button>
          <button
            onClick={() => changeStatus("NOT_INTERESTED")}
            className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition"
          >
            Not Interested
          </button>
          <button
            onClick={() => changeStatus("NOT_REACHABLE")}
            className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200 transition"
          >
            Not Reachable
          </button>
          <button
            onClick={() => changeStatus("COMPLETED")}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200 transition"
          >
            Completed
          </button>
          <button
            onClick={() => navigate("/quotes", { state: { lead: { name: lead.name, email: lead.email, address: lead.address } } })}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition flex items-center gap-1 shadow-md shadow-indigo-100"
          >
            <span>📄</span> Send Quote
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   ASSIGNMENT MODAL
------------------------------------------------- */
function AssignmentModal({ leadId, leadName, teammates, onClose, onAssigned }) {
  // Teammates prop contains all teammates (Admin + Agents)
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAssignment() {
    if (!selectedAgentId) return;
    setIsLoading(true);
    try {
      await API.post(`/leads/${leadId}/assign`, {
        agent_id: selectedAgentId,
      });
      onAssigned();
      onClose();
    } catch (error) {
      console.error("Failed to assign lead:", error);
      alert("Failed to assign lead.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          Assign Lead: <span className="text-[#1ABC9C]">{leadName}</span>
        </h3>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Teammate:
        </label>
        <select
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition"
        >
          <option value="" disabled>
            -- Select an Agent --
          </option>
          {teammates
            .filter((t) => t.role === "AGENT") // 👈 Filtering to show only Agents
            .map((team) => (
              <option key={team._id} value={team._id}>
                {team.name} ({team.email})
              </option>
            ))}
        </select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignment}
            disabled={!selectedAgentId || isLoading}
            className="px-4 py-2 bg-[#1ABC9C] text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {isLoading ? "Assigning..." : "Assign Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------
   SCHEDULE MODAL
------------------------------------------------- */
function ScheduleModal({ lead, onClose, onScheduled }) {
  const [scheduleDate, setScheduleDate] = useState(
    lead.next_followup_date
      ? new Date(lead.next_followup_date).toISOString().substring(0, 16)
      : ""
  );
  const [scheduleNote, setScheduleNote] = useState(
    lead.next_followup_note || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSchedule() {
    if (!scheduleDate) {
      alert("Please select a date and time.");
      return;
    }

    setIsLoading(true);
    try {
      await API.post(`/leads/${lead._id}/schedule-followup`, {
        date: scheduleDate,
        note: scheduleNote,
      });
      onScheduled();
      onClose();
    } catch (error) {
      console.error("Failed to schedule follow-up:", error);
      alert("Failed to schedule follow-up. Check console.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
          <CalendarIcon className="w-6 h-6 mr-2 text-red-500" />
          Schedule Follow-up for:{" "}
          <span className="text-[#1ABC9C] ml-1">{lead.name}</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date and Time (Required)
            </label>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-red-500 focus:border-red-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Note
            </label>
            <textarea
              rows="3"
              value={scheduleNote}
              onChange={(e) => setScheduleNote(e.target.value)}
              placeholder="e.g., Follow up on the pricing proposal sent yesterday."
              className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-[#1ABC9C] focus:border-[#1ABC9C]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={!scheduleDate || isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// MAIN FOLLOW-UP PAGE COMPONENT
// -------------------------------------------------------------------
export default function FollowUpPage() {
  const [allLeads, setAllLeads] = useState([]);
  const [teammates, setTeammates] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assignmentFilter, setAssignmentFilter] = useState("ALL");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAssignmentMenu, setShowAssignmentMenu] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [leadToAssign, setLeadToAssign] = useState(null);
  const [leadToSchedule, setLeadToSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadStatusMenuId, setLeadStatusMenuId] = useState(null);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Combined fetch logic (as described in your prompt)
  async function loadData() {
    setIsLoading(true);
    try {
      const [leadsRes, teammatesRes] = await Promise.all([
        API.get("/leads"),
        API.get("/teammates"), // 👈 Fetches ALL teammates
      ]);

      const sentLeads = leadsRes.data.filter(
        (l) => l.followup?.last_whatsapp_sent || l.next_followup_date
      );
      setAllLeads(sentLeads);
      setTeammates(teammatesRes.data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // FILTERING LOGIC
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const currentStatus = lead.followup?.status || "PENDING";
      const isAssigned = !!lead.assigned_to_id;
      const targetSearch = searchTerm.toLowerCase();
      const matchesSearch =
        lead.name?.toLowerCase().includes(targetSearch) ||
        lead.phone?.toLowerCase().includes(targetSearch) ||
        lead.industry?.toLowerCase().includes(targetSearch);

      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter !== "ALL" && currentStatus !== statusFilter) {
        return false;
      }

      // Assignment Filter
      if (assignmentFilter === "UNASSIGNED" && isAssigned) {
        return false;
      }
      if (assignmentFilter === "ASSIGNED" && !isAssigned) {
        return false;
      }
      if (
        assignmentFilter !== "ALL" &&
        assignmentFilter !== "ASSIGNED" &&
        assignmentFilter !== "UNASSIGNED"
      ) {
        // Filter by specific Agent ID
        return lead.assigned_to_id === assignmentFilter;
      }

      return true;
    });
  }, [allLeads, statusFilter, assignmentFilter, searchTerm]);

  const currentLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  function sendWhatsApp(id) {
    API.post(`/leads/${id}/whatsapp-log`);
    setTimeout(loadData, 500);
  }

  async function handleStatusChange(id, status) {
    try {
      await API.post(`/leads/${id}/update-status`, { status });
      setLeadStatusMenuId(null);
      await loadData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  // Helper to find the assigned agent name
  const getAssignedAgentName = (lead) => {
    if (!lead.assigned_to_id) return "Unassigned";
    const agent = teammates.find((t) => t._id === lead.assigned_to_id);
    return agent ? agent.name : "Unknown Agent";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1ABC9C] transition-colors">🔍</span>
            <input
              type="text"
              placeholder="Search by name, phone or industry..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-[#1ABC9C] transition-all shadow-sm font-medium text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusMenu(!showStatusMenu);
                  setShowAssignmentMenu(false);
                }}
                className="px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center gap-2 text-sm font-bold text-gray-700 shadow-sm transition-all"
              >
                <span>🎯</span>
                Status:
                <span className="text-[#1ABC9C]">
                  {statusFilter === "ALL" ? "All" : statusFilter.replace("_", " ")}
                </span>
                <span className="text-[10px] opacity-40">▼</span>
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl w-56 z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                  {["ALL", "PENDING", "INTERESTED", "NOT_INTERESTED", "NOT_REACHABLE", "COMPLETED"].map((s) => (
                    <button
                      key={s}
                      className={`block w-full text-left px-5 py-3 text-sm transition ${statusFilter === s ? "bg-teal-50 text-[#1ABC9C] font-bold" : "text-gray-600 hover:bg-gray-200"}`}
                      onClick={() => {
                        setStatusFilter(s);
                        setShowStatusMenu(false);
                        setCurrentPage(1);
                      }}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assignment Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAssignmentMenu(!showAssignmentMenu);
                  setShowStatusMenu(false);
                }}
                className="px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center gap-2 text-sm font-bold text-gray-700 shadow-sm transition-all"
              >
                <span>👤</span>
                Assign:
                <span className="text-indigo-600">
                  {assignmentFilter === "ALL" ? "All" : assignmentFilter === "ASSIGNED" ? "Assigned" : assignmentFilter === "UNASSIGNED" ? "Unassigned" : teammates.find(t => t._id === assignmentFilter)?.name || "Agent"}
                </span>
                <span className="text-[10px] opacity-40">▼</span>
              </button>
              {showAssignmentMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl w-64 z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[400px] overflow-y-auto">
                  <button
                    className={`block w-full text-left px-5 py-3 text-sm transition border-b border-gray-50 ${assignmentFilter === "ALL" ? "bg-indigo-50 text-indigo-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => { setAssignmentFilter("ALL"); setShowAssignmentMenu(false); setCurrentPage(1); }}
                  >
                    All Leads
                  </button>
                  <button
                    className={`block w-full text-left px-5 py-3 text-sm transition ${assignmentFilter === "ASSIGNED" ? "bg-indigo-50 text-indigo-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => { setAssignmentFilter("ASSIGNED"); setShowAssignmentMenu(false); setCurrentPage(1); }}
                  >
                    Assigned Only
                  </button>
                  <button
                    className={`block w-full text-left px-5 py-3 text-sm transition border-b border-gray-50 mb-1 ${assignmentFilter === "UNASSIGNED" ? "bg-indigo-50 text-indigo-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                    onClick={() => { setAssignmentFilter("UNASSIGNED"); setShowAssignmentMenu(false); setCurrentPage(1); }}
                  >
                    Unassigned Only
                  </button>
                  {teammates.filter(t => t.role === "AGENT" && t.isActive).map((t) => (
                    <button
                      key={t._id}
                      className={`block w-full text-left px-5 py-2.5 text-sm transition ${assignmentFilter === t._id ? "bg-indigo-50 text-indigo-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                      onClick={() => { setAssignmentFilter(t._id); setShowAssignmentMenu(false); setCurrentPage(1); }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lead List Section */}
        <div className="space-y-3">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1ABC9C] mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your leads...</p>
            </div>
          )}

          {!isLoading && currentLeads.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400">No leads found in this view.</p>
            </div>
          )}

          {currentLeads.map((lead) => (
            <div
              key={lead._id}
              className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-100 transition-all duration-300 relative"
            >
              {/* Vertical Accent Bar */}
              <div className={`absolute top-0 left-0 bottom-0 w-1 ${lead.next_followup_date && new Date(lead.next_followup_date) < new Date()
                ? "bg-rose-500"
                : "bg-emerald-500"
                }`} />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* 1. Lead Info (Flexible) */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-lg text-gray-900 truncate hover:text-[#1ABC9C] cursor-pointer transition leading-tight mb-1"
                    onClick={() => setSelectedLeadId(lead._id)}
                  >
                    {lead.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                      <span className="text-gray-400">📞</span>
                      {lead.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <span className="text-gray-300">#</span>
                      {lead.industry || "General Lead"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="opacity-50">Sync:</span>
                      <span className="text-gray-500">{new Date(lead.followup.last_whatsapp_sent).toLocaleDateString("en-GB", { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Agent Section (Fixed Width) */}
                <div className="w-full md:w-40 flex-shrink-0">
                  <p className="text-[10px] uppercase font-black text-gray-300 tracking-wider mb-1">Agent</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[11px] font-black text-indigo-600">
                      {getAssignedAgentName(lead).charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-700 truncate">{getAssignedAgentName(lead)}</span>
                  </div>
                </div>

                {/* 3. Follow-up Goal (Fixed Width) */}
                <div className="w-full md:w-44 flex-shrink-0">
                  <p className="text-[10px] uppercase font-black text-gray-300 tracking-wider mb-1">Follow-up Goal</p>
                  {getScheduleStatus(lead)}
                </div>

                {/* 4. Actions (Fixed Right) */}
                <div className="w-full md:w-auto flex flex-wrap items-center justify-start md:justify-end gap-2">
                  <button
                    onClick={() => setLeadToAssign(lead)}
                    className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all border border-gray-100 shadow-sm"
                    title="Assign Lead"
                  >
                    👤
                  </button>
                  <button
                    onClick={() => setLeadToSchedule(lead)}
                    className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white hover:text-rose-600 hover:border-rose-200 transition-all border border-gray-100 shadow-sm"
                    title="Schedule Follow-up"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </button>

                  {/* Pipeline Dropdown */}
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setLeadStatusMenuId(leadStatusMenuId === lead._id ? null : lead._id)}
                      className={`min-w-[140px] h-10 flex items-center justify-between px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border shadow-sm ${getStatusColor(lead.followup?.status || "PENDING")}`}
                    >
                      <span className="flex items-center gap-2">
                        <span>🔄</span>
                        {(lead.followup?.status || "PENDING").replace("_", " ")}
                      </span>
                      <span className="text-[8px] opacity-40 ml-2">▼</span>
                    </button>
                    {leadStatusMenuId === lead._id && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl w-48 z-[9999] py-2 animate-in fade-in zoom-in duration-200 ring-4 ring-black/5">
                        {["PENDING", "CONTACTED", "INTERESTED", "NOT_INTERESTED", "NOT_REACHABLE", "COMPLETED"].map((s) => (
                          <button
                            key={s}
                            className={`block w-full text-left px-5 py-3 text-[11px] font-bold transition ${lead.followup?.status === s ? "bg-[#1ABC9C]/10 text-[#1ABC9C]" : "text-gray-600 hover:bg-gray-50"}`}
                            onClick={() => handleStatusChange(lead._id, s)}
                          >
                            {s.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Action */}
                  <a
                    href={`${API.defaults.baseURL}/leads/w/${lead._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sendWhatsApp(lead._id)}
                    className="p-2.5 bg-[#1ABC9C] text-white rounded-xl hover:bg-[#16a085] transition shadow-lg shadow-teal-500/20 border border-teal-400 group"
                    title="Send WhatsApp"
                  >
                    <span className="group-hover:scale-125 transition-transform block">💬</span>
                  </a>
                </div>
              </div>

              {/* Latest Note (Subtle but Readable Footer) */}
              {lead.next_followup_note && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 leading-relaxed font-medium flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black text-gray-300 tracking-widest bg-gray-50 px-2 py-0.5 rounded">Note</span>
                    <span className="italic text-gray-600">"{lead.next_followup_note}"</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm px-6 py-5 flex items-center justify-between rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/50">
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="font-bold text-gray-900">{filteredLeads.length}</span> leads
              </p>
            </div>
            <div className="flex-1 sm:flex-none flex justify-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${currentPage === i + 1 ? "bg-[#1ABC9C] text-white shadow-md ring-2 ring-teal-100" : "border text-gray-500 hover:bg-gray-50"}`}
                >
                  {i + 1}
                </button>
              )).filter((_, i) => {
                // Basic windowing for pagination
                if (totalPages <= 5) return true;
                if (i === 0 || i === totalPages - 1) return true;
                return Math.abs(i - (currentPage - 1)) <= 1;
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* MODALS */}

        {/* 1. Lead Detail Modal */}
        {selectedLeadId && (
          <LeadDetailModal
            id={selectedLeadId}
            onClose={() => setSelectedLeadId(null)}
            onSaved={loadData}
          />
        )}

        {/* 2. Assignment Modal */}
        {leadToAssign && (
          <AssignmentModal
            leadId={leadToAssign._id}
            leadName={leadToAssign.name}
            teammates={teammates}
            onClose={() => setLeadToAssign(null)}
            onAssigned={loadData}
          />
        )}

        {/* 3. Schedule Modal */}
        {leadToSchedule && (
          <ScheduleModal
            lead={leadToSchedule}
            onClose={() => setLeadToSchedule(null)}
            onScheduled={loadData}
          />
        )}
      </div>
    </div>
  );
}
