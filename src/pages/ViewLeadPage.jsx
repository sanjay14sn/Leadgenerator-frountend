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
  const [publishing, setPublishing] = useState(false);  // ⭐ NEW

  /* ---------------------------------------
      LOAD LEAD
  ---------------------------------------- */
  useEffect(() => {
    async function loadLead() {
      try {
        const res = await API.get(`/leads/${id}`);

        const processedLead = {
          name: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          category: res.data.category || "",
          rating: res.data.rating || 0,
          reviews: res.data.reviews || 0,
          gmap_link: res.data.gmap_link || "",
          images: res.data.images || [],
          thumbnail: res.data.thumbnail || "",
          generated_images: res.data.generated_images || [],

          hero_title: res.data.hero_title || "",
          hero_subtitle: res.data.hero_subtitle || "",
          description: res.data.description || "",
          cta_title: res.data.cta_title || "",
          cta_button: res.data.cta_button || "",
          testimonials: res.data.testimonials || [],

          web_url: res.data.web_url || "",  // ⭐ NEW
        };

        setLead(processedLead);
      } catch (err) {
        console.error("Error loading lead:", err);
      }
    }

    loadLead();
  }, [id]);

  if (!lead) return <p className="p-8">Loading…</p>;

  /* ---------------------------------------
      AI Enhance Button
  ---------------------------------------- */
  async function handleAIEnhance() {
    try {
      setLoadingAI(true);
      const response = await API.post("/ai/enhance", { lead });
      const ai = response.data.enhanced;

      setLead((prev) => ({ ...prev, ...ai }));
      alert("✨ AI Enhanced Content Applied!");
    } catch (err) {
      console.error(err);
      alert("AI Enhancement Failed");
    } finally {
      setLoadingAI(false);
    }
  }

  /* ---------------------------------------
      SAVE CHANGES ONLY
  ---------------------------------------- */
  async function handleSave() {
    try {
      await API.patch(`/leads/${id}`, lead);
      alert("Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving changes");
    }
  }

  /* ---------------------------------------
      STEP 6 — PUBLISH STATIC WEBSITE
  ---------------------------------------- */
  async function handlePublish() {
    try {
      setPublishing(true);

      // 🔥 call backend to publish
      const res = await API.post(`/deploy/publish/${id}`);

      // backend returns:  { url: "https://something.netlify.app" }
      setLead((prev) => ({ ...prev, web_url: res.data.url }));

      alert("🚀 Published Successfully!");
    } catch (err) {
      console.error(err);
      alert("Publishing failed");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FBF9] flex flex-col">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-white">View Lead</h1>

        <div className="flex gap-3">
          <button onClick={() => navigate("/all-leads")} className="bg-white/20 text-white px-4 py-2 rounded-xl">
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

      {/* MAIN LAYOUT */}
      <div className="flex flex-1">

        {/* LEFT: TEMPLATE PREVIEW */}
        <div
          className={`h-screen overflow-auto border-r transition-all duration-300 ${
            templateFull ? "w-full" : "w-1/2"
          }`}
        >
          {(() => {
            const TemplateComponent = getTemplateByCategory(lead.category);
            return <TemplateComponent lead={lead} />;
          })()}
        </div>

        {/* RIGHT: EDIT PANEL */}
        {!templateFull && (
          <div className="w-1/2 h-screen overflow-auto p-8 bg-gray-50">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Lead</h2>

              <button
                onClick={handleAIEnhance}
                disabled={loadingAI}
                className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-xl shadow disabled:opacity-60"
              >
                {loadingAI ? "Enhancing…" : "✨ AI Enhance"}
              </button>
            </div>

            {/* FORM */}
            <div className="flex flex-col gap-4">
              <input className="border p-3 rounded" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="Business Name" />
              <input className="border p-3 rounded" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="Phone" />
              <input className="border p-3 rounded" value={lead.address} onChange={(e) => setLead({ ...lead, address: e.target.value })} placeholder="Address" />
              <input className="border p-3 rounded" value={lead.category} onChange={(e) => setLead({ ...lead, category: e.target.value })} placeholder="Category" />

              <textarea className="border p-3 rounded" value={lead.hero_title} onChange={(e) => setLead({ ...lead, hero_title: e.target.value })} placeholder="Hero Title" />
              <textarea className="border p-3 rounded" value={lead.hero_subtitle} onChange={(e) => setLead({ ...lead, hero_subtitle: e.target.value })} placeholder="Hero Subtitle" />
              <textarea className="border p-3 rounded h-32" value={lead.description} onChange={(e) => setLead({ ...lead, description: e.target.value })} placeholder="Business Description" />

              <input className="border p-3 rounded" value={lead.cta_title} onChange={(e) => setLead({ ...lead, cta_title: e.target.value })} placeholder="CTA Title" />
              <input className="border p-3 rounded" value={lead.cta_button} onChange={(e) => setLead({ ...lead, cta_button: e.target.value })} placeholder="CTA Button" />

              {/* SAVE CHANGES */}
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
              >
                Save Changes
              </button>

              {/* PUBLISH BUTTON */}
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="bg-purple-700 text-white px-6 py-3 rounded-xl shadow hover:bg-purple-800 disabled:opacity-60"
              >
                {publishing ? "🚀 Publishing..." : "Publish Website"}
              </button>

              {/* SHOW PUBLISHED URL */}
              {lead.web_url && (
                <a
                  href={lead.web_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-lg mt-3"
                >
                  🔗 View Live Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLeadPage;
