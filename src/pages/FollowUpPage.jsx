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
      return "bg-green-100 text-green-800";
    case "NOT_INTERESTED":
      return "bg-red-100 text-red-800";
    case "NOT_REACHABLE":
      return "bg-orange-100 text-orange-800";
    case "COMPLETED":
      return "bg-purple-100 text-purple-800";
    case "PENDING":
    default:
      return "bg-blue-100 text-blue-800";
  }
};

// Helper to determine and display schedule status
const getScheduleStatus = (lead) => {
  if (!lead.next_followup_date) {
    return <span className="text-gray-500 text-xs italic">No Schedule</span>;
  }

  const date = new Date(lead.next_followup_date);
  const now = Date.now();
  const isOverdue = date.getTime() < now;

  if (isOverdue) {
    return (
      <span className="text-red-600 font-semibold text-xs">
        OVERDUE ({date.toLocaleDateString()})
      </span>
    );
  }

  const diffDays = Math.floor((date.getTime() - now) / 86400000);

  if (diffDays === 0) {
    return (
      <span className="text-green-600 font-semibold text-xs">
        TODAY (
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})
      </span>
    );
  }

  return (
    <span className="text-blue-600 text-xs">{date.toLocaleDateString()}</span>
  );
};

// -------------------------------------------------------------------
// MODAL COMPONENTS
// -------------------------------------------------------------------

/* -------------------------------------------------
   LEAD DETAIL MODAL
------------------------------------------------- */
function LeadDetailModal({ id, onClose, onSaved }) {
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
              className={`py-2 px-4 font-semibold ${
                activeTab === tab
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
        (l) => l.followup?.last_whatsapp_sent
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
  }, [allLeads, statusFilter, assignmentFilter]);

  function sendWhatsApp(id) {
    API.post(`/leads/${id}/whatsapp-log`);
    setTimeout(loadData, 500);
  }

  // Helper to find the assigned agent name (Uses the fetched 'teammates' array)
  const getAssignedAgentName = (lead) => {
    if (!lead.assigned_to_id)
      return <span className="text-gray-500 italic">Unassigned</span>;
    const agent = teammates.find((t) => t._id === lead.assigned_to_id);
    return agent ? (
      <span className="font-semibold text-indigo-600">{agent.name}</span>
    ) : (
      <span className="text-gray-500 italic">Unknown Agent</span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FBF9] relative">
      {/* NAV BAR */}
      <nav className="px-6 py-4 bg-white shadow flex justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-[#1ABC9C]">
          Follow-up Dashboard
        </h1>

        <div className="flex gap-2 relative items-center">
          {/* Back & Refresh buttons */}
          <button
            onClick={() => navigate("/")}
            className="bg-[#1ABC9C] text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            ← Back
          </button>

          <button
            onClick={loadData}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="border px-4 py-2 bg-white rounded hover:bg-gray-100 flex items-center"
            >
              Status:
              <span className="font-bold ml-1">
                {statusFilter.replace("_", " ")}
              </span>
              ⌄
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border shadow-lg rounded w-48 z-20">
                {[
                  "ALL",
                  "PENDING",
                  "INTERESTED",
                  "NOT_INTERESTED",
                  "NOT_REACHABLE",
                  "COMPLETED",
                ].map((s) => (
                  <button
                    key={s}
                    className="block w-full text-left px-3 py-2 hover:bg-[#1ABC9C] hover:text-white"
                    onClick={() => {
                      setStatusFilter(s);
                      setShowStatusMenu(false);
                    }}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assignment Filter */}
          <div className="relative">
            <button
              onClick={() => setShowAssignmentMenu(!showAssignmentMenu)}
              className="border px-4 py-2 bg-white rounded hover:bg-gray-100 flex items-center"
            >
              Assignment:
              <span className="font-bold ml-1">
                {assignmentFilter === "ALL"
                  ? "All"
                  : assignmentFilter === "ASSIGNED"
                  ? "Assigned"
                  : assignmentFilter === "UNASSIGNED"
                  ? "Unassigned"
                  : teammates.find((t) => t._id === assignmentFilter)?.name ||
                    "Agent"}
              </span>
              ⌄
            </button>
            {showAssignmentMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border shadow-lg rounded w-48 z-20">
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-[#1ABC9C] hover:text-white font-bold"
                  onClick={() => {
                    setAssignmentFilter("ALL");
                    setShowAssignmentMenu(false);
                  }}
                >
                  All Leads
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-[#1ABC9C] hover:text-white"
                  onClick={() => {
                    setAssignmentFilter("ASSIGNED");
                    setShowAssignmentMenu(false);
                  }}
                >
                  Assigned Only
                </button>
                <button
                  className="block w-full text-left px-3 py-2 hover:bg-[#1ABC9C] hover:text-white border-b mb-1"
                  onClick={() => {
                    setAssignmentFilter("UNASSIGNED");
                    setShowAssignmentMenu(false);
                  }}
                >
                  Unassigned Only
                </button>

                <p className="text-xs text-gray-500 px-3 pt-1">
                  Filter by Agent:
                </p>
                {teammates
                  .filter(t => t.role === "AGENT" && t.isActive)

                  .map((t) => (
                    <button
                      key={t._id}
                      className="block w-full text-left px-3 py-1 hover:bg-[#1ABC9C] hover:text-white text-sm"
                      onClick={() => {
                        setAssignmentFilter(t._id);
                        setShowAssignmentMenu(false);
                      }}
                    >
                      {t.name}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Team Management Button */}
          <button
            onClick={() => navigate("/admin/teammates")}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
          >
            👥 Team Hub
          </button>
        </div>
      </nav>

      {/* LEAD LIST TABLE STYLE */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-bold text-gray-700 border-b">
            <div className="col-span-3">Lead Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Assigned To</div>
            <div className="col-span-2">Next Follow-up</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {/* Lead Rows */}
          <div className="min-h-[400px]">
            {isLoading && (
              <p className="p-10 text-center text-lg text-gray-600">
                Loading leads...
              </p>
            )}
            {!isLoading && filteredLeads.length === 0 && (
              <p className="p-10 text-center text-lg text-gray-600">
                No leads match the current filter criteria.
              </p>
            )}

            {filteredLeads.map((lead) => (
              <div
                key={lead._id}
                className="grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50 transition duration-150"
              >
                <div className="col-span-3">
                  <span
                    className="font-semibold text-lg text-gray-800 cursor-pointer hover:text-[#1ABC9C] transition"
                    onClick={() => setSelectedLeadId(lead._id)}
                  >
                    {lead.name}
                  </span>
                  <div className="text-xs text-gray-500">{lead.phone}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Last sent:{" "}
                    {new Date(
                      lead.followup.last_whatsapp_sent
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div className="col-span-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      lead.followup?.status || "PENDING"
                    )}`}
                  >
                    {(lead.followup?.status || "PENDING").replace("_", " ")}
                  </span>
                </div>

                <div className="col-span-2">
                  {getAssignedAgentName(lead)} {/* 👈 Displays Agent Name */}
                </div>

                {/* Next Follow-up Column */}
                <div className="col-span-2 flex flex-col items-start">
                  {getScheduleStatus(lead)}
                  {lead.next_followup_note && (
                    <span
                      className="text-xs text-gray-400 line-clamp-1 mt-0.5"
                      title={lead.next_followup_note}
                    >
                      {lead.next_followup_note}
                    </span>
                  )}
                </div>

                <div className="col-span-3 text-right space-x-2">
                  {/* Assign Button */}
                  <button
                    onClick={() => setLeadToAssign(lead)}
                    className="px-3 py-1 border rounded text-sm text-indigo-600 border-indigo-300 hover:bg-indigo-50 transition"
                  >
                    {lead.assigned_to_id ? "Re-Assign" : "Assign"}
                  </button>
                  {/* Schedule Button */}
                  <button
                    onClick={() => setLeadToSchedule(lead)}
                    className="px-3 py-1 border rounded text-sm text-red-600 border-red-300 hover:bg-red-50 transition"
                  >
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Schedule
                  </button>
                  {/* WhatsApp Button */}
                  <a
                    href={`${API.defaults.baseURL}/leads/w/${lead._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sendWhatsApp(lead._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                  >
                    WA Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
  );
}
