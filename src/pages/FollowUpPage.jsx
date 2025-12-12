// src/pages/FollowUpPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

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
      return { title: h.action.replace("_", " "), color: "text-gray-500" };
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

/* -------------------------------------------------
   LEAD DETAIL MODAL (No changes needed)
------------------------------------------------- */
function LeadDetailModal({ id, onClose, onSaved }) {
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Details");

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  async function fetchLead() {
    setIsLoading(true);
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data);
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addNote() {
    if (!note.trim()) return;

    try {
      const freshRes = await API.get(`/leads/${id}`);
      const freshLead = freshRes.data;
      const history = freshLead.followup?.history || [];

      history.push({
        action: "MANUAL_NOTE",
        message: note.trim(),
        timestamp: new Date(),
      });

      await API.patch(`/leads/${id}`, {
        followup: { ...freshLead.followup, history }, 
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

  // Modal tab content components
  const DetailsTab = (
    <div className="space-y-4">
      <h5 className="font-bold text-gray-700">Contact & Business Info</h5>
      <p>
        **Phone:** {lead.phone}
      </p>
      <p>
        **Address:** {lead.address || "N/A"}
      </p>
      <p>
        **Category:** {lead.category || "N/A"}
      </p>

      <h5 className="font-bold text-gray-700 pt-2 border-t">
        Website & Score
      </h5>
      <p>
        **Website:**{" "}
        {lead.website ? (
          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {lead.website}
          </a>
        ) : (
          "None Found"
        )}
      </p>
      <p>
        **Lead Score:** <span className="font-bold text-xl text-[#1ABC9C]">{lead.lead_score}</span>
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
        <p className="text-gray-500 text-sm italic">No follow-up history yet.</p>
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
            <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${statusClass}`}>
              {currentStatus.replace("_", " ")}
            </span>
          </div>

          <button onClick={onClose} className="text-3xl text-gray-500 hover:text-gray-800 transition">
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
   MAIN FOLLOW-UP PAGE
------------------------------------------------- */
export default function FollowUpPage() {
  const [allLeads, setAllLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadFollowups();
  }, []);

  async function loadFollowups() {
    setIsLoading(true);
    try {
      const res = await API.get("/leads");
      // Filter for leads that have a WhatsApp log, which means they are in the follow-up pipeline
      const sentLeads = res.data.filter((l) => l.followup?.last_whatsapp_sent);
      setAllLeads(sentLeads);
    } catch (error) {
      console.error("Failed to load leads:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(id, status) {
    await API.post(`/leads/${id}/update-status`, { status });
    await loadFollowups();
  }

  // SIMPLIFIED FILTERING LOGIC (Only uses statusFilter)
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const currentStatus = lead.followup?.status || "PENDING";
      
      // If Status Filter is ALL, show all leads in the pipeline.
      if (statusFilter === "ALL") {
        return true;
      }
      
      // Otherwise, only show leads matching the selected status.
      return currentStatus === statusFilter;
    });
  }, [allLeads, statusFilter]);

  function sendWhatsApp(id) {
    API.post(`/leads/${id}/whatsapp-log`);
    // window.open(`http://localhost:5009/api/leads/w/${id}`, "_blank");
    setTimeout(loadFollowups, 500);
  }
  
  // Follow-up age is still useful for context, so we keep the helper.
  const getFollowUpAge = (lead) => {
      const lastSent = lead.followup?.last_whatsapp_sent;
      if (!lastSent) return "N/A";
      const diffDays = Math.floor((Date.now() - new Date(lastSent).getTime()) / 86400000);
      if (diffDays >= 7) return <span className="text-red-600 font-bold">{diffDays} Days</span>;
      if (diffDays >= 3) return <span className="text-orange-600 font-bold">{diffDays} Days</span>;
      if (diffDays >= 1) return <span className="text-yellow-600">{diffDays} Day</span>;
      return "Today";
  };


  return (
    <div className="min-h-screen bg-[#F9FBF9] relative">
      {/* NAV BAR */}
      <nav className="px-6 py-4 bg-white shadow flex justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-[#1ABC9C]">
          Follow-up Dashboard
        </h1>

        <div className="flex gap-2 relative">
          <button
            onClick={() => navigate("/")}
            className="bg-[#1ABC9C] text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            ← Back
          </button>
          <button onClick={loadFollowups} className="border px-4 py-2 rounded hover:bg-gray-100">
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="border px-4 py-2 bg-white rounded hover:bg-gray-100 flex items-center"
          >
            Status Filter: <span className="font-bold ml-1">{statusFilter.replace("_", " ")}</span> ⌄
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
                  className="block w-full text-left px-3 py-2 hover:bg-[#1ABC9C] hover:text-white transition duration-150"
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
      </nav>

      {/* DAY FILTER BUTTONS REMOVED HERE
      */}

      {/* LEAD LIST TABLE STYLE */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-bold text-gray-700 border-b">
            <div className="col-span-4">Lead Name</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Last Contact Age</div> {/* Renamed column for clarity */}
            <div className="col-span-4 text-right">Actions</div>
          </div>

          {/* Lead Rows */}
          <div className="min-h-[400px]">
            {isLoading && <p className="p-10 text-center text-lg text-gray-600">Loading leads...</p>}
            {!isLoading && filteredLeads.length === 0 && (
              <p className="p-10 text-center text-lg text-gray-600">
                No leads match the current filter criteria (
                <span className="font-semibold">{statusFilter.replace('_', ' ')}</span>).
              </p>
            )}

            {filteredLeads.map((lead) => (
              <div key={lead._id} className="grid grid-cols-12 items-center p-4 border-b hover:bg-gray-50 transition duration-150">
                
                {/* Name and Phone */}
                <div className="col-span-4">
                  <h3
                    className="text-lg font-bold text-gray-800 cursor-pointer hover:text-[#1ABC9C]"
                    onClick={() => setSelectedLeadId(lead._id)}
                  >
                    {lead.name}
                  </h3>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(lead.followup?.status || "PENDING")}`}>
                    {lead.followup?.status || "PENDING"}
                  </span>
                </div>
                
                {/* Follow-up Age */}
                <div className="col-span-2 text-sm font-medium">
                  {getFollowUpAge(lead)}
                </div>

                {/* Actions */}
                <div className="col-span-4 flex gap-2 justify-end">
                  <button
                    onClick={() => sendWhatsApp(lead._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => updateStatus(lead._id, "INTERESTED")}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200"
                  >
                    Interested
                  </button>
                  <button
                    onClick={() => setSelectedLeadId(lead._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
                  >
                    View / Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedLeadId && (
        <LeadDetailModal
          id={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onSaved={loadFollowups}
        />
      )}
    </div>
  );
}