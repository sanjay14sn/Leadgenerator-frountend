import React, { useState } from "react";
import API from "../api/api";

export default function AIPosterStudio() {
  const [formData, setFormData] = useState({
    prompt: "luxury modern salon poster background, soft lighting, gold theme",
    title: "Elegance Beauty Studio",
    subtitle: "Grand Opening — 30% OFF",
    badge: "Grand Opening",
    location: "Anna Nagar, Chennai",
    phone: "+91 98765 43210",
  });

  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function generatePosters() {
    if (!formData.prompt) return alert("Enter a style prompt");

    setLoading(true);
    try {
      const res = await API.post("/generate-custom-posters", { ...formData });
      setGeneratedImages(res.data.posters || []);
      setSelectedIndex(0);
    } catch (err) {
      console.error(err);
      alert("Poster generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT PANEL */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🎨 AI Poster Studio
            </h2>

            <div className="space-y-4">

              {/* PROMPT */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Style Prompt
                </label>
                <textarea
                  name="prompt"
                  className="w-full mt-1 border border-gray-200 p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none h-24"
                  value={formData.prompt}
                  onChange={handleChange}
                />
              </div>

              {/* TEXT FIELDS */}
              <div className="grid grid-cols-1 gap-4 pt-2 border-t border-gray-100">

                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Overlay Content
                </label>

                <input name="title" className="border p-3 rounded-xl"
                  placeholder="Title / Business Name"
                  value={formData.title}
                  onChange={handleChange}
                />

                <input name="subtitle" className="border p-3 rounded-xl"
                  placeholder="Subtitle / Offer"
                  value={formData.subtitle}
                  onChange={handleChange}
                />

                <input name="badge" className="border p-3 rounded-xl"
                  placeholder="Badge (optional — e.g., Admission Open / 50% OFF)"
                  value={formData.badge}
                  onChange={handleChange}
                />

                <input name="location" className="border p-3 rounded-xl"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />

                <input name="phone" className="border p-3 rounded-xl"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <button
                onClick={generatePosters}
                disabled={loading}
                className="w-full bg-[#1ABC9C] text-white py-4 rounded-xl font-bold hover:bg-teal-700 shadow-lg transition disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? "⏳ Generating…" : "✨ Generate Posters"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — PREVIEW */}
        <div className="w-full lg:w-2/3">
          
          {generatedImages.length > 0 ? (
            <div className="space-y-6">

              {/* MAIN PREVIEW */}
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-white aspect-square max-w-[512px] mx-auto">

                <img src={generatedImages[selectedIndex]} className="w-full h-full object-cover" />

                {/* BADGE */}
                {formData.badge && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow">
                    {formData.badge}
                  </div>
                )}

                {/* FOOTER CARD */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="bg-white/95 rounded-2xl p-4 shadow-lg">

                    <h3 className="text-xl font-black text-gray-900 text-center">
                      {formData.title || "Business Title"}
                    </h3>

                    {formData.subtitle && (
                      <p className="text-center mt-1 text-gray-700 font-medium">
                        {formData.subtitle}
                      </p>
                    )}

                    <div className="flex justify-between mt-2 text-sm">
                      {formData.location && <span>📍 {formData.location}</span>}
                      {formData.phone && <span>📞 {formData.phone}</span>}
                    </div>

                  </div>
                </div>
              </div>

              {/* THUMBNAIL SELECTOR */}
              <div className="flex justify-center gap-4">
                {generatedImages.map((src, i) => (
                  <button key={i} onClick={() => setSelectedIndex(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      selectedIndex === i ? "border-teal-500 scale-110" : "opacity-60"
                    }`}
                  >
                    <img src={src} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex justify-center">
                <a href={generatedImages[selectedIndex]} download className="bg-black text-white px-8 py-3 rounded-full">
                  📥 Download
                </a>
              </div>
            </div>
          ) : (
            <div className="h-[512px] border-2 border-dashed rounded-3xl flex flex-col justify-center items-center text-gray-500">
              🖼️ Your posters will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
