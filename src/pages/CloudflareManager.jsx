// src/pages/CloudflareManager.jsx

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function CloudflareManager() {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    try {
      setLoading(true);
      const res = await API.get("/sites");   
      setSites(res.data || []);
    } catch (err) {
      console.error("Failed to load Cloudflare sites", err);
      alert("Error loading Cloudflare sites");
    } finally {
      setLoading(false);
    }
  }

  async function deleteOne(key) {
    if (!window.confirm(`Delete website: ${key}?`)) return;

    try {
      await API.delete(`/sites/${key}`);    
      setSites((prev) => prev.filter((s) => s.key !== key));
      setSelected((prev) => prev.filter((k) => k !== key));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function bulkDelete() {
    if (selected.length === 0) return alert("No items selected");

    if (!window.confirm(`Delete ${selected.length} websites?`)) return;

    try {
      await API.delete("/sites", {          
        data: { keys: selected }
      });

      setSites((prev) => prev.filter((s) => !selected.includes(s.key)));
      setSelected([]);
      alert("Bulk delete completed");
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed");
    }
  }

  function toggleSelect(key) {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBF9]">

      <nav className="px-6 py-4 flex justify-between items-center shadow-md sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-bold text-[#1ABC9C]">Cloudflare Manager</h1>

        <button
          onClick={() => navigate("/")}
          className="bg-[#1ABC9C] text-white px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            All Published Websites ({sites.length})
          </h2>

          <button
            onClick={bulkDelete}
            disabled={selected.length === 0 || loading}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              selected.length === 0 || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Delete Selected ({selected.length})
          </button>
        </div>

        <div className="bg-white rounded-xl shadow border">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-3 text-left">Select</th>
                <th className="p-3 text-left">Website Key</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">Loading...</td>
                </tr>
              ) : sites.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No websites found
                  </td>
                </tr>
              ) : (
                sites.map((item) => (
                  <tr key={item.key} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.key)}
                        onChange={() => toggleSelect(item.key)}
                      />
                    </td>

                    <td className="p-3 font-medium">{item.key}</td>
                    <td className="p-3 text-gray-600">{item.phone || "—"}</td>

                    <td className="p-3">
                      <button
                        onClick={() => deleteOne(item.key)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default CloudflareManager;