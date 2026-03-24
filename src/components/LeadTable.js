// src/components/LeadTable.js

import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * LeadTable Component
 * Renders a table of leads in a CRM style with pagination controls and multi-selection.
 */
export default function LeadTable({
  leads,
  onFollowUp,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onStatusChange,
  selectedIds = [],
  onSelectionChange,
}) {
  const navigate = useNavigate();

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const getLocality = (address) => {
    if (!address) return "N/A";
    const parts = address
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 3);
    if (parts.length >= 2) {
      return `${parts[1]}, ${parts[2] || parts[1]}`;
    }
    return parts[0];
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "INTERESTED":
        return "bg-green-100 text-green-800";
      case "CONTACTED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "LOST":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [statusMenuId, setStatusMenuId] = React.useState(null);

  const handleStatusUpdate = async (leadId, newStatus) => {
    if (onStatusChange) {
      await onStatusChange(leadId, newStatus);
    }
    setStatusMenuId(null);
  };

  const handleViewLead = (leadId) => {
    navigate(`/leads/${leadId}/templates`);
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-white">
        <p className="font-semibold">No leads to display.</p>
        <p className="text-sm mt-1">Check your filters or scrape new data.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  checked={leads.length > 0 && selectedIds.length === leads.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectionChange(leads.map((l) => l._id));
                    } else {
                      onSelectionChange([]);
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category / Location
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                WhatsApp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pipeline Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead._id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(lead._id) ? "bg-teal-50/50" : ""}`}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                    checked={selectedIds.includes(lead._id)}
                    onChange={() => {
                      if (selectedIds.includes(lead._id)) {
                        onSelectionChange(selectedIds.filter((id) => id !== lead._id));
                      } else {
                        onSelectionChange([...selectedIds, lead._id]);
                      }
                    }}
                  />
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm font-semibold text-gray-900 min-w-[150px]">
                  {lead.name || "N/A"}
                </td>
                <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 min-w-[200px]">
                  <div className="font-medium text-slate-800">{lead.category || "N/A"}</div>
                  <div className="text-xs text-gray-500">{getLocality(lead.address)}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-teal-600">
                  {lead.lead_score || 0}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-center">
                  <span role="img" aria-label="website-status">
                    {lead.hasWebsite ? "🌐 Yes" : "❌ No"}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-center">
                  <span role="img" aria-label="whatsapp-status">
                    {lead.whatsapp ? "✅ Yes" : "⛔ No"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusMenuId(statusMenuId === lead._id ? null : lead._id);
                      }}
                      className={`px-3 py-1 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider rounded-full border shadow-sm transition-all hover:ring-2 hover:ring-black/5 ${getStatusStyle(
                        lead.followup?.status
                      )}`}
                    >
                      <span>🔄</span>
                      {lead.followup?.status || "New Lead"}
                      <span className="opacity-40 text-[8px]">▼</span>
                    </button>
                    {statusMenuId === lead._id && (
                      <div className="absolute left-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl w-48 z-50 py-2 animate-in fade-in zoom-in duration-200 ring-4 ring-black/5">
                        {["PENDING", "CONTACTED", "INTERESTED", "NOT_INTERESTED", "NOT_REACHABLE", "COMPLETED"].map((s) => (
                          <button
                            key={s}
                            className={`block w-full text-left px-5 py-2.5 text-[11px] font-bold transition ${lead.followup?.status === s
                              ? "bg-teal-50 text-[#1ABC9C]"
                              : "text-gray-600 hover:bg-gray-50"
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(lead._id, s);
                            }}
                          >
                            {s.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewLead(lead._id)}
                    className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-xs font-black hover:bg-teal-700 transition shadow-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-100 rounded-b-xl">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 font-medium">
                Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-bold transition-all ${number === currentPage
                      ? "z-10 bg-teal-600 border-teal-600 text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {number}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
