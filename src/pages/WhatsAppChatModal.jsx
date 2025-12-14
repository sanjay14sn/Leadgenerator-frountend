// src/pages/WhatsAppChatModal.jsx (Create this new file or place within ViewLeadPage.jsx)

import React, { useState, useEffect } from 'react';

// Mock Templates for demonstration
const WHATSAPP_TEMPLATES = [
    { title: "Standard Intro", message: "Hi {name}, I noticed your business {category} and wanted to share how we can significantly boost your online presence. Click here to view your personalized site: {web_url}" },
    { title: "Follow-up", message: "Hello {name}, just checking in regarding the site we created for {category}. Have you had a chance to review it? Let me know if you have any questions! {web_url}" },
    { title: "Pricing Inquiry", message: "Hi {name}, thanks for reaching out! Here is the link to our full pricing brochure and your personalized site: {web_url} (or PDF: {pdf_url})" },
];

const WhatsAppChatModal = ({ lead, isLoading, onSend, onClose }) => {
    const defaultTemplate = WHATSAPP_TEMPLATES[0].message
        .replace(/{name}/g, lead.name)
        .replace(/{category}/g, lead.category || 'your sector')
        .replace(/{web_url}/g, lead.web_url || 'https://default-site.com')
        .replace(/{pdf_url}/g, lead.pdf_url || 'N/A');

    const [message, setMessage] = useState(defaultTemplate);
    const [templateTitle, setTemplateTitle] = useState(WHATSAPP_TEMPLATES[0].title);

    const handleTemplateChange = (template) => {
        setTemplateTitle(template.title);
        let content = template.message
            .replace(/{name}/g, lead.name)
            .replace(/{category}/g, lead.category || 'your sector')
            .replace(/{web_url}/g, lead.web_url || 'https://default-site.com')
            .replace(/{pdf_url}/g, lead.pdf_url || 'N/A');
        setMessage(content);
    };

    const handleSendClick = () => {
        if (message.trim()) {
            onSend(message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
                
                {/* Header */}
                <div className="p-5 border-b bg-teal-500 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        💬 Initiate WhatsApp Chat with {lead.name}
                    </h3>
                    <button onClick={onClose} className="text-2xl text-white opacity-80 hover:opacity-100">
                        &times;
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden">
                    
                    {/* Template Sidebar */}
                    <div className="w-1/3 border-r p-4 bg-gray-50 overflow-y-auto">
                        <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Select Template</h4>
                        {WHATSAPP_TEMPLATES.map((t) => (
                            <button
                                key={t.title}
                                onClick={() => handleTemplateChange(t)}
                                className={`block w-full text-left p-3 rounded-lg mb-2 text-sm transition ${
                                    templateTitle === t.title 
                                        ? 'bg-teal-100 text-teal-800 font-bold border-2 border-teal-400' 
                                        : 'bg-white hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {t.title}
                            </button>
                        ))}
                    </div>

                    {/* Chat Editor */}
                    <div className="w-2/3 p-4 flex flex-col">
                        <div className="mb-4 text-sm font-medium text-gray-700">
                            Sending to: <span className="text-teal-600 font-bold">{lead.phone}</span>
                            <div className="text-xs text-gray-500 mt-1">Template: {templateTitle}</div>
                        </div>

                        <textarea
                            className="flex-1 border border-gray-300 p-4 rounded-lg resize-none focus:ring-teal-500 focus:border-teal-500 text-gray-800 shadow-inner"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your custom message..."
                        />
                        
                        <div className="text-xs text-gray-500 mt-2">
                            The text above will be pre-filled when WhatsApp opens. You can still edit it there.
                        </div>
                    </div>
                </div>

                {/* Footer / Action */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={handleSendClick}
                        disabled={isLoading || !message.trim()}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md transition hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? "Logging & Opening..." : "➡️ Open WhatsApp & Log Action"}
                    </button>
                </div>
            </div>
        </div>
    );
};