import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles, Wand2, Rocket, CheckCircle2, ArrowRight,
    Loader2, Zap, Globe, Layout, Palette, ShieldCheck,
    Stars, Code2, Monitor, RefreshCw, ChevronLeft
} from "lucide-react";
import API from "../api/api";

const STEPS = [
    { id: 1, text: "Analyzing Business DNA", icon: Globe, color: "text-[#1ABC9C]" },
    { id: 2, text: "Synthesizing AI Blueprint", icon: Zap, color: "text-emerald-400" },
    { id: 3, text: "Generating Premium Content", icon: Palette, color: "text-[#1ABC9C]" },
    { id: 4, text: "Optimizing for Conversion", icon: Layout, color: "text-teal-400" },
    { id: 5, text: "Polishing Glossy Interface", icon: Stars, color: "text-emerald-500" },
];

export default function AIWebsiteBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [instructions, setInstructions] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(null);
    const [activeTab, setActiveTab] = useState("preview"); // 'preview' | 'code'

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
            await API.post(`/ai/enhance`, { lead, instructions });
            const res = await API.post(`/ai/generate-site-code`, { id, lead, instructions });
            setGeneratedCode(res.data);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsComplete(true);
            clearInterval(interval);
        } catch (err) {
            console.error("AI Generation failed:", err);
            setIsGenerating(false);
            clearInterval(interval);
            alert("The AI magic encountered a disturbance.");
        }
    };

    if (!lead) return (
        <div className="flex items-center justify-center h-screen bg-[#020617]">
            <Loader2 className="text-[#1ABC9C] animate-spin w-10 h-10" />
        </div>
    );

    // --- PREVIEW & CODE MODE ---
    if (isComplete && generatedCode) {
        return (
            <div className="flex flex-col h-screen bg-[#0f172a] text-slate-300">
                {/* Top Navigation Bar */}
                <header className="h-16 border-b border-white/5 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsComplete(false)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-sm font-bold text-white leading-none">AI Architect</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Design for {lead.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "preview" ? "bg-[#1ABC9C] text-white shadow-lg" : "hover:text-white"}`}
                        >
                            <Monitor size={14} /> Preview
                        </button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "code" ? "bg-[#1ABC9C] text-white shadow-lg" : "hover:text-white"}`}
                        >
                            <Code2 size={14} /> Source
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleGenerate()}
                            className="hidden md:flex items-center gap-2 text-xs font-bold hover:text-[#1ABC9C] transition-colors px-3"
                        >
                            <RefreshCw size={14} /> Regenerate
                        </button>
                        <button
                            onClick={() => navigate(`/leads/${id}/edit`)}
                            className="bg-white text-slate-950 px-5 py-2 rounded-full font-black text-xs hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            Confirm & Edit <ArrowRight size={14} />
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
                                className="w-full h-full max-w-6xl mx-auto flex flex-col"
                            >
                                {/* Browser Chrome */}
                                <div className="bg-[#1e293b] border border-white/10 rounded-t-2xl px-4 py-3 flex items-center gap-3 shadow-2xl">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                                    </div>
                                    <div className="flex-1 bg-slate-900/50 rounded-lg py-1 px-4 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                        <Globe size={10} /> https://{lead.name.toLowerCase().replace(/\s+/g, '-')}.preview.ai
                                    </div>
                                </div>
                                {/* Iframe Content */}
                                <div className="flex-1 bg-white rounded-b-2xl shadow-2xl overflow-hidden border-x border-b border-white/10 relative">
                                    <iframe
                                        title="Preview"
                                        className="w-full h-full"
                                        srcDoc={`
                                            <html>
                                                <head>
                                                    <style>${generatedCode.css}</style>
                                                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                                                    <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap'); body { font-family: 'Inter', sans-serif; margin:0; padding:0; }</style>
                                                </head>
                                                <body>${generatedCode.html}</body>
                                            </html>
                                        `}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="code-pane"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-w-7xl mx-auto"
                            >
                                <CodeBlock title="index.html" code={generatedCode.html} lang="HTML" color="text-emerald-400" />
                                <CodeBlock title="styles.css" code={generatedCode.css} lang="CSS" color="text-blue-400" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        );
    }

    // --- GENERATION FLOW ---
    return (
        <div className="relative min-h-screen bg-[#020617] flex items-center justify-center p-6 overflow-hidden">
            {/* Gradient Backgrounds */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1ABC9C]/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="max-w-2xl w-full relative z-10">
                <AnimatePresence mode="wait">
                    {!isGenerating ? (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1ABC9C]">
                                <Sparkles size={12} /> Neural Site Designer v2.0
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                                Build it with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1ABC9C] to-emerald-400">Pure Intent.</span>
                            </h1>

                            <div className="relative group max-w-lg mx-auto">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#1ABC9C] to-teal-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition" />
                                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                                    <div className="flex items-center gap-2 mb-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                        <Wand2 size={14} className="text-[#1ABC9C]" /> Directives for {lead.name}
                                    </div>
                                    <textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="Enter custom instructions (e.g. 'Luxury spa vibes' or 'Dark mode tech style')..."
                                        className="w-full bg-transparent text-white outline-none resize-none text-sm min-h-[100px]"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="group bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all flex items-center gap-4 mx-auto shadow-xl"
                            >
                                Generate Experience
                                <div className="w-8 h-8 bg-slate-950 text-white rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ArrowRight size={18} />
                                </div>
                            </button>
                        </motion.div>
                    ) : (
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
                </AnimatePresence>
            </div>
        </div>
    );
}

// Helper component for Code View
function CodeBlock({ title, code, lang, color }) {
    return (
        <div className="flex flex-col bg-slate-950 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-5 py-3 border-b border-white/5 bg-slate-900/50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</span>
                <span className={`text-[10px] font-bold ${color}`}>{lang}</span>
            </div>
            <pre className="flex-1 p-6 text-xs font-mono overflow-auto leading-relaxed text-slate-400">
                <code>{code}</code>
            </pre>
        </div>
    );
}