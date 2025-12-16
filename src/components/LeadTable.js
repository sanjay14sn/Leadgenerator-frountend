// src/components/LeadTable.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * LeadTable Component
 * Renders a table of leads in a CRM style with pagination controls.
 * @param {object[]} leads - Array of lead objects for the current page.
 * @param {function} [onFollowUp] - Function to call for the "Follow-up" action.
 * @param {number} totalItems - Total count of all leads (for calculating pages).
 * @param {number} itemsPerPage - Number of items to show per page.
 * @param {number} currentPage - The current page number (1-indexed).
 * @param {function} onPageChange - Function to call when a page number is clicked.
 */
export default function LeadTable({
  leads,
  onFollowUp,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const navigate = useNavigate();

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = [];
  // Show 1, 2, ..., totalPages - 1, totalPages (or a limited set)
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Helper function to extract a cleaner location name (unchanged)
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

  // Helper to determine status color (unchanged)
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
    <div className="rounded-xl shadow-lg border border-gray-200">
      <div className="overflow-x-auto">
        {/* Table Content (same as before) */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              <tr key={lead._id} className="hover:bg-gray-50">
                {/* Lead Name */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {lead.name || "N/A"}
                </td>

                {/* Category / Location */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="font-medium">{lead.category || "N/A"}</div>
                  <div className="text-xs text-gray-500">
                    {getLocality(lead.address)}
                  </div>
                </td>

                {/* Score */}
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-bold text-teal-600">
                  {lead.lead_score || 0}
                </td>

                {/* Website Exists */}
                <td className="px-3 py-4 whitespace-nowrap text-center">
                  <span role="img" aria-label="website-status">
                    {lead.hasWebsite ? "🌐 Yes" : "❌ No"}
                  </span>
                </td>

                {/* WhatsApp Available */}
                <td className="px-3 py-4 whitespace-nowrap text-center">
                  <span role="img" aria-label="whatsapp-status">
                    {lead.whatsapp ? "✅ Yes" : "⛔ No"}
                  </span>
                </td>

                {/* Pipeline Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(
                      lead.followup?.status
                    )}`}
                  >
                    {lead.followup?.status || "New Lead"}
                  </span>
                </td>

                {/* Actions (CRM Style) */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onFollowUp && (
                    <button
                      onClick={() => onFollowUp(lead._id)}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold mr-3 transition"
                    >
                      Follow-up
                    </button>
                  )}

                  {/* Mandatory View Button */}
                  <button
                    onClick={() => handleViewLead(lead._id)}
                    className="bg-[#1ABC9C] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-teal-700 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  {/* Heroicon: chevron-left */}
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page Number Buttons */}
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    aria-current={number === currentPage ? "page" : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      number === currentPage
                        ? "z-10 bg-[#1ABC9C] border-[#1ABC9C] text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  {/* Heroicon: chevron-right */}
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      {/* --- END PAGINATION CONTROLS --- */}
    </div>
  );
}
