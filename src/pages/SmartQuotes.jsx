import React, { useState, useRef } from "react";
import {
    Plus, Trash2, FileDown, Calculator, Send, DollarSign, User, Calendar,
    Settings, CheckCircle2, FileText, LayoutTemplate, Palette, Tag, Eye, X, Download,
    Image as ImageIcon, Upload, Type
} from "lucide-react";
import jsPDF from "jspdf";

const PREDEFINED_TEMPLATES = [
    {
        id: "web-dev",
        name: "Web Development",
        items: [
            { id: 1, description: "UI/UX Design Phase", quantity: 1, price: 1500 },
            { id: 2, description: "Frontend Implementation (React)", quantity: 1, price: 3000 },
            { id: 3, description: "Backend Setup (Node.js)", quantity: 1, price: 2500 },
            { id: 4, description: "Deployment & Testing", quantity: 1, price: 800 },
        ],
        terms: "50% upfront payment required. 50% upon completion."
    },
    {
        id: "seo",
        name: "SEO Monthly Retainer",
        items: [
            { id: 1, description: "Keyword Research & Strategy", quantity: 1, price: 500 },
            { id: 2, description: "On-Page Optimization", quantity: 10, price: 150 },
            { id: 3, description: "Content Creation (4 Blogs)", quantity: 1, price: 800 },
            { id: 4, description: "Monthly Reporting", quantity: 1, price: 200 },
        ],
        terms: "Minimum 3-month contract commitment."
    },
    {
        id: "social",
        name: "Social Media Management",
        items: [
            { id: 1, description: "Content Calendar & Strategy", quantity: 1, price: 1000 },
            { id: 2, description: "Graphics Creation (12 Posts)", quantity: 1, price: 1200 },
            { id: 3, description: "Community Management", quantity: 1, price: 600 },
            { id: 4, description: "Ad Campaign Management", quantity: 1, price: 800 },
        ],
        terms: "Ad spend is billed directly to the client."
    }
];

// --- HELPER: Read File as Base64 ---
const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// --- HELPER: Hex to RGB ---
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
};

// --- PREVIEW MODAL COMPONENT ---
const QuotePreviewModal = ({
    isOpen, onClose, onDownload,
    quoteDetails, clientDetails, items,
    calculations, brand, setBrand
}) => {
    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    if (!isOpen) return null;

    const { subtotal, discountAmount, taxAmount, total } = calculations;

    const handleLogoUpload = async (e) => {
        if (e.target.files?.[0]) {
            const base64 = await readFileAsBase64(e.target.files[0]);
            setBrand({ ...brand, logo: base64 });
        }
    };

    const handleBannerUpload = async (e) => {
        if (e.target.files?.[0]) {
            const base64 = await readFileAsBase64(e.target.files[0]);
            setBrand({ ...brand, banner: base64 });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">

            {/* Modal Container */}
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden">

                {/* SIDEBAR TOOLKIT (Canva-like) */}
                <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Palette size={18} className="text-indigo-600" /> Design Kit
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Customize your quote appearance</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-8">

                        {/* Brand Color */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand Color</label>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full shadow-sm border border-gray-200 overflow-hidden relative">
                                    <input
                                        type="color"
                                        value={brand.color}
                                        onChange={(e) => setBrand({ ...brand, color: e.target.value })}
                                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                                    />
                                </div>
                                <span className="text-sm font-mono text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded">
                                    {brand.color}
                                </span>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo</label>
                                {brand.logo && (
                                    <button onClick={() => setBrand({ ...brand, logo: null })} className="text-xs text-red-400 hover:text-red-500">Remove</button>
                                )}
                            </div>
                            <div
                                onClick={() => logoInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer text-center group"
                            >
                                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                                {brand.logo ? (
                                    <img src={brand.logo} alt="Logo" className="h-12 mx-auto object-contain" />
                                ) : (
                                    <div className="space-y-2">
                                        <Upload size={20} className="mx-auto text-gray-400 group-hover:text-indigo-500 transition" />
                                        <p className="text-xs text-gray-500 font-medium">Upload Logo</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Banner Upload */}
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Banner Image</label>
                                {brand.banner && (
                                    <button onClick={() => setBrand({ ...brand, banner: null })} className="text-xs text-red-400 hover:text-red-500">Remove</button>
                                )}
                            </div>
                            <div
                                onClick={() => bannerInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer text-center group"
                            >
                                <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} className="hidden" accept="image/*" />
                                {brand.banner ? (
                                    <div className="h-20 w-full bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${brand.banner})` }}></div>
                                ) : (
                                    <div className="space-y-2">
                                        <ImageIcon size={20} className="mx-auto text-gray-400 group-hover:text-indigo-500 transition" />
                                        <p className="text-xs text-gray-500 font-medium">Add Banner</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="p-5 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={onDownload}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200"
                        >
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </div>


                {/* PREVIEW AREA */}
                <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">

                    {/* Toolbar Header */}
                    <div className="h-14 bg-white border-b border-gray-200 flex justify-between items-center px-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Preview</span>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X size={20} /></button>
                    </div>

                    {/* Scrollable Paper Container */}
                    <div className="flex-1 overflow-y-auto p-8 flex justify-center">

                        {/* PAPER REPRESENTATION (A4) */}
                        <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl flex flex-col text-sm text-gray-800 relative transition-all duration-300"
                            style={{ borderTop: `4px solid ${brand.color}` }}
                        >

                            {/* Banner Image */}
                            {brand.banner && (
                                <div className="w-full h-40 bg-cover bg-center" style={{ backgroundImage: `url(${brand.banner})` }}></div>
                            )}

                            <div className="p-12 flex-1 flex flex-col">

                                {/* HEADER */}
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        {brand.logo ? (
                                            <img src={brand.logo} alt="Brand Logo" className="h-12 object-contain mb-2" />
                                        ) : (
                                            <div>
                                                <h1 className="text-4xl font-bold tracking-tight" style={{ color: brand.color }}>IQSync</h1>
                                                <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">AI Powered Workspace</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-5xl font-black text-slate-100 tracking-tighter">QUOTE</h2>
                                        <p className="text-gray-500 font-mono mt-2">#{quoteDetails.number}</p>
                                    </div>
                                </div>

                                {/* INFO GRID */}
                                <div className="flex justify-between items-start mb-16">
                                    <div className="w-1/2">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Bill To</h4>
                                        <p className="font-bold text-lg text-gray-900">{clientDetails.name || "Client Name"}</p>
                                        {clientDetails.email && <p className="text-gray-500">{clientDetails.email}</p>}
                                        {clientDetails.address && <p className="text-gray-500 whitespace-pre-line">{clientDetails.address}</p>}
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div><span className="text-gray-400 text-xs uppercase tracking-wider mr-4">Date</span><span className="font-medium">{clientDetails.date}</span></div>
                                        <div><span className="text-gray-400 text-xs uppercase tracking-wider mr-4">Valid Until</span><span className="font-medium">{clientDetails.dueDate}</span></div>
                                        <div>
                                            <span className="text-gray-400 text-xs uppercase tracking-wider mr-4">Status</span>
                                            <span className="font-bold px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600" style={{ color: brand.color, backgroundColor: `${brand.color}15` }}>{quoteDetails.status}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* TABLE */}
                                <div className="mb-8">
                                    <div className="flex text-white font-bold p-3 rounded-t-lg" style={{ backgroundColor: brand.color }}>
                                        <div className="flex-grow">Description</div>
                                        <div className="w-20 text-center">Qty</div>
                                        <div className="w-28 text-right">Price</div>
                                        <div className="w-28 text-right">Total</div>
                                    </div>
                                    <div>
                                        {items.map((item, i) => (
                                            <div key={item.id} className={`flex p-3 border-b border-gray-100 ${i % 2 !== 0 ? 'bg-gray-50' : ''}`}>
                                                <div className="flex-grow font-medium">{item.description || "Item"}</div>
                                                <div className="w-20 text-center text-gray-500">{item.quantity}</div>
                                                <div className="w-28 text-right text-gray-600">{quoteDetails.currency} {item.price.toFixed(2)}</div>
                                                <div className="w-28 text-right font-semibold text-gray-800">{quoteDetails.currency} {(item.quantity * item.price).toFixed(2)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* TOTALS */}
                                <div className="flex justify-end mb-16">
                                    <div className="w-1/2 space-y-3">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span>{quoteDetails.currency} {subtotal.toFixed(2)}</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-red-500">
                                                <span>Discount</span>
                                                <span>- {quoteDetails.currency} {discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-gray-500">
                                            <span>{quoteDetails.taxLabel} ({quoteDetails.taxRate}%)</span>
                                            <span>{quoteDetails.currency} {taxAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="h-px bg-gray-200 my-2"></div>
                                        <div className="flex justify-between text-xl font-bold" style={{ color: brand.color }}>
                                            <span>Total</span>
                                            <span>{quoteDetails.currency} {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="mt-auto space-y-8">
                                    {quoteDetails.notes && <div><h5 className="font-bold text-gray-900 mb-2">Scope / Notes</h5><p className="text-gray-500 text-sm whitespace-pre-line">{quoteDetails.notes}</p></div>}
                                    {quoteDetails.terms && <div><h5 className="font-bold text-gray-900 mb-2">Terms & Conditions</h5><p className="text-gray-500 text-xs whitespace-pre-line border-l-4 pl-4" style={{ borderColor: brand.color }}>{quoteDetails.terms}</p></div>}

                                    <div className="pt-12 flex justify-between items-end">
                                        <div className="text-center"><div className="w-48 border-b border-gray-300 mb-2"></div><p className="text-xs text-gray-400 uppercase tracking-widest">Authorized Signature</p></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};


export default function SmartQuotes() {
    // --- STATE ---
    const [brand, setBrand] = useState({
        color: "#1ABC9C", // Default Teal
        logo: null,       // base64 string
        banner: null      // base64 string
    });

    const [quoteDetails, setQuoteDetails] = useState({
        number: `Q-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        status: "DRAFT",
        currency: "$",
        taxLabel: "Tax",
        taxRate: 10,
        discountType: "percent",
        discountValue: 0,
        notes: "",
        terms: "Payment is due within 15 days of invoice date. Late payments are subject to a 5% fee.",
    });

    const [clientDetails, setClientDetails] = useState({
        name: "",
        email: "",
        address: "",
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    const [items, setItems] = useState([
        { id: 1, description: "Consultation Service", quantity: 1, price: 200 },
    ]);

    const [showSettings, setShowSettings] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // --- CALCULATIONS ---
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const discountAmount = quoteDetails.discountType === "percent"
        ? (subtotal * quoteDetails.discountValue) / 100
        : quoteDetails.discountValue;

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = (taxableAmount * quoteDetails.taxRate) / 100;
    const total = taxableAmount + taxAmount;

    // --- HANDLERS ---
    const handleClientChange = (e) => setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
    const handleQuoteChange = (e) => setQuoteDetails({ ...quoteDetails, [e.target.name]: e.target.value });

    const updateItem = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addItem = () => setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0 }]);
    const removeItem = (id) => setItems(items.filter(item => item.id !== id));

    const loadTemplate = (templateId) => {
        const template = PREDEFINED_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        if (window.confirm("This will replace your current items. Continue?")) {
            setItems(template.items.map(i => ({ ...i, id: Date.now() + Math.random() })));
            if (template.terms) {
                setQuoteDetails(prev => ({ ...prev, terms: template.terms }));
            }
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const { currency, number, status, taxLabel, taxRate } = quoteDetails;
        const themeColor = hexToRgb(brand.color); // [R, G, B]

        // --- LAYOUT CONSTANTS ---
        const primaryColor = themeColor;
        const darkColor = [30, 41, 59];
        const lightGray = [241, 245, 249];
        let y = 0;

        // --- BANNER IMAGE ---
        if (brand.banner) {
            try {
                // Add banner at top, width 210mm, height 40mm approx
                doc.addImage(brand.banner, "JPEG", 0, 0, 210, 40);
                y = 45; // pushed down
            } catch (e) {
                console.error("Banner upload fail", e);
                // Fallback to solid color header if banner fails
                doc.setFillColor(...lightGray);
                doc.rect(0, 0, 210, 40, "F");
                y = 55;
            }
        } else {
            // Default Header Background
            doc.setFillColor(...lightGray);
            doc.rect(0, 0, 210, 40, "F");
            y = 55;
        }

        // --- LOGO OR BRAND NAME ---
        if (brand.logo) {
            try {
                // Add logo at x=20, y=10 (inside header space)
                // Constrain size to max 40x20
                doc.addImage(brand.logo, "JPEG", 20, 10, 30, 15, undefined, 'FAST');
            } catch (e) { console.warn("Logo error", e); }
        } else {
            // Text Fallback
            doc.setFontSize(24);
            doc.setTextColor(...primaryColor);
            doc.setFont(undefined, "bold");
            doc.text("IQSync", 20, 25);
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.setFont(undefined, "normal");
            doc.text("AI Powered Workspace", 20, 32);
        }

        // Quote Info (Top Right)
        doc.setFontSize(28);
        doc.setTextColor(...darkColor);
        doc.text("QUOTE", 190, 25, { align: "right" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`#${number}`, 190, 32, { align: "right" });

        // --- DETAILS ---
        // If we had a banner, we start lower
        if (brand.banner) y = 55;

        // Left: Client
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("BILL TO", 20, y);
        y += 5;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont(undefined, "bold");
        doc.text(clientDetails.name || "Client Name", 20, y);
        y += 5;
        doc.setFont(undefined, "normal");
        doc.setFontSize(10);
        doc.setTextColor(50);
        if (clientDetails.email) {
            doc.text(clientDetails.email, 20, y);
            y += 5;
        }
        if (clientDetails.address) {
            doc.text(clientDetails.address, 20, y);
        }

        // Right: Metadata
        y = 55;
        doc.text("Date:", 140, y, { align: "right" });
        doc.text(clientDetails.date, 190, y, { align: "right" });
        y += 6;
        doc.text("Valid Until:", 140, y, { align: "right" });
        doc.text(clientDetails.dueDate, 190, y, { align: "right" });
        y += 6;
        doc.text("Status:", 140, y, { align: "right" });
        doc.setTextColor(...primaryColor);
        doc.text(status, 190, y, { align: "right" });

        // --- TABLE ---
        y = 90;

        // Table Header
        doc.setFillColor(...primaryColor);
        doc.rect(20, y, 170, 10, "F");
        doc.setTextColor(255);
        doc.setFont(undefined, "bold");
        doc.setFontSize(9);
        doc.text("DESCRIPTION", 25, y + 6);
        doc.text("QTY", 130, y + 6, { align: "center" });
        doc.text("PRICE", 150, y + 6, { align: "right" });
        doc.text("TOTAL", 185, y + 6, { align: "right" });

        // Items
        y += 10;
        doc.setTextColor(0);
        doc.setFont(undefined, "normal");
        doc.setFontSize(10);

        items.forEach((item, i) => {
            // Background stripe for alternate lines
            if (i % 2 !== 0) {
                doc.setFillColor(...lightGray);
                doc.rect(20, y, 170, 8, "F");
            }

            const lineTotal = item.quantity * item.price;

            doc.text(item.description || "Item", 25, y + 5);
            doc.text(String(item.quantity), 130, y + 5, { align: "center" });
            doc.text(`${currency} ${item.price.toFixed(2)}`, 150, y + 5, { align: "right" });
            doc.text(`${currency} ${lineTotal.toFixed(2)}`, 185, y + 5, { align: "right" });

            y += 10;
        });

        // --- TOTALS SECTION ---
        y += 5;
        const rightColX = 150;
        const valColX = 185;

        // Subtotal
        doc.text("Subtotal:", rightColX, y, { align: "right" });
        doc.text(`${currency} ${subtotal.toFixed(2)}`, valColX, y, { align: "right" });
        y += 6;

        // Discount (if any)
        if (discountAmount > 0) {
            doc.setTextColor(200, 0, 0); // Red for discount
            doc.text(`Discount:`, rightColX, y, { align: "right" });
            doc.text(`- ${currency} ${discountAmount.toFixed(2)}`, valColX, y, { align: "right" });
            doc.setTextColor(0);
            y += 6;
        }

        // Tax
        doc.text(`${taxLabel} (${taxRate}%):`, rightColX, y, { align: "right" });
        doc.text(`${currency} ${taxAmount.toFixed(2)}`, valColX, y, { align: "right" });
        y += 4;

        // Divider Line
        doc.setDrawColor(200);
        doc.line(120, y, 190, y);
        y += 6;

        // Grand Total
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.setTextColor(...primaryColor);
        doc.text("Total:", rightColX, y, { align: "right" });
        doc.text(`${currency} ${total.toFixed(2)}`, valColX, y, { align: "right" });

        // --- TERMS & NOTES ---
        y += 20;
        doc.setFontSize(10);
        doc.setTextColor(0);

        if (quoteDetails.notes) {
            doc.setFont(undefined, "bold");
            doc.text("Notes / Scope of Work:", 20, y);
            y += 5;
            doc.setFont(undefined, "normal");
            doc.setFontSize(9);
            doc.setTextColor(80);
            const splitNotes = doc.splitTextToSize(quoteDetails.notes, 170);
            doc.text(splitNotes, 20, y);
            y += (splitNotes.length * 5) + 10;
        }

        if (quoteDetails.terms) {
            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.setFont(undefined, "bold");
            doc.text("Terms & Conditions:", 20, y);
            y += 5;
            doc.setFont(undefined, "normal");
            doc.setFontSize(8);
            doc.setTextColor(100);
            const splitTerms = doc.splitTextToSize(quoteDetails.terms, 170);
            doc.text(splitTerms, 20, y);
            y += (splitTerms.length * 5) + 15;
        }

        // --- SIGNATURE ---
        if (y < 240) y = 240; // Push to bottom if space allows

        doc.setDrawColor(200);
        doc.line(20, y, 80, y); // Sign line
        doc.setFontSize(8);
        doc.text("Authorized Signature", 20, y + 5);

        doc.save(`Quote_${quoteDetails.number}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">

            {/* HEADER TOOLBAR */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-20 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                        <Calculator size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Smart Quotes</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{quoteDetails.number}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wide
                ${quoteDetails.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    quoteDetails.status === 'SENT' ? 'bg-blue-100 text-blue-700' :
                                        quoteDetails.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-600'}`
                            }>
                                {quoteDetails.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                    {/* Template Selector */}
                    <div className="flex gap-2">
                        {PREDEFINED_TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => loadTemplate(t.id)}
                                className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition whitespace-nowrap flex items-center gap-1.5"
                            >
                                <LayoutTemplate size={12} /> {t.name}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>

                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-sm font-bold whitespace-nowrap"
                    >
                        <Eye size={16} /> Preview
                    </button>

                    <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 text-sm font-bold whitespace-nowrap"
                    >
                        <FileDown size={16} /> PDF
                    </button>
                </div>
            </div>

            {/* BODY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COMPONENT - BUILDER */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. Client & Date Details */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <User size={16} className="text-teal-500" /> Client Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="name" placeholder="Client Name" value={clientDetails.name} onChange={handleClientChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                            />
                            <input
                                name="email" placeholder="Client Email" value={clientDetails.email} onChange={handleClientChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                            />
                            <input
                                name="address" placeholder="Billing Address" value={clientDetails.address} onChange={handleClientChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition md:col-span-2"
                            />
                            <div className="relative">
                                <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Issue Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <input
                                        type="date" name="date" value={clientDetails.date} onChange={handleClientChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-10 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Valid Until</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                    <input
                                        type="date" name="dueDate" value={clientDetails.dueDate} onChange={handleClientChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-10 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Items Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <DollarSign size={16} className="text-teal-500" /> Line Items
                            </h3>
                            <button
                                onClick={addItem}
                                className="text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 uppercase tracking-wide"
                            >
                                <Plus size={14} /> Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Items Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 select-none">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-3 text-right">Price</div>
                                <div className="col-span-1"></div>
                            </div>

                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-50 p-2 rounded-xl border border-gray-100 group hover:border-teal-200 transition-colors">
                                    <div className="md:col-span-6">
                                        <input
                                            placeholder="Item name / description"
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                            className="w-full bg-transparent border-none p-1 focus:ring-0 text-gray-800 font-medium placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center justify-center">
                                        <input
                                            type="number" min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                                            className="w-16 bg-white border border-gray-200 rounded-md text-center p-1 text-sm focus:border-teal-500 outline-none font-mono"
                                        />
                                    </div>
                                    <div className="md:col-span-3 flex items-center justify-end">
                                        <span className="text-gray-400 mr-1 text-sm">{quoteDetails.currency}</span>
                                        <input
                                            type="number" min="0" step="0.01"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                                            className="w-24 bg-white border border-gray-200 rounded-md text-right p-1 text-sm focus:border-teal-500 outline-none font-mono"
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Additional Details (Notes & Terms) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Scope / Notes</label>
                                <textarea
                                    name="notes"
                                    value={quoteDetails.notes}
                                    onChange={handleQuoteChange}
                                    placeholder="Enter project scope details key deliverables..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm h-32 focus:border-teal-500 outline-none resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Terms & Conditions</label>
                                <textarea
                                    name="terms"
                                    value={quoteDetails.terms}
                                    onChange={handleQuoteChange}
                                    placeholder="Payment terms, cancellation policy..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm h-32 focus:border-teal-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COMPONENT - SETTINGS & TOTALS */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Settings Card */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="flex items-center justify-between w-full text-left font-bold text-gray-700 text-sm uppercase tracking-wide mb-2 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition"
                        >
                            <span className="flex items-center gap-2"><Settings size={16} className="text-teal-500" /> Quote Settings</span>
                            <span className="text-xs text-teal-600">{showSettings ? 'Hide' : 'Show'}</span>
                        </button>

                        {showSettings && (
                            <div className="space-y-4 pt-2 animate-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 block mb-1">Quote Number</label>
                                    <input
                                        name="number" value={quoteDetails.number} onChange={handleQuoteChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 block mb-1">Currency</label>
                                        <select
                                            name="currency" value={quoteDetails.currency} onChange={handleQuoteChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                                        >
                                            <option value="$">USD ($)</option>
                                            <option value="€">EUR (€)</option>
                                            <option value="£">GBP (£)</option>
                                            <option value="₹">INR (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
                                        <select
                                            name="status" value={quoteDetails.status} onChange={handleQuoteChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="SENT">Sent</option>
                                            <option value="APPROVED">Approved</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Totals Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl shadow-slate-200/50 sticky top-24">
                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">
                            Quote Summary
                        </h3>

                        <div className="space-y-4">
                            {/* Subtotal */}
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Subtotal {items.length} items</span>
                                <span className="font-medium">{quoteDetails.currency}{subtotal.toFixed(2)}</span>
                            </div>

                            {/* Discount */}
                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <span>Discount</span>
                                    <select
                                        name="discountType" value={quoteDetails.discountType} onChange={handleQuoteChange}
                                        className="bg-gray-50 border-none p-0 text-xs text-gray-500 focus:ring-0 cursor-pointer"
                                    >
                                        <option value="percent">%</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={quoteDetails.discountValue}
                                        onChange={handleQuoteChange}
                                        className="w-12 bg-gray-50 border border-gray-200 rounded px-1 py-0.5 text-xs text-right focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <span className="font-medium text-red-400">-{quoteDetails.currency}{discountAmount.toFixed(2)}</span>
                            </div>

                            {/* Tax */}
                            <div className="flex justify-between items-center text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        name="taxLabel" value={quoteDetails.taxLabel} onChange={handleQuoteChange}
                                        className="w-12 bg-transparent text-gray-600 border-none p-0 text-sm focus:ring-0"
                                    />
                                    <div className="relative w-14">
                                        <input
                                            type="number"
                                            name="taxRate"
                                            value={quoteDetails.taxRate}
                                            onChange={handleQuoteChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-right focus:border-teal-500 outline-none"
                                        />
                                        <span className="absolute right-0 top-1 text-xs text-gray-400 pr-1">%</span>
                                    </div>
                                </div>
                                <span className="font-medium">{quoteDetails.currency}{taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="h-px bg-gray-100 my-2"></div>

                            {/* Total */}
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-black text-teal-600 tracking-tight">{quoteDetails.currency}{total.toFixed(2)}</span>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* MODAL */}
            <QuotePreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                onDownload={generatePDF}
                quoteDetails={quoteDetails}
                clientDetails={clientDetails}
                items={items}
                calculations={{ subtotal, discountAmount, taxAmount, total }}
                brand={brand}
                setBrand={setBrand}
            />
        </div>
    );
}
