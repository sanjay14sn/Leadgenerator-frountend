import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Wand2, Rocket, CheckCircle2, ArrowRight,
    Loader2, Zap, Globe, Layout, Palette, ShieldCheck,
    Stars, Code2, Monitor, RefreshCw, ChevronLeft, Smartphone
} from "lucide-react";
import API from "../api/api";

const STEPS = [
    { id: 1, text: "Analyzing Business DNA", icon: Globe, color: "text-[#1ABC9C]" },
    { id: 2, text: "Synthesizing AI Blueprint", icon: Zap, color: "text-emerald-400" },
    { id: 3, text: "Generating Premium Content", icon: Palette, color: "text-[#1ABC9C]" },
    { id: 4, text: "Optimizing for Conversion", icon: Layout, color: "text-teal-400" },
    { id: 5, text: "Polishing Glossy Interface", icon: Stars, color: "text-emerald-500" },
];

const STYLES = [
    { id: 'minimal', name: 'Minimalist', desc: 'Clean, airy, and focused', icon: Layout },
    { id: 'luxury', name: 'Luxury', desc: 'Elegant, serif-driven, premium', icon: ShieldCheck },
    { id: 'tech', name: 'Futuristic', desc: 'Gradients and glassmorphism', icon: Rocket },
    { id: 'bold', name: 'High Contrast', desc: 'Dark mode and neon accents', icon: Zap },
];

const PALETTES = [
    { id: 'emerald', name: 'Emerald', colors: ['#1ABC9C', '#10b981'] },
    { id: 'ocean', name: 'Ocean', colors: ['#3b82f6', '#8b5cf6'] },
    { id: 'midnight', name: 'Midnight', colors: ['#0f172a', '#f59e0b'] },
    { id: 'sunset', name: 'Sunset', colors: ['#f43f5e', '#fb923c'] },
];

export default function AIWebsiteBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const [instructions, setInstructions] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(null);
    const [activeTab, setActiveTab] = useState("preview"); // 'preview' | 'code'
    const [selectedStyle, setSelectedStyle] = useState("minimal");
    const [selectedPalette, setSelectedPalette] = useState("emerald");
    const [previewDevice, setPreviewDevice] = useState("desktop"); // desktop | mobile
    const [error, setError] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPublishSuccess, setShowPublishSuccess] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState("");

    useEffect(() => {
        loadLead();
    }, [id]);

    useEffect(() => {
        if (lead && !generatedCode && isGenerating) {
            handleGenerate();
        }
    }, [lead, isGenerating, generatedCode]);

    async function loadLead() {
        try {
            const res = await API.get(`/leads/${id}`);
            const loadedLead = {
                ...res.data,
                capabilities: res.data.capabilities || [
                    { title: "Premium Quality", desc: "Always delivering the best.", icon: "⭐" },
                    { title: "Fast Delivery", desc: "Quick and efficient service.", icon: "⚡" },
                    { title: "Customer Support", desc: "Always there for our clients.", icon: "📞" },
                    { title: "Affordable Pricing", desc: "Growth shouldn't break the bank.", icon: "💰" },
                ],
                generated_images: res.data.generated_images || [],
            };
            setLead(loadedLead);
        } catch (err) {
            console.error("Error loading lead:", err);
        }
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedCode(null);

        let step = 0;
        const interval = setInterval(() => {
            if (step < STEPS.length - 1) {
                step++;
                setCurrentStep(step);
            } else {
                clearInterval(interval);
            }
        }, 1800);

        try {
            const finalInstructions = `Style: ${selectedStyle}. Palette: ${selectedPalette}. ${instructions}`;
            // Updated to match ViewLeadPage: only send lead
            await API.post(`/ai/enhance`, { lead });
            const res = await API.post(`/ai/generate-site-code`, { id, lead, instructions: finalInstructions });
            setGeneratedCode(res.data);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsComplete(true);
            clearInterval(interval);
        } catch (err) {
            console.error("AI Generation failed:", err);
            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(errorMessage);
            setIsGenerating(false);
            clearInterval(interval);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        console.log("🚀 Starting publish for ID:", id);
        try {
            const res = await API.patch(`/deploy/${id}/publish`);
            console.log("📨 Publish Response received:", res.data);
            if (res.data.success) {
                setPublishedUrl(res.data.web_url);
                setShowPublishSuccess(true);
            }
        } catch (err) {
            console.error("🔥 Publish failed error details:", err);
            const errMsg = err.response?.data?.message || err.message;
            alert(`Failed to publish website: ${errMsg}`);
        } finally {
            setIsPublishing(false);
        }
    };


    // --- PREVIEW & CODE MODE ---
    if (isComplete && generatedCode) {
        return (
            <div className="flex flex-col h-screen bg-slate-50 text-slate-600">
                {/* Top Navigation Bar */}
                <header className="h-16 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setIsComplete(false)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="truncate max-w-[300px]">
                            <h2 className="text-sm font-bold text-slate-900 leading-none truncate">AI Previewer</h2>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1 truncate">
                                {lead?.name || "Premium Design"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "preview" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
                        >
                            <Monitor size={14} /> Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "code" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
                        >
                            <Code2 size={14} /> Source
                        </button>
                    </div>

                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <button
                            onClick={() => handleGenerate()}
                            className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#1ABC9C] transition-colors px-3"
                        >
                            <RefreshCw size={14} /> Regenerate
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="bg-[#1ABC9C] hover:bg-teal-500 text-white px-5 py-2 rounded-full font-black text-xs hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                        >
                            {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
                            Publish Website
                        </button>
                    </div>
                </header>

                {/* Main Content Workspace */}
                <main className="flex-1 overflow-hidden p-4 md:p-8 relative">
                    <AnimatePresence mode="wait">
                        {activeTab === "preview" ? (
                            <motion.div
                                key="preview-pane"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="w-full h-full max-w-6xl mx-auto flex flex-col items-center"
                            >
                                {/* Device Switcher */}
                                <div className="mb-4 flex bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                                    <button
                                        onClick={() => setPreviewDevice("desktop")}
                                        className={`p-2 px-4 rounded-full text-[10px] font-bold flex items-center gap-2 transition-all ${previewDevice === "desktop" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
                                    >
                                        <Monitor size={14} /> Desktop
                                    </button>
                                    <button
                                        onClick={() => setPreviewDevice("mobile")}
                                        className={`p-2 px-4 rounded-full text-[10px] font-bold flex items-center gap-2 transition-all ${previewDevice === "mobile" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"}`}
                                    >
                                        <Smartphone size={14} /> Mobile
                                    </button>
                                </div>

                                {/* Browser Chrome */}
                                <div className={`flex flex-col flex-1 transition-all duration-500 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 ${previewDevice === "mobile" ? "max-w-[375px] w-full" : "w-full"}`}>
                                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-3">
                                        <div className="flex gap-1.5 shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
                                        </div>
                                        <div className="flex-1 bg-white rounded-lg py-1 px-4 text-[10px] text-slate-400 font-mono flex items-center gap-2 border border-slate-100 truncate shadow-inner">
                                            <Globe size={10} className="text-[#1ABC9C]" />
                                            <span className="truncate">https://{(lead?.name || "preview").toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}.preview.ai</span>
                                        </div>
                                    </div>
                                    {/* Iframe Content */}
                                    <div className="flex-1 relative">
                                        <iframe
                                            title="Preview"
                                            className="w-full h-full"
                                            srcDoc={`
                                            <html>
                                                <head>
                                                    <style>${generatedCode.css}</style>
                                                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                                                    <style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap'); body { font-family: 'Plus Jakarta Sans', sans-serif; margin:0; padding:0; }</style>
                                                </head>
                                                <body>${generatedCode.html}</body>
                                            </html>
                                        `}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="code-pane"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-w-7xl mx-auto"
                            >
                                <CodeBlock title="index.html" code={generatedCode.html} lang="HTML" color="text-teal-600" />
                                <CodeBlock title="styles.css" code={generatedCode.css} lang="CSS" color="text-blue-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* SUCCESS MODAL */}
                    <AnimatePresence>
                        {showPublishSuccess && (
                            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl ring-1 ring-slate-200"
                                >
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} className="animate-in zoom-in duration-500" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Live and Thriving!</h3>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                        Your masterpiece is now published and accessible to the world.
                                    </p>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => window.open(publishedUrl || lead.web_url || '#', '_blank')}
                                            className="w-full bg-[#1ABC9C] text-white py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg"
                                        >
                                            Visit Website
                                        </button>
                                        <button
                                            onClick={() => setShowPublishSuccess(false)}
                                            className="w-full text-slate-400 py-2 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all font-mono"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="relative min-h-screen bg-[#020617] flex items-center justify-center p-6 overflow-hidden">
            {/* Gradient Backgrounds */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1ABC9C]/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="max-w-2xl w-full relative z-10">
                <AnimatePresence mode="wait">
                    {isGenerating && (
                        <motion.div
                            key="steps"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] text-center"
                        >
                            <div className="mb-10 relative inline-block">
                                <Loader2 size={60} className="text-[#1ABC9C] animate-spin mx-auto" />
                                {isComplete && <CheckCircle2 size={60} className="text-emerald-500 absolute inset-0" />}
                            </div>

                            <h2 className="text-3xl font-black text-white mb-8">Architecting...</h2>

                            <div className="space-y-3 max-w-xs mx-auto text-left">
                                {STEPS.map((step, i) => (
                                    <div
                                        key={step.id}
                                        className={`flex items-center gap-3 transition-opacity ${i <= currentStep ? 'opacity-100' : 'opacity-20'}`}
                                    >
                                        <div className={`p-1.5 rounded-md ${i < currentStep ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#1ABC9C] text-white'}`}>
                                            {i < currentStep ? <CheckCircle2 size={14} /> : <step.icon size={14} />}
                                        </div>
                                        <span className={`text-xs font-bold ${i === currentStep ? 'text-white' : 'text-slate-500'}`}>{step.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {!isGenerating && error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900/80 backdrop-blur-3xl border border-red-500/20 p-12 rounded-[3.5rem] text-center max-w-lg mx-auto"
                        >
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 ring-8 ring-red-500/5">
                                <Zap className="fill-current" size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">Signal Lost.</h2>
                            <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                                The AI neural link encountered a disturbance:<br />
                                <span className="text-red-400 font-bold">"{error}"</span>
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        setError(null);
                                        handleGenerate();
                                    }}
                                    className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-xl shadow-white/10"
                                >
                                    Reconnect Neural Link <RefreshCw size={18} />
                                </button>
                                <button
                                    onClick={() => navigate(`/leads/${id}/templates`)}
                                    className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                                >
                                    Return to Templates
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Helper component for Code View
function CodeBlock({ title, code, lang, color }) {
    return (
        <div className="flex flex-col bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full">
            <div className="px-5 py-3 border-b border-white/5 bg-slate-800/50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
                <span className={`text-[10px] font-bold ${color}`}>{lang}</span>
            </div>
            <pre className="flex-1 p-6 text-xs font-mono overflow-auto leading-relaxed text-slate-300">
                <code>{code}</code>
            </pre>
        </div>
    );
}