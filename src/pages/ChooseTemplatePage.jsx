import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TEMPLATE_LIST } from "./templates/templateRegistry";
import { ArrowLeft, Layout, Sparkles, Monitor, Smartphone, Eye } from "lucide-react";

export default function ChooseTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Business", "Portfolio", "Medical", "Education"];

  const filteredTemplates = activeCategory === "All" 
    ? TEMPLATE_LIST 
    : TEMPLATE_LIST.filter(t => t.category === activeCategory);

  function handleSelect(templateKey) {
    navigate(`/leads/${id}/edit?template=${templateKey}`);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors gap-2 font-medium"
        >
          <ArrowLeft size={20} /> Back to Lead
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-gray-800">AI Template Engine</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Select a Professional <span className="text-teal-600">Blueprint</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our AI-optimized templates are designed to maximize conversion rates and look stunning on every device.
          </p>
        </div>

        {/* --- CATEGORY TABS --- */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat 
                ? "bg-gray-900 text-white shadow-lg shadow-gray-200" 
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- TEMPLATE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.key}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 relative"
            >
              {/* Image Container with Hover Overlay */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={tpl.preview || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800`}
                  alt={tpl.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    onClick={() => handleSelect(tpl.key)}
                    className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                   >
                     Select Template <Layout size={18}/>
                   </button>
                </div>
                {/* Device Badges */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                   <div className="bg-white/90 backdrop-blur px-2 py-1 rounded md text-[10px] font-bold text-gray-700 flex items-center gap-1">
                      <Monitor size={12}/> Desktop
                   </div>
                   <div className="bg-white/90 backdrop-blur px-2 py-1 rounded md text-[10px] font-bold text-gray-700 flex items-center gap-1">
                      <Smartphone size={12}/> Mobile
                   </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex justify-between items-center bg-white border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Premium Template</p>
                  <h3 className="font-bold text-xl text-gray-900">{tpl.name}</h3>
                </div>
                <button 
                  onClick={() => handleSelect(tpl.key)}
                  className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors"
                >
                  <Eye size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}