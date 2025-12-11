import React, { useEffect, useState } from "react";
import { checkWhatsApp } from "../utils/checkWhatsApp";
import { updateLeadInDB } from "../utils/updateLead";
import { useNavigate } from "react-router-dom";

// CLEAN AREA + CITY EXTRACTOR
function formatAddress(address = "") {
  if (!address) return "";

  const parts = address.split(",").map((p) => p.trim());
  const area = parts[parts.length - 3] || parts[0] || "";
  const city = parts[parts.length - 2] || "";
  return city ? `${area}, ${city}` : area;
}

function LeadTable({ leads = [] }) {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const navigate = useNavigate();

  // AUTO ENRICH
  useEffect(() => {
    async function enrichLead(lead) {
      if (!lead.phone) return;

      const wa = await checkWhatsApp(lead.phone);

      await updateLeadInDB(lead._id, {
        whatsapp: wa,
      });
    }

    leads.forEach((lead) => enrichLead(lead));
  }, [leads]);

  // SORT BY SCORE
  const sorted = [...leads].sort(
    (a, b) => (b.lead_score || 0) - (a.lead_score || 0)
  );

  // PAGINATION
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  if (!Array.isArray(leads) || leads.length === 0) {
    return (
      <p className="text-gray-600 mt-4 text-lg">
        No leads yet. Enter details above and click <strong>Scrape</strong>.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">

      {/* ================= TABLE ================= */}
      <table className="w-full border-collapse text-sm">

        {/* ---------- HEADER ---------- */}
        <thead className="bg-gray-100 text-left text-gray-700 font-semibold">
          <tr>
            <th className="p-3">Business</th>
            <th className="p-3">Category</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Website</th>
            <th className="p-3">WhatsApp</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Score</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        {/* ---------- BODY ---------- */}
        <tbody>
          {paginated.map((lead) => (
            <tr key={lead._id} className="border-b hover:bg-gray-50 transition">

              {/* BUSINESS */}
              <td className="p-3 font-semibold text-gray-900">
                {lead.name}
                <div className="text-xs text-gray-500">
                  {formatAddress(lead.address)}
                </div>
              </td>

              {/* ⭐ RESPONSIVE CATEGORY BADGE */}
              <td className="p-3">
                <span
                  className="
                    inline-flex 
                    items-center 
                    whitespace-nowrap 
                    px-2 py-1 
                    rounded-full 
                    bg-blue-100 
                    text-blue-700 
                    font-semibold 
                    text-xs 
                    max-w-[120px]
                    overflow-hidden 
                    text-ellipsis
                  "
                >
                  {lead.category || "—"}
                </span>
              </td>

              {/* PHONE */}
              <td className="p-3">
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-blue-600 underline"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">No phone</span>
                )}
              </td>

              {/* WEBSITE */}
              <td className="p-3">
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 underline"
                  >
                    Yes
                  </a>
                ) : (
                  <span className="text-red-500 font-semibold">No Website</span>
                )}
              </td>

              {/* WHATSAPP */}
              <td className="p-3">
                {lead.whatsapp ? (
                  <span className="text-green-600 font-bold">✓</span>
                ) : (
                  <span className="text-red-500 font-bold">✗</span>
                )}
              </td>

              {/* RATING */}
              <td className="p-3">
                ⭐ {lead.rating || "—"}
                <div className="text-xs text-gray-500">
                  {lead.reviews} reviews
                </div>
              </td>

              {/* SCORE */}
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    (lead.lead_score || 0) >= 80
                      ? "bg-green-600"
                      : (lead.lead_score || 0) >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {lead.lead_score ?? 0}
                </span>
              </td>

              {/* DATE */}
              <td className="p-3 text-gray-700">
                {lead.createdAt
                  ? new Date(lead.createdAt).toLocaleDateString("en-IN")
                  : "—"}
              </td>

              {/* ACTIONS */}
              <td className="p-3">
                <button
                  onClick={() => navigate(`/view/${lead._id}`)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs"
                >
                  View
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

      {/* ================= PAGINATION ================= */}
      <div className="flex gap-3 justify-end mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
        >
          Prev
        </button>

        <button
          disabled={page * perPage >= leads.length}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default LeadTable;
