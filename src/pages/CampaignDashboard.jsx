import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Rocket,
    Pause,
    Play,
    Plus,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink,
    MessageSquare,
    BarChart3,
    Users,
    Trash2,
} from "lucide-react";
import API from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

const StatusBadge = ({ status }) => {
    const colors = {
        idle: "bg-gray-100 text-gray-700",
        running: "bg-green-100 text-green-700 animate-pulse",
        paused: "bg-yellow-100 text-yellow-700",
        completed: "bg-blue-100 text-blue-700",
    };
    return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status]}`}>
            {status}
        </span>
    );
};

export default function CampaignDashboard() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState("");

    useEffect(() => {
        loadCampaigns();
        const interval = setInterval(loadCampaigns, 5000); // Polling for updates
        return () => clearInterval(interval);
    }, []);

    async function loadCampaigns() {
        try {
            const res = await API.get("/campaigns");
            setCampaigns(res.data);
        } catch (err) {
            console.error("Failed to load campaigns:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateCampaign() {
        if (!newCampaignName.trim()) return;
        try {
            const res = await API.post("/campaigns", { name: newCampaignName });
            setCampaigns([res.data, ...campaigns]);
            setNewCampaignName("");
            setShowCreateModal(false);
        } catch (err) {
            alert("Failed to create campaign");
        }
    }

    async function toggleCampaign(id, currentStatus) {
        const newStatus = currentStatus === "running" ? "paused" : "running";
        try {
            const res = await API.patch(`/campaigns/${id}/toggle`, { status: newStatus });
            setCampaigns(campaigns.map((c) => (c._id === id ? res.data : c)));
        } catch (err) {
            alert("Failed to update campaign");
        }
    }

    async function handleDeleteCampaign(id) {
        if (!window.confirm("Are you sure you want to delete this campaign? Associated leads will be reset.")) return;
        try {
            await API.delete(`/campaigns/${id}`);
            setCampaigns(campaigns.filter((c) => c._id !== id));
        } catch (err) {
            alert("Failed to delete campaign");
        }
    }

    if (loading && !campaigns.length) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-teal-600 w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Rocket className="text-teal-600" /> Lead Campaigns
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Automate your outreach and site generation.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-700 transition shadow-lg shadow-teal-600/20"
                >
                    <Plus size={18} /> New Campaign
                </button>
            </div>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Campaigns" value={campaigns.length} icon={<BarChart3 />} color="text-blue-600" />
                <StatCard
                    title="Leads Processed"
                    value={campaigns.reduce((acc, c) => acc + c.processed_count, 0)}
                    icon={<Users />}
                    color="text-teal-600"
                />
                <StatCard
                    title="Websites Live"
                    value={campaigns.reduce((acc, c) => acc + c.success_count, 0)}
                    icon={<CheckCircle2 />}
                    color="text-green-600"
                />
                <StatCard
                    title="Errors"
                    value={campaigns.reduce((acc, c) => acc + c.error_count, 0)}
                    icon={<AlertCircle />}
                    color="text-red-600"
                />
            </div>

            {/* CAMPAIGN LIST */}
            <div className="grid grid-cols-1 gap-4">
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign._id} campaign={campaign} onToggle={toggleCampaign} onDelete={handleDeleteCampaign} />
                ))}
                {campaigns.length === 0 && (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                        No campaigns yet. Create one to get started!
                    </div>
                )}
            </div>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-black text-slate-900 mb-4">Create New Campaign</h2>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Campaign Name (e.g., Dentist Outreach NY)"
                                className="w-full border-2 border-slate-100 rounded-xl p-4 mb-6 focus:border-teal-500 outline-none transition"
                                value={newCampaignName}
                                onChange={(e) => setNewCampaignName(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateCampaign}
                                    className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition"
                                >
                                    Create
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
            <div>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{title}</div>
            </div>
        </div>
    );
}

function CampaignCard({ campaign, onToggle, onDelete }) {
    const progress = campaign.total_leads > 0 ? (campaign.processed_count / campaign.total_leads) * 100 : 0;
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-slate-900">{campaign.name}</h3>
                        <StatusBadge status={campaign.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Created on {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onToggle(campaign._id, campaign.status)}
                        className={`p-2 rounded-xl transition ${campaign.status === "running" ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                            }`}
                    >
                        {campaign.status === "running" ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                        onClick={() => navigate(`/campaigns/${campaign._id}`)}
                        className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition"
                    >
                        <ExternalLink size={20} />
                    </button>
                    <button
                        onClick={() => onDelete(campaign._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-widest">
                    <span>Progress</span>
                    <span>{campaign.processed_count} / {campaign.total_leads} Leads</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full ${campaign.status === "completed" ? "bg-blue-500" : "bg-teal-500"}`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="text-sm font-black text-slate-900">{campaign.success_count}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">Success</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="text-sm font-black text-slate-900">{campaign.error_count}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">Errors</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="text-sm font-black text-slate-900">{campaign.total_leads - campaign.processed_count}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">Pending</div>
                </div>
            </div>
        </div>
    );
}
