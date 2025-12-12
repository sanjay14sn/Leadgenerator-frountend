// src/pages/ViewLeadPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { getTemplateByCategory } from "./templates/templateRegistry";

function ViewLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [templateFull, setTemplateFull] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  /* ------------------------------ LOAD LEAD ------------------------------ */
  useEffect(() => {
    loadLead();
    // eslint-disable-next-line
  }, [id]);

  async function loadLead() {
    try {
      const res = await API.get(`/leads/${id}`); // ✅ FIXED (no /api)
      setLead(res.data);
    } catch (err) {
      console.error("Error loading lead:", err);
      alert("Failed to load lead.");
    }
  }

  /* ------------------------------ AI ENHANCE ------------------------------ */
  async function handleAIEnhance() {
    try {
      setLoadingAI(true);

      const response = await API.post(`/ai/enhance`, { lead }); // ✅ FIXED

      if (response?.data?.enhanced) {
        setLead((prev) => ({ ...prev, ...response.data.enhanced }));
        alert("✨ AI Enhanced!");
      }
    } catch (err) {
      console.error(err);
      alert("AI failed");
    }
    setLoadingAI(false);
  }

  /* ------------------------------ SAVE LEAD ------------------------------ */
  async function handleSave() {
    try {
      await API.patch(`/leads/${id}`, lead); // ✅ FIXED
      alert("Saved!");
      loadLead();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  /* ------------------------------ PUBLISH ------------------------------ */
  async function handlePublish() {
    try {
      setPublishing(true);

      // 1️⃣ Publish website
      const res = await API.post(`/deploy/publish/${id}`); // ✅ FIXED
      const url = res?.data?.url;
      if (url) setLead((prev) => ({ ...prev, web_url: url }));

      // 2️⃣ Log WhatsApp
      await API.post(`/leads/${id}/whatsapp-log`); // ✅ FIXED

      // 3️⃣ Open WhatsApp redirect
      // window.open(`http://localhost:5009/api/leads/w/${id}`, "_blank");

      // 4️⃣ Navigate to follow-up page
      navigate(`/followup/${id}`);

    } catch (err) {
      console.error(err);
      alert("Publishing failed");
    } finally {
      setPublishing(false);
    }
  }

  /* ------------------------------ MANUAL WHATSAPP ------------------------------ */
  async function handleWhatsAppManual() {
    try {
      setWhatsappLoading(true);

      await API.post(`/leads/${id}/whatsapp-log`); // ✅ FIXED
      // window.open(`http://localhost:5009/api/leads/w/${id}`, "_blank");

      navigate(`/followup/${id}`);
    } catch (err) {
      console.error(err);
      alert("WhatsApp failed");
    } finally {
      setWhatsappLoading(false);
    }
  }

  if (!lead) return <p className="p-8">Loading…</p>;

  const fields = ["name", "phone", "address", "category", "cta_title", "cta_button"];

  return (
    <div className="min-h-screen bg-[#F9FBF9] flex flex-col">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-white">View Lead</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/all-leads")}
            className="bg-white/20 text-white px-4 py-2 rounded-xl"
          >
            ← Back
          </button>

          <button
            onClick={() => setTemplateFull(!templateFull)}
            className="bg-white text-teal-600 px-4 py-2 rounded-xl font-semibold shadow"
          >
            {templateFull ? "Split View" : "Full Template View"}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex flex-1">

        {/* TEMPLATE PREVIEW */}
        <div
          className={`h-screen overflow-auto border-r transition-all duration-300 ${
            templateFull ? "w-full" : "w-1/2"
          }`}
        >
          {(() => {
            const Template = getTemplateByCategory(lead.category);
            return <Template lead={lead} />;
          })()}
        </div>

        {/* EDIT PANEL */}
        {!templateFull && (
          <div className="w-1/2 h-screen overflow-auto p-8 bg-gray-50">
            
            <h2 className="text-2xl font-bold mb-6">Edit Lead</h2>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAIEnhance}
                disabled={loadingAI}
                className="bg-purple-600 text-white px-5 py-2 rounded-xl"
              >
                {loadingAI ? "Enhancing…" : "✨ AI Enhance"}
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl"
              >
                Save
              </button>
            </div>

            {fields.map((field) => (
              <input
                key={field}
                className="border p-3 rounded mb-3"
                value={lead[field] || ""}
                onChange={(e) => setLead({ ...lead, [field]: e.target.value })}
                placeholder={field}
              />
            ))}

            <textarea
              className="border p-3 rounded mb-3"
              value={lead.hero_title || ""}
              onChange={(e) => setLead({ ...lead, hero_title: e.target.value })}
              placeholder="Hero Title"
            />

            <textarea
              className="border p-3 rounded mb-3"
              value={lead.hero_subtitle || ""}
              onChange={(e) => setLead({ ...lead, hero_subtitle: e.target.value })}
              placeholder="Hero Subtitle"
            />

            <textarea
              className="border p-3 rounded mb-3 h-32"
              value={lead.description || ""}
              onChange={(e) => setLead({ ...lead, description: e.target.value })}
              placeholder="Description"
            />

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="bg-purple-700 text-white px-6 py-3 rounded-xl"
              >
                {publishing ? "Publishing…" : "Publish Website"}
              </button>

              <button
                onClick={handleWhatsAppManual}
                disabled={whatsappLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                {whatsappLoading ? "Sending…" : "WhatsApp"}
              </button>
            </div>

            {lead.web_url && (
              <a
                href={lead.web_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline mt-4 block"
              >
                🔗 View Live Website
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLeadPage;
