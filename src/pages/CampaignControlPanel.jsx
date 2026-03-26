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
    Monitor,
    Trash2,
    XCircle,
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

    // Refs for safe access in dynamic batches
    const leadsRef = useRef([]);
    const campaignRef = useRef(null);
    const isSendingRef = useRef(false);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        leadsRef.current = leads;
        campaignRef.current = campaign;
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [leads, campaign]);

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

    async function handleDeleteCampaign() {
        if (!window.confirm("Are you sure you want to delete this campaign? Associated leads will be reset.")) return;
        try {
            await API.delete(`/campaigns/${id}`);
            navigate("/campaigns");
        } catch (err) {
            alert("Failed to delete campaign");
        }
    }

    const getWhatsAppLink = (lead) => {
        let phone = lead.phone.replace(/\D/g, "");
        if (phone.startsWith("0")) phone = phone.substring(1);
        if (phone.length === 10) phone = "91" + phone;

        const message = `Hi ${lead.name} 👋

We created a website preview for your business:

${lead.web_url}

Today, most customers search online before contacting a business.  
A professional website helps you get more enquiries and build trust.

If you like this demo, we can complete your full website within 1 day — fully mobile-friendly 📱

No obligation — just sharing.

Reply YES if you'd like us to customize it 👍`;

        return `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    }

    const handleManualSend = async (lead) => {
        try {
            const waUrl = getWhatsAppLink(lead);
            window.open(waUrl, `ManualWA_${lead._id}`);

            await API.patch(`/leads/${lead._id}`, {
                campaign_status: "pending"
            });

            setLeads(prev => prev.map(l => l._id === lead._id ? { ...l, campaign_status: "pending" } : l));
        } catch (err) {
            console.error("Manual send failed:", err);
            alert("Failed to update lead status");
        }
    };

    // --- DYNAMIC BATCH SENDING LOGIC ---
    const startBatchSending = async () => {
        if (isSending) {
            console.log("🛑 Stopping batch sending...");
            setIsSending(false);
            isSendingRef.current = false;
            return;
        }

        console.log("🚀 Batch sending started (Continuous Mode)");

        // ✅ Open once (important to avoid popup blocking)
        let waWindow = window.open("", "WhatsAppBatchWindow");

        if (!waWindow) {
            console.error("❌ Popup blocked");
            alert("Popup blocked! Please allow popups for this site and try again.");
            return;
        }

        setIsSending(true);
        isSendingRef.current = true;

        while (isSendingRef.current) {
            const currentLeads = leadsRef.current;
            const nextLead = currentLeads.find(l => l.campaign_status === "sent");

            if (!nextLead) {
                console.log("⏳ No leads ready for sending. Waiting 5s...");
                setSendIndex(-1);
                if (campaignRef.current?.status === "paused") {
                    console.log("⏸ Campaign paused. Stopping batch sender.");
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
                continue;
            }

            const i = currentLeads.indexOf(nextLead);
            setSendIndex(i);

            console.log(`➡️ Processing lead:`, nextLead.name);

            const waUrl = getWhatsAppLink(nextLead);

            // Ultra-Stable Navigation: Re-use/update named window
            waWindow = window.open(waUrl, "WhatsAppBatchWindow");

            if (!waWindow) {
                console.error("❌ Popup lost");
                alert("WhatsApp window was closed or blocked. Stopping.");
                isSendingRef.current = false;
                break;
            }
            waWindow.focus();

            console.log(`🌐 WhatsApp opened for ${nextLead.name}`);

            await new Promise(resolve => setTimeout(resolve, 8000));

            try {
                await API.patch(`/leads/${nextLead._id}`, {
                    campaign_status: "pending"
                });
                console.log(`✅ Status updated → pending (${nextLead.name})`);
            } catch (e) {
                console.error("Status update error:", e);
            }

            const randomDelay = Math.random() * (25000 - 18000) + 18000;
            console.log(`⏱ Waiting ${Math.round(randomDelay / 1000)}s before next check`);
            await new Promise(resolve => setTimeout(resolve, randomDelay));
        }

        console.log("🚀 Batch sending cycle terminated");
        setIsSending(false);
        isSendingRef.current = false;
        setSendIndex(-1);
    };


    if (loading || !campaign) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-teal-600 w-10 h-10" /></div>;
    }

    const sortedLeads = [...leads].sort((a, b) => new Date(b.process_at || 0) - new Date(a.process_at || 0) || new Date(b.updatedAt) - new Date(a.updatedAt));

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
                        className={`px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg transition ${isSending ? "bg-red-500 text-white shadow-red-500/20" : "bg-slate-900 text-white shadow-slate-900/20 hover:scale-105"
                            }`}
                    >
                        {isSending ? <XCircle size={20} /> : <Zap size={20} className="text-yellow-400 fill-yellow-400" />}
                        {isSending ? "Stop Sending" : "Batch Send WhatsApp"}
                    </button>

                    <button
                        onClick={handleDeleteCampaign}
                        className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition shadow-lg shadow-red-600/10"
                        title="Delete Campaign"
                    >
                        <Trash2 size={24} />
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
                            <div key={lead._id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 transition hover:bg-slate-800/60 group animate-in slide-in-from-left duration-300">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                                {new Date(lead.process_at || lead.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span className="text-blue-400 font-black truncate">{lead.name}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            {lead.campaign_status === "queued" && (
                                                <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-bold bg-yellow-500/5 px-2 py-0.5 rounded-full border border-yellow-500/10">
                                                    <Clock size={12} /> QUEUED
                                                </div>
                                            )}
                                            {lead.campaign_status === "processing" && (
                                                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold bg-blue-400/5 px-2 py-0.5 rounded-full border border-blue-400/10">
                                                    <Loader2 size={12} className="animate-spin" /> ARCHITECTING...
                                                </div>
                                            )}
                                            {lead.campaign_status === "sent" && (
                                                <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/5 px-2 py-0.5 rounded-full border border-green-400/10">
                                                    <CheckCircle2 size={12} /> READY
                                                </div>
                                            )}
                                            {lead.campaign_status === "pending" && (
                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-slate-400/5 px-2 py-0.5 rounded-full border border-slate-400/10">
                                                    <MessageSquare size={12} /> WHATSAPP OPENED ✅
                                                </div>
                                            )}
                                            {lead.campaign_status === "error" && (
                                                <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/5 px-2 py-0.5 rounded-full border border-red-400/10">
                                                    <AlertCircle size={12} /> ERROR
                                                </div>
                                            )}

                                            {lead.web_url && (
                                                <a
                                                    href={lead.web_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[10px] text-slate-500 hover:text-teal-400 transition flex items-center gap-1 underline decoration-dotted"
                                                >
                                                    View Site <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {(lead.campaign_status === "sent" || lead.campaign_status === "pending") && (
                                            <button
                                                onClick={() => handleManualSend(lead)}
                                                className={`px-4 py-2 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-2 ${lead.campaign_status === "sent"
                                                        ? "bg-teal-600 text-white shadow-teal-600/20 hover:bg-teal-500"
                                                        : "bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600"
                                                    }`}
                                            >
                                                <MessageSquare size={14} />
                                                {lead.campaign_status === "sent" ? "Send WhatsApp Manual" : "Re-send WhatsApp"}
                                            </button>
                                        )}
                                    </div>
                                </div>
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
