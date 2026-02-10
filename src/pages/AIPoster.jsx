import React, { useState, useEffect, useRef } from "react";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import {
  Wand2, MapPin, Phone, Download, Image as ImageIcon, RefreshCw, Type,
  LayoutTemplate, CheckCircle2, Sparkles, History, Palette, Zap, Star, Leaf, Crown
} from "lucide-react";

// STYLE PRESETS
const STYLE_PRESETS = [
  { id: "modern", name: "Modern", icon: Zap, prompt: "clean minimalist modern design, white space, sans-serif typography, professional" },
  { id: "vintage", name: "Vintage", icon: Star, prompt: "retro vintage aesthetic, aged paper texture, classic typography, warm sepia tones" },
  { id: "luxury", name: "Luxury", icon: Crown, prompt: "luxury premium elegant design, gold accents, sophisticated, high-end" },
  { id: "bold", name: "Bold", icon: Sparkles, prompt: "bold vibrant high-contrast design, energetic colors, dynamic composition" },
  { id: "natural", name: "Natural", icon: Leaf, prompt: "natural organic earthy design, green tones, eco-friendly aesthetic" },
];

// INDUSTRY TEMPLATES
const INDUSTRY_TEMPLATES = [
  {
    id: "salon",
    name: "💇 Salon/Spa",
    data: {
      prompt: "luxury spa salon poster, soft pink and gold theme, elegant feminine design",
      title: "Elegance Beauty Studio",
      subtitle: "Grand Opening — 30% OFF All Services",
      badge: "Grand Opening",
      location: "Downtown Plaza",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "gym",
    name: "💪 Gym/Fitness",
    data: {
      prompt: "fitness gym poster, energetic bold design, dark background with neon accents",
      title: "POWERHOUSE GYM",
      subtitle: "Transform Your Body — Join Today!",
      badge: "Limited Slots",
      location: "City Center",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "restaurant",
    name: "🍕 Restaurant",
    data: {
      prompt: "restaurant food poster, appetizing warm colors, rustic wooden background",
      title: "Bella Italia",
      subtitle: "Authentic Italian Cuisine — 20% OFF",
      badge: "New Menu",
      location: "Marina Bay",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "realestate",
    name: "🏠 Real Estate",
    data: {
      prompt: "real estate property poster, professional modern design, blue and white theme",
      title: "Dream Homes Realty",
      subtitle: "Luxury Apartments Available Now",
      badge: "Pre-Launch",
      location: "Skyline Heights",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "education",
    name: "🎓 Education",
    data: {
      prompt: "education learning poster, friendly approachable design, bright colors",
      title: "Smart Academy",
      subtitle: "Admissions Open for 2024",
      badge: "Enroll Now",
      location: "Knowledge Park",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "retail",
    name: "🛍️ Retail Sale",
    data: {
      prompt: "retail sale poster, eye-catching promotional design, vibrant red and yellow",
      title: "MEGA SALE",
      subtitle: "Up to 70% OFF Everything!",
      badge: "3 Days Only",
      location: "Mall of Dreams",
      phone: "+91 98765 43210"
    }
  }
];

// DEMO BACKGROUND IMAGES (Unsplash)
const DEMO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&auto=format&fit=crop",
];

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
  const [demoMode, setDemoMode] = useState(false);
  const [posterHistory, setPosterHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const posterRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("posterHistory");
    if (saved) {
      try {
        setPosterHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const applyStylePreset = (preset) => {
    setFormData({ ...formData, prompt: preset.prompt });
  };

  const applyTemplate = (template) => {
    setFormData(template.data);
  };

  // DEMO MODE: Generate poster using Canvas
  const generateDemoPoster = async () => {
    return new Promise((resolve) => {
      // Pick random background
      const bgImage = DEMO_BACKGROUNDS[Math.floor(Math.random() * DEMO_BACKGROUNDS.length)];

      // Create variations by adding different filters/overlays
      const variations = [
        bgImage,
        bgImage + "&sat=-100", // B&W
        bgImage + "&hue=180",  // Color shift
      ];

      resolve(variations);
    });
  };

  async function generatePosters() {
    if (!formData.prompt) return alert("Enter a style prompt");

    setLoading(true);
    setDemoMode(false);

    try {
      // Try API first
      const res = await API.post("/generate-custom-posters", { ...formData });
      setGeneratedImages(res.data.posters || []);
      setSelectedIndex(0);

      // Save to history
      savePosterToHistory(res.data.posters[0]);
    } catch (err) {
      console.warn("API failed, using demo mode", err);

      // Fallback to demo mode
      setDemoMode(true);
      const demoPosters = await generateDemoPoster();
      setGeneratedImages(demoPosters);
      setSelectedIndex(0);

      // Save to history
      savePosterToHistory(demoPosters[0]);
    } finally {
      setLoading(false);
    }
  }

  const savePosterToHistory = (posterUrl) => {
    const newEntry = {
      id: Date.now(),
      url: posterUrl,
      formData: { ...formData },
      timestamp: new Date().toISOString()
    };

    const updated = [newEntry, ...posterHistory].slice(0, 10); // Keep last 10
    setPosterHistory(updated);
    localStorage.setItem("posterHistory", JSON.stringify(updated));
  };

  const loadFromHistory = (entry) => {
    setFormData(entry.formData);
    setGeneratedImages([entry.url]);
    setSelectedIndex(0);
    setShowHistory(false);
  };

  const clearHistory = () => {
    if (window.confirm("Clear all poster history?")) {
      setPosterHistory([]);
      localStorage.removeItem("posterHistory");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">

      {/* SCROLLING MARQUEE HERO */}
      <div className="w-full overflow-hidden bg-slate-900 py-12 mb-8 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>

        <Marquee direction="left" speed={30}>
          {placeholderPosters.map((src, i) => (
            <div key={i} className="mx-4 w-[200px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
              <img src={src} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" alt="Poster Example" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
            </div>
          ))}
        </Marquee>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg text-center px-4">
            AI Poster Studio
          </h1>
          <p className="text-slate-300 mt-2 text-lg font-medium drop-shadow-md">
            Design stunning visuals in seconds
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT PANEL - CONTROLS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-8">
              <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10"></div>

              <div className="p-6 md:p-8 space-y-8">

                {/* STYLE PRESETS */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Palette className="w-5 h-5 text-indigo-500" />
                      <h3>Quick Styles</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => applyStylePreset(preset)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* INDUSTRY TEMPLATES */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <LayoutTemplate className="w-5 h-5 text-indigo-500" />
                      <h3>Industry Templates</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {INDUSTRY_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template)}
                        className="px-3 py-2 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-semibold text-slate-700 hover:text-purple-700 transition-all text-left"
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="w-full h-px bg-slate-100" />

                {/* Visual Style Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                    <Wand2 className="w-5 h-5 text-indigo-500" />
                    <h3>Visual Style</h3>
                  </div>
                  <div className="relative">
                    <textarea
                      name="prompt"
                      className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-sm leading-relaxed"
                      placeholder="Describe your poster style (e.g., 'minimalist gym poster, dark gritty background, neon typography')..."
                      value={formData.prompt}
                      onChange={handleChange}
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100 uppercase tracking-wide">
                      AI Powered
                    </div>
                  </div>
                </section>

                <div className="w-full h-px bg-slate-100" />

                {/* Content Section */}
                <section className="space-y-5">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Type className="w-5 h-5 text-indigo-500" />
                    <h3>Text Content</h3>
                  </div>

                  <div className="space-y-4">
                    <InputGroup label="Main Title" value={formData.title} onChange={handleChange} name="title" placeholder="e.g. Summer Sale" />
                    <InputGroup label="Subtitle / Offer" value={formData.subtitle} onChange={handleChange} name="subtitle" placeholder="e.g. 50% Off Everything" />
                    <InputGroup label="Badge / Tag" value={formData.badge} onChange={handleChange} name="badge" placeholder="e.g. Limited Time" />
                  </div>
                </section>

                <div className="w-full h-px bg-slate-100" />

                {/* Details Section */}
                <section className="space-y-5">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <LayoutTemplate className="w-5 h-5 text-indigo-500" />
                    <h3>Contact Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup
                      icon={<MapPin className="w-4 h-4" />}
                      value={formData.location}
                      onChange={handleChange}
                      name="location"
                      placeholder="City, Area"
                    />
                    <InputGroup
                      icon={<Phone className="w-4 h-4" />}
                      value={formData.phone}
                      onChange={handleChange}
                      name="phone"
                      placeholder="+91..."
                    />
                  </div>
                </section>

                <button
                  onClick={generatePosters}
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-slate-900 text-white rounded-2xl p-4 font-semibold text-lg shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 fill-current" />
                        Generate Poster
                      </>
                    )}
                  </span>
                </button>

                {/* HISTORY BUTTON */}
                {posterHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl p-3 font-semibold text-sm transition-all"
                  >
                    <History className="w-4 h-4" />
                    View History ({posterHistory.length})
                  </button>
                )}

              </div>
            </div>
          </motion.div>

          {/* RIGHT PANEL - PREVIEW */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 lg:sticky lg:top-8"
          >
            <div className="bg-slate-200/50 rounded-[2.5rem] p-8 lg:p-12 border border-slate-200 shadow-inner flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">

              {/* Background Decoration */}
              <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* DEMO MODE BADGE */}
              {demoMode && (
                <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                  Demo Mode
                </div>
              )}

              {generatedImages.length > 0 ? (
                <div className="relative z-10 w-full max-w-md mx-auto space-y-8">

                  {/* MAIN POSTER CARD */}
                  <div ref={posterRef} className="group relative bg-white rounded-2xl shadow-2xl shadow-slate-400/20 overflow-hidden transform transition-all duration-300 hover:shadow-3xl hover:shadow-slate-400/30">
                    <div className="aspect-[4/5] relative bg-slate-100">
                      <img
                        src={generatedImages[selectedIndex]}
                        className="w-full h-full object-cover"
                        alt="Generated Poster"
                      />

                      {/* Overlay Elements */}
                      {formData.badge && (
                        <div className="absolute top-6 left-6">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                            {formData.badge}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-24 text-white">
                        <h2 className="text-3xl font-black leading-tight mb-2 font-display">
                          {formData.title || "Your Title Here"}
                        </h2>
                        {formData.subtitle && (
                          <p className="text-lg font-medium text-white/90 mb-4">{formData.subtitle}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm font-medium text-white/80 border-t border-white/20 pt-4">
                          {formData.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-white" />
                              {formData.location}
                            </span>
                          )}
                          {formData.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-4 h-4 text-white" />
                              {formData.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* THUMBNAILS CAROUSEL */}
                  {generatedImages.length > 1 && (
                    <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {generatedImages.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedIndex(i)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${selectedIndex === i
                            ? "border-indigo-600 ring-2 ring-indigo-600/20 scale-105"
                            : "border-white opacity-60 hover:opacity-100"
                            }`}
                        >
                          <img src={src} className="w-full h-full object-cover" alt={`Variant ${i + 1}`} />
                          {selectedIndex === i && (
                            <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="flex justify-center">
                    <a
                      href={generatedImages[selectedIndex]}
                      download
                      className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download Poster
                    </a>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 z-10">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 mb-6">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Design</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Fill in the details on the left and click Generate to see your AI-crafted posters here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* HISTORY MODAL */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-6 h-6 text-indigo-500" />
                  Poster History
                </h2>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] grid grid-cols-2 md:grid-cols-3 gap-4">
                {posterHistory.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => loadFromHistory(entry)}
                    className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <img src={entry.url} className="w-full h-full object-cover" alt="History" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Load
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------- COMPONENTS -------------------

function Marquee({ children, direction = "left", speed = 20 }) {
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

function InputGroup({ label, icon, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
}

const placeholderPosters = [
  "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1558655146-d09347e0b7a8?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=60",
];
