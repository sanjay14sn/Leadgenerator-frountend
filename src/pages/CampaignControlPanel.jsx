import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Rocket,
    Pause,
    Play,
    ArrowLeft,
    MessageSquare,
    CheckCircle2,
    AlertCircle,
    Clock,
    ExternalLink,
    Zap,
    Loader2,
    Globe,
    Monitor
} from "lucide-react";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

export default function CampaignControlPanel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [sendIndex, setSendIndex] = useState(-1);
    const logContainerRef = useRef(null);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [leads]);

    async function loadData() {
        try {
            const [campRes, leadsRes] = await Promise.all([
                API.get(`/campaigns/${id}`),
                API.get(`/leads?campaign_id=${id}`)
            ]);
            setCampaign(campRes.data);
            setLeads(leadsRes.data);
        } catch (err) {
            console.error("Failed to load campaign data:", err);
        } finally {
            setLoading(false);
        }
    }

    async function toggleCampaign() {
        const newStatus = campaign.status === "running" ? "paused" : "running";
        try {
            const res = await API.patch(`/campaigns/${id}/toggle`, { status: newStatus });
            setCampaign(res.data);
        } catch (err) {
            alert("Failed to update status");
        }
    }

    // --- BATCH SENDING LOGIC ---
    const startBatchSending = async () => {
        const sentLeads = leads.filter(l => l.campaign_status === "sent");
        if (!sentLeads.length) {
            alert("No leads are ready for sending yet.");
            return;
        }

        setIsSending(true);

        for (let i = 0; i < sentLeads.length; i++) {
            setSendIndex(i);
            const lead = sentLeads[i];

            // 1. Generate WhatsApp Link
            const message = `Hi ${lead.name},\n\nWe created a website for your business 👇\n${lead.web_url}\n\nWould you like us to customize it for you?`;
            let phone = lead.phone.replace(/\D/g, "");
            if (phone.length === 10) phone = "91" + phone;
            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            // 2. Open WhatsApp
            window.open(waUrl, "_blank");

            // 3. Update Status to "pending" (meaning we've handed it to the user)
            try {
                await API.patch(`/leads/${lead._id}`, { campaign_status: "pending" });
            } catch (e) { console.error(e); }

            // 4. Wait for user to be ready for next one
            await new Promise(resolve => setTimeout(resolve, 15000)); // 15s delay between leads
        }

        setIsSending(false);
        setSendIndex(-1);
        alert("Batch sending cycle complete!");
    };

    if (loading || !campaign) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-teal-600 w-10 h-10" /></div>;
    }

    const sortedLeads = [...leads].sort((a, b) => new Date(b.process_at || 0) - new Date(a.process_at || 0));

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            {/* NAV */}
            <button onClick={() => navigate("/campaigns")} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition">
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            {/* HEADER CARD */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center">
                        <Rocket className="text-teal-600 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">{campaign.name}</h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${campaign.status === "running" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {campaign.status}
                            </span>
                            <span className="text-slate-400 text-sm font-bold flex items-center gap-1">
                                <Clock size={14} /> Created {new Date(campaign.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={toggleCampaign}
                        className={`px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition shadow-lg ${campaign.status === "running" ? "bg-yellow-500 text-white shadow-yellow-500/20" : "bg-teal-600 text-white shadow-teal-600/20"
                            }`}
                    >
                        {campaign.status === "running" ? <Pause size={20} /> : <Play size={20} />}
                        {campaign.status === "running" ? "Pause Campaign" : "Start Campaign"}
                    </button>

                    <button
                        onClick={startBatchSending}
                        disabled={isSending}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:scale-105 transition disabled:opacity-50"
                    >
                        {isSending ? <Loader2 className="animate-spin" /> : <Zap size={20} className="text-yellow-400 fill-yellow-400" />}
                        {isSending ? "Processing..." : "Batch Send WhatsApp"}
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem label="Queued" value={leads.filter(l => l.campaign_status === "queued").length} color="text-yellow-600" bg="bg-yellow-50" />
                <StatItem label="Processing" value={leads.filter(l => l.campaign_status === "processing").length} color="text-blue-600" bg="bg-blue-50" />
                <StatItem label="Ready to Send" value={leads.filter(l => l.campaign_status === "sent").length} color="text-green-600" bg="bg-green-50" />
                <StatItem label="Manual Sent" value={leads.filter(l => l.campaign_status === "pending").length} color="text-slate-600" bg="bg-slate-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LOG FEED */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 text-slate-300 font-mono text-sm shadow-xl min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                        <span className="flex items-center gap-2 text-teal-400 font-bold uppercase tracking-widest text-[10px]">
                            <Monitor size={14} /> Live Activity Log
                        </span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                    </div>

                    <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
                        {sortedLeads.length === 0 && <div className="text-slate-600 italic">Waiting for leads to enter the queue...</div>}
                        {sortedLeads.map((lead, idx) => (
                            <div key={lead._id} className="animate-in slide-in-from-left duration-300">
                                <span className="text-slate-600">[{new Date(lead.process_at || lead.updatedAt).toLocaleTimeString()}]</span>
                                <span className="text-blue-400 font-bold ml-2">{lead.name}</span>
                                <span className="ml-2">→</span>
                                {lead.campaign_status === "queued" && <span className="text-yellow-400 ml-2">QUEUED (Staged for {new Date(lead.process_at).toLocaleTimeString()})</span>}
                                {lead.campaign_status === "processing" && <span className="text-blue-400 ml-2 animate-pulse font-bold flex items-center gap-2 inline-flex">ARCHITECTING SITE... <Loader2 size={12} className="animate-spin" /></span>}
                                {lead.campaign_status === "sent" && (
                                    <span className="text-green-400 ml-2 font-bold flex items-center gap-2 inline-flex">
                                        DONE: <a href={lead.web_url} target="_blank" className="underline flex items-center gap-1">{lead.web_url} <ExternalLink size={12} /></a>
                                    </span>
                                )}
                                {lead.campaign_status === "pending" && <span className="text-slate-500 ml-2">WHATSAPP OPENED ✅</span>}
                                {lead.campaign_status === "error" && <span className="text-red-400 ml-2 font-bold flex items-center gap-2 inline-flex underline decoration-dotted">ERROR: {lead.last_error} <AlertCircle size={14} /></span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* SUMMARY CARD */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm h-fit">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="text-teal-600" /> Campaign Health
                    </h3>

                    <div className="space-y-6">
                        <HealthItem label="Total Leads" value={campaign.total_leads} />
                        <HealthItem label="Processed" value={campaign.processed_count} />
                        <HealthItem label="Conversion Signal" value={`${((campaign.success_count / (campaign.processed_count || 1)) * 100).toFixed(0)}%`} />

                        <div className="pt-6 border-t border-slate-100">
                            <div className="bg-teal-50 rounded-2xl p-4 flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <MessageSquare className="text-teal-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Smart Batching</p>
                                    <p className="text-xs text-slate-700 font-bold mt-1">30s delay between site builds active.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, color, bg }) {
    return (
        <div className={`${bg} rounded-2xl p-5 border border-white`}>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</div>
        </div>
    );
}

function HealthItem({ label, value }) {
    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-sm font-bold text-slate-500">{label}</span>
            <span className="text-lg font-black text-slate-800">{value}</span>
        </div>
    );
}

function BarChart3(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
        </svg>
    )
}
