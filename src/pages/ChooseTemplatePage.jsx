import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, Loader2, Globe, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";

export default function ChooseTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lead, setLead] = useState(null);

  useEffect(() => {
    loadLead();
  }, [id]);

  async function loadLead() {
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data);
    } catch (err) {
      console.error("Error loading lead:", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            The Future of your <span className="text-[#1ABC9C]">Digital Presence</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Launch a premium, AI-powered website in seconds or manage your existing live presence.
          </p>
        </div>

        {/* --- TEMPLATE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* AI Design Option Card */}
          <div
            className="group bg-gradient-to-br from-[#1ABC9C] via-emerald-600 to-teal-700 rounded-[2.5rem] overflow-hidden border border-transparent hover:shadow-2xl transition-all duration-500 relative flex flex-col justify-between p-1 shadow-xl shadow-teal-500/10 min-h-[400px]"
          >
            <div className="p-10 text-white relative z-10">
              <div className="bg-white/20 backdrop-blur-xl w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 ring-1 ring-white/30 group-hover:scale-110 transition-transform shadow-lg">
                <Sparkles className="text-white w-9 h-9" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">AI Instant Website</h3>
              <p className="text-teal-50/80 text-base font-medium leading-relaxed">
                Generate a complete, personalized single-page website in seconds using the power of AI.
              </p>
            </div>

            <div className="p-10 mt-auto relative z-10">
              <button
                disabled={isAiLoading}
                onClick={() => {
                  setIsAiLoading(true);
                  setTimeout(() => navigate(`/leads/${id}/ai-builder`), 1000);
                }}
                className="w-full bg-white text-[#1ABC9C] px-8 py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:bg-teal-50 transition-all shadow-xl active:scale-95 disabled:opacity-80"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    Create with AI <Sparkles size={20} className="fill-current" />
                  </>
                )}
              </button>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
              <Sparkles size={200} />
            </div>
          </div>

          {/* LIVE WEBSITE CARD (Show only if lead has web_url) */}
          {lead?.web_url && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 hover:border-[#1ABC9C] hover:shadow-2xl transition-all duration-500 relative shadow-xl shadow-slate-200/50 flex flex-col min-h-[400px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 group border-b border-slate-100 italic">
                {/* Iframe for a small preview */}
                <iframe
                  src={lead.web_url}
                  title="Live Preview"
                  className="w-full h-full border-none pointer-events-none transform scale-[1] origin-top transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6">
                  <button
                    onClick={() => window.open(lead.web_url, '_blank')}
                    className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transform translate-y-6 group-hover:translate-y-0 transition-transform shadow-2xl hover:scale-105 active:scale-95"
                  >
                    Visit Live Site <Globe size={18} className="text-[#1ABC9C]" />
                  </button>
                </div>

                {/* Live Badge */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-emerald-500/30">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Live Now
                  </div>
                </div>
              </div>

              <div className="p-8 flex justify-between items-center mt-auto bg-white">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-[#1ABC9C] uppercase tracking-[0.25em] mb-2">Published Masterpiece</p>
                  <h3 className="font-black text-2xl text-slate-900 truncate tracking-tight">{lead.name || "Business Site"}</h3>
                  <div className="flex items-center gap-2 mt-3 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Globe size={14} className="text-slate-400" />
                    <span className="text-[11px] font-bold truncate lowercase font-mono tracking-tight text-slate-500">
                      {lead.web_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => window.open(lead.web_url, '_blank')}
                  className="ml-4 p-4 rounded-[1.25rem] bg-slate-50 text-slate-400 hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C] transition-all transform hover:rotate-12"
                >
                  <Rocket size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}