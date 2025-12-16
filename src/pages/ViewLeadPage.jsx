import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";


import API from "../api/api";
import {
  getTemplateByKey,
  getTemplateByCategory,
} from "./templates/templateRegistry";

// --- TEMPLATES FOR WHATSAPP MODAL ---
const WHATSAPP_TEMPLATES = [
  {
    title: "Standard Intro",
    message:
      "Hi {name}, I noticed your business {category} and wanted to share how we can significantly boost your online presence. Click here to view your personalized site: {web_url}",
  },
  {
    title: "Follow-up",
    message:
      "Hello {name}, just checking in regarding the site we created for {category}. Have you had a chance to review it? Let me know if you have any questions! {web_url}",
  },
  {
    title: "Pricing Inquiry",
    message:
      "Hi {name}, thanks for reaching out! Here is the link to our full pricing brochure and your personalized site: {web_url} (or PDF: {pdf_url})",
  },
];

// --- HELPER COMPONENTS (for design consistency) ---
const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      rows={rows}
      className="border border-gray-300 p-3 rounded-lg w-full resize-y focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

// --- WHATSAPP CHAT MODAL COMPONENT (Integrated) ---
const WhatsAppChatModal = ({ lead, isLoading, onSend, onClose }) => {
  // Determine the default message using the first template
  const defaultTemplate = WHATSAPP_TEMPLATES[0].message
    .replace(/{name}/g, lead.name)
    .replace(/{category}/g, lead.category || "your sector")
    .replace(/{web_url}/g, lead.web_url || "https://default-site.com")
    .replace(/{pdf_url}/g, lead.pdf_url || "N/A");

  const [message, setMessage] = useState(defaultTemplate);
  const [templateTitle, setTemplateTitle] = useState(
    WHATSAPP_TEMPLATES[0].title
  );

  const handleTemplateChange = (template) => {
    setTemplateTitle(template.title);
    // Replace placeholders with actual lead data
    let content = template.message
      .replace(/{name}/g, lead.name)
      .replace(/{category}/g, lead.category || "your sector")
      .replace(/{web_url}/g, lead.web_url || "https://default-site.com")
      .replace(/{pdf_url}/g, lead.pdf_url || "N/A");
    setMessage(content);
  };

  const handleSendClick = () => {
    if (message.trim()) {
      onSend(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col h-[600px] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-5 border-b bg-green-600 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            📱 Initiate WhatsApp Chat with {lead.name}
          </h3>
          <button
            onClick={onClose}
            className="text-3xl text-white opacity-80 hover:opacity-100 transition"
          >
            &times;
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Template Sidebar */}
          <div className="w-1/3 border-r p-4 bg-gray-50 overflow-y-auto">
            <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">
              Select Template
            </h4>
            {WHATSAPP_TEMPLATES.map((t) => (
              <button
                key={t.title}
                onClick={() => handleTemplateChange(t)}
                className={`block w-full text-left p-3 rounded-lg mb-2 text-sm transition ${
                  templateTitle === t.title
                    ? "bg-green-100 text-green-800 font-bold border-2 border-green-400"
                    : "bg-white hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* Chat Editor */}
          <div className="w-2/3 p-4 flex flex-col">
            <div className="mb-4 text-sm font-medium text-gray-700">
              Sending to:{" "}
              <span className="text-green-600 font-bold">{lead.phone}</span>
              <div className="text-xs text-gray-500 mt-1">
                Template: {templateTitle}
              </div>
            </div>
            <textarea
              className="flex-1 border border-gray-300 p-4 rounded-lg resize-none focus:ring-green-500 focus:border-green-500 text-gray-800 shadow-inner"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your custom message..."
            />

            <div className="text-xs text-gray-500 mt-2">
              The text above will be pre-filled when WhatsApp opens. Variables
              (like ``) are automatically replaced.
            </div>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="p-4 border-t flex justify-end bg-gray-50">
          <button
            onClick={handleSendClick}
            disabled={isLoading || !message.trim()}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading
              ? "Logging & Opening..."
              : "➡️ Open WhatsApp & Log Action"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN ViewLeadPage COMPONENT ---
function ViewLeadPage() {
  const [searchParams] = useSearchParams();
  const selectedTemplate = searchParams.get("template");

  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templateFull, setTemplateFull] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  // Example generated images from the context for display/selection
  const generatedImages = lead?.generated_images || [
    {
      foreign_landing_url:
        "https://www.flickr.com/photos/31124107@N00/7444465084",
      image_url:
        "https://live.staticflickr.com/8016/7444465084_7f2c1ea4bd_b.jpg",
      prompt:
        "Close-up shot of a skilled metal fabricator working on a custom metal part in a well-equipped workshop. Focus on precision and craftsmanship.",
    },
    {
      foreign_landing_url:
        "https://www.flickr.com/photos/88903722@N07/8103976340",
      image_url:
        "https://live.staticflickr.com/8330/8103976340_18f92c4113_b.jpg",
      prompt:
        "Wide angle shot of a customer shaking hands with a Welworth Industries sales representative, showcasing a successful business transaction in a modern office setting.",
    },
  ];

  /* ------------------------------ LOAD LEAD ------------------------------ */
  useEffect(() => {
    loadLead();
    // eslint-disable-next-line
  }, [id]);

  async function loadLead() {
    try {
      const res = await API.get(`/leads/${id}`);
      const loadedLead = {
        ...res.data,
        capabilities: res.data.capabilities || [
          {
            title: "Premium Quality",
            desc: "Always delivering the best.",
            icon: "⭐",
          },
          {
            title: "Fast Delivery",
            desc: "Quick and efficient service.",
            icon: "⚡",
          },
          {
            title: "Customer Support",
            desc: "Always there for our clients.",
            icon: "📞",
          },
          {
            title: "Affordable Pricing",
            desc: "Growth shouldn't break the bank.",
            icon: "💰",
          },
        ],
        // Ensure generated_images is correctly initialized from data
        generated_images: res.data.generated_images || generatedImages,
      };
      setLead(loadedLead);
    } catch (err) {
      console.error("Error loading lead:", err);
      alert("Failed to load lead data.");
    }
  }

  /* ------------------------------ AI ENHANCE / SAVE / PUBLISH ------------------------------ */
  async function handleAIEnhance() {
    try {
      setLoadingAI(true);
      const response = await API.post(`/ai/enhance`, { lead });
      if (response?.data?.enhanced) {
        setLead((prev) => ({
          ...prev,
          ...response.data.enhanced,
          generated_images: prev.generated_images,
        }));
        console.log("AI Enhanced!");
      }
    } catch (err) {
      console.error(err);
      alert("AI enhancement failed. Check API status.");
    }
    setLoadingAI(false);
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      await API.patch(`/leads/${id}`, lead);
      console.log("Changes Saved!");
    } catch (err) {
      console.error(err);
      alert("Save operation failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    try {
      setPublishing(true);

      // 1️⃣ Save latest edits
      await API.patch(`/leads/${id}`, lead);

      // 2️⃣ Publish website (THIS already handles deploy + logging)
      // FIX THIS LINE
      const res = await API.patch(`/deploy/${id}/publish`);

      if (res?.data?.web_url) {
        setLead((prev) => ({
          ...prev,
          web_url: res.data.web_url,
        }));
      }

      // 3️⃣ Go to follow-up
      //  navigate(`/followup/${id}`);
    } catch (err) {
      console.error(err);
      alert("Publishing failed");
    } finally {
      setPublishing(false);
    }
  }

  /* ------------------------------ WHATSAPP CHAT LOGIC ------------------------------ */
  // This function is called when the user hits 'Open WhatsApp & Log Action' inside the modal.
  async function logAndOpenWhatsapp(message) {
    try {
      setWhatsappLoading(true);
      // 1. Log the action in the backend
      await API.post(`/leads/${id}/whatsapp-log`, { message });

      // 2. Open WhatsApp link in a new tab
      const whatsappUrl = `https://wa.me/${
        lead.phone
      }?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      // 3. Close the modal
      setShowWhatsappModal(false);
    } catch (err) {
      console.error("WhatsApp logging/opening failed:", err);
      alert("Failed to log or open WhatsApp.");
    } finally {
      setWhatsappLoading(false);
    }
  }

  async function goToFollowUp(id) {
    try {
      // 1️⃣ Mark lead as entered follow-up
      await API.post(`/leads/${id}/whatsapp-log`);

      // 2️⃣ Navigate to follow-up dashboard
      navigate("/followup");
    } catch (err) {
      console.error("Failed to move lead to follow-up", err);
      alert("Something went wrong");
    }
  }

  /* ------------------------------ HANDLERS FOR CUSTOMIZATION FIELDS ------------------------------ */
  async function handlePDFUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // Max 5MB
      alert("File size exceeds 5MB limit.");
      return;
    }

    setPdfFile(file);
    // Mock URL assignment - in a real app, this would be a real upload call
    const mockUrl = `https://yourdomain.com/docs/${id}-${file.name.replace(
      /\s/g,
      "_"
    )}`;
    setLead({ ...lead, pdf_url: mockUrl });
    console.log(`PDF mock uploaded. URL: ${mockUrl}`);
  }

  function handleAddCapability() {
    setLead({
      ...lead,
      capabilities: [...lead.capabilities, { title: "", desc: "", icon: "✨" }],
    });
  }

  function handleUpdateCapability(index, field, value) {
    const updatedCaps = lead.capabilities.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    setLead({ ...lead, capabilities: updatedCaps });
  }

  function handleRemoveCapability(index) {
    const updatedCaps = lead.capabilities.filter((_, i) => i !== index);
    setLead({ ...lead, capabilities: updatedCaps });
  }

  function handleSelectImage(imageUrl) {
    setLead({ ...lead, thumbnail: imageUrl });
  }

  if (!lead)
    return (
      <p className="p-8 text-center text-xl text-gray-600">
        Loading Lead Details...
      </p>
    );

  // Field configurations for rendering
  const coreFields = [
    { key: "name", label: "Business Name" },
    { key: "phone", label: "Contact Phone" },
    { key: "address", label: "Address" },
    { key: "category", label: "Category" },
  ];
  const ctaFields = [
    { key: "cta_title", label: "CTA Headline" },
    { key: "cta_button", label: "CTA Button Text" },
  ];
  const heroFields = [
    { key: "hero_title", label: "Website Headline" },
    { key: "hero_subtitle", label: "Website Sub-Headline" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR: Premium Header */}
      <nav className="sticky top-0 z-50 shadow-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <span className="text-3xl">⚙️</span> Site Editor: {lead.name}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/all-leads")}
            className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            ← Back to Leads
          </button>
          <button
            onClick={() => setTemplateFull(!templateFull)}
            className="bg-white text-teal-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
          >
            {templateFull ? "Split View (Edit)" : "Full Preview"}
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex flex-1 relative">
        {/* TEMPLATE PREVIEW (Left/Full) */}
        <div
          className={`h-[calc(100vh-68px)] sticky top-[68px] overflow-y-auto border-r border-gray-200 transition-all duration-300 bg-white ${
            templateFull ? "w-full" : "w-1/2"
          }`}
        >
          {(() => {
            const Template = selectedTemplate
              ? getTemplateByKey(selectedTemplate) // ✅ user choice FIRST
              : getTemplateByCategory(lead.category); // ✅ fallback only

            return <Template lead={lead} />;
          })()}
        </div>

        {/* EDIT PANEL (Right) */}
        {!templateFull && (
          <div className="w-1/2 h-[calc(100vh-68px)] overflow-y-auto p-8 bg-gray-50 relative">
            <div className="space-y-8 pb-32">
              {/* AI & Quick Save Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleAIEnhance}
                  disabled={loadingAI}
                  className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-xl text-sm transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {loadingAI ? "Analyzing…" : "✨ AI Enhance Content"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* CARD 1: Core Details */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Business Information
                </h3>
                {coreFields.map((field) => (
                  <InputField
                    key={field.key}
                    label={field.label}
                    value={lead[field.key]}
                    onChange={(e) =>
                      setLead({ ...lead, [field.key]: e.target.value })
                    }
                    placeholder={field.label}
                  />
                ))}
                <TextAreaField
                  label="Full Description / About Us"
                  value={lead.description}
                  onChange={(e) =>
                    setLead({ ...lead, description: e.target.value })
                  }
                  placeholder="Write a compelling 'About Us' section..."
                  rows={5}
                />
              </div>

              {/* CARD 2: Hero & CTA Customization */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Website Messaging (Heros & CTA)
                </h3>
                {heroFields.map((field) => (
                  <TextAreaField
                    key={field.key}
                    label={field.label}
                    value={lead[field.key]}
                    onChange={(e) =>
                      setLead({ ...lead, [field.key]: e.target.value })
                    }
                    placeholder={field.label}
                    rows={2}
                  />
                ))}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  {ctaFields.map((field) => (
                    <InputField
                      key={field.key}
                      label={field.label}
                      value={lead[field.key]}
                      onChange={(e) =>
                        setLead({ ...lead, [field.key]: e.target.value })
                      }
                      placeholder={field.label}
                    />
                  ))}
                </div>
              </div>

              {/* CARD 3: Media & Documents */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Media Assets
                </h3>

                {/* Direct Image URL Input */}
                <InputField
                  label="Hero Image URL (Manual Override)"
                  type="url"
                  value={lead.thumbnail}
                  onChange={(e) =>
                    setLead({ ...lead, thumbnail: e.target.value })
                  }
                  placeholder="e.g., https://images.unsplash.com/photo-..."
                />

                {/* Image Preview */}
                {lead.thumbnail && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Image Preview:
                    </label>
                    <img
                      src={lead.thumbnail}
                      alt="Preview"
                      className="w-48 h-32 object-cover rounded-lg shadow-md border-2 border-gray-100"
                    />
                  </div>
                )}

                {/* AI Generated Images Selector */}
                {generatedImages && generatedImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-gray-800 mb-3">
                      AI Generated Image Options:
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-3">
                      {generatedImages.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectImage(img.image_url)}
                          className={`flex-shrink-0 w-48 cursor-pointer rounded-lg overflow-hidden transition transform hover:scale-[1.02] shadow-md ${
                            lead.thumbnail === img.image_url
                              ? "border-4 border-teal-500 ring-2 ring-teal-500"
                              : "border-2 border-gray-200"
                          }`}
                          title={img.prompt}
                        >
                          <img
                            src={img.image_url}
                            alt={`Generated Image ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <p className="p-2 text-xs text-gray-600 bg-gray-50 h-10 overflow-hidden">
                            {img.prompt}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Click an image to set it as the Hero Image.
                    </p>
                  </div>
                )}

                {/* PDF/DOCUMENT UPLOAD: Styled Drop Zone */}
                <div className="border-2 border-dashed border-teal-400 p-5 rounded-xl bg-teal-50/50 mt-6">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                    📄 Document Attachment (Menu, Brochure, etc.)
                  </h4>
                  {lead.pdf_url ? (
                    <a
                      href={lead.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-green-700 underline block mb-3 truncate font-medium"
                    >
                      Current PDF: {lead.pdf_url.split("/").pop()}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">
                      No document attached.
                    </p>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    className="text-sm border-gray-300 p-2 rounded w-full bg-white shadow-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Max 5MB PDF file. Upload requires backend storage
                    integration.
                  </p>
                </div>
              </div>

              {/* CARD 4: Dynamic Capabilities */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                  Dynamic Capabilities / Features
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Define up to 4 key features with icons and descriptions.
                </p>
                <div className="space-y-3">
                  {(lead.capabilities || []).map((cap, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm relative group"
                    >
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Capability #{index + 1}
                      </h4>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveCapability(index)}
                        className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                        title="Remove Capability"
                      >
                        &times;
                      </button>
                      <div className="flex gap-2">
                        <input
                          value={cap.title}
                          onChange={(e) =>
                            handleUpdateCapability(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Title (e.g., Fast Delivery)"
                          className="w-1/3 border p-2 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                        <input
                          value={cap.desc}
                          onChange={(e) =>
                            handleUpdateCapability(
                              index,
                              "desc",
                              e.target.value
                            )
                          }
                          placeholder="Description"
                          className="w-1/2 border p-2 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                        <input
                          value={cap.icon}
                          onChange={(e) =>
                            handleUpdateCapability(
                              index,
                              "icon",
                              e.target.value
                            )
                          }
                          placeholder="Icon (Emoji)"
                          className="w-1/6 border p-2 rounded text-sm text-center focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddCapability}
                  className="mt-4 px-4 py-2 border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition text-sm font-semibold"
                >
                  + Add New Capability Item
                </button>
              </div>
            </div>

            {/* FLOATING ACTION BAR: For Publishing and Follow-up (MODIFIED) */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl flex justify-between items-center z-40">
              <div className="flex gap-4">
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-md transition hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {publishing ? "Deploying..." : "🚀 Publish Website"}
                </button>
                <button
                  onClick={() => goToFollowUp(lead._id)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                ></button>
              </div>
              {lead.web_url && (
                <a
                  href={lead.web_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 font-semibold px-4 py-3 rounded-xl border border-teal-600 hover:bg-teal-50 transition flex items-center gap-1"
                >
                  🔗 View Live Site
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING WHATSAPP BUTTON (UPDATED ICON) */}
      {!templateFull && lead.phone && (
        <button
          onClick={() => setShowWhatsappModal(true)}
          className="fixed bottom-10 right-10 bg-green-500 text-white p-4 rounded-full shadow-2xl z-40 hover:bg-green-600 transition transform hover:scale-105"
          title="Start WhatsApp Chat"
        >
          {/* Using the provided icon URL for the button */}
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-whatsapp-icon-svg-download-png-7573062.png?f=webp"
            alt="WhatsApp Icon"
            className="h-7 w-7"
          />
        </button>
      )}

      {/* WHATSAPP CHAT MODAL */}
      {showWhatsappModal && (
        <WhatsAppChatModal
          lead={lead}
          isLoading={whatsappLoading}
          onSend={logAndOpenWhatsapp}
          onClose={() => setShowWhatsappModal(false)}
        />
      )}
    </div>
  );
}

export default ViewLeadPage;
