import React, { useState, useEffect } from "react";

/* -------------------------------------------
   WHATSAPP SALES TEMPLATE (PRESCHOOL)
------------------------------------------- */
const WHATSAPP_TEMPLATES = [
  {
    title: "Preschool Website Demo",
    message: `Mam/Sir,

I built a beautiful demo website for your preschool 👶🎓

🌐 Demo Link:
{web_url}

Today, most parents search on Google before calling a school.
This website helps you get more enquiries and build strong trust.

If you like this demo, I can complete the full website within 1 day.

Reply YES to proceed 👍`
  }
];

/* -------------------------------------------
   WHATSAPP CHAT MODAL COMPONENT
------------------------------------------- */
const WhatsAppChatModal = ({
  lead,
  isLoading = false,
  onSend,
  onClose,
}) => {
  /* -------------------------------------------
     PREPARE DEFAULT MESSAGE
  ------------------------------------------- */
  const buildMessage = (template) =>
    template
      .replace(/{name}/g, lead?.name || "Sir/Madam")
      .replace(/{category}/g, lead?.category || "your business")
      .replace(
        /{web_url}/g,
        lead?.web_url || "https://kidz-play-school-velachery.iqsync.in/"
      )
      .replace(/{pdf_url}/g, lead?.pdf_url || "");

  const [templateTitle, setTemplateTitle] = useState(
    WHATSAPP_TEMPLATES[0].title
  );
  const [message, setMessage] = useState(
    buildMessage(WHATSAPP_TEMPLATES[0].message)
  );

  /* -------------------------------------------
     TEMPLATE CHANGE HANDLER
  ------------------------------------------- */
  const handleTemplateChange = (template) => {
    setTemplateTitle(template.title);
    setMessage(buildMessage(template.message));
  };

  /* -------------------------------------------
     OPEN WHATSAPP + LOG ACTION
  ------------------------------------------- */
  const handleSendClick = () => {
    if (!message.trim()) return;

    const phone = (lead?.phone || "").replace(/\D/g, "");
    if (!phone) {
      alert("Invalid phone number");
      return;
    }

    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    window.open(
      `https://wa.me/91${phone}?text=${encodedMessage}`,
      "_blank"
    );

    // Log follow-up in backend
    if (onSend) {
      onSend(message);
    }
  };

  /* -------------------------------------------
     UI
  ------------------------------------------- */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col h-[600px] overflow-hidden">

        {/* HEADER */}
        <div className="px-5 py-4 bg-green-600 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold">
            💬 WhatsApp Pitch – {lead?.name || "Lead"}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none hover:opacity-80"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* TEMPLATE LIST */}
          <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
            <h4 className="font-semibold text-gray-700 mb-3">
              Message Templates
            </h4>

            {WHATSAPP_TEMPLATES.map((t) => (
              <button
                key={t.title}
                onClick={() => handleTemplateChange(t)}
                className={`w-full text-left p-3 mb-2 rounded-lg text-sm transition ${
                  templateTitle === t.title
                    ? "bg-green-100 border-2 border-green-500 font-bold"
                    : "bg-white border hover:bg-gray-100"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* MESSAGE EDITOR */}
          <div className="w-2/3 p-4 flex flex-col">
            <div className="mb-2 text-sm text-gray-600">
              Sending to:
              <span className="font-bold text-green-700 ml-1">
                {lead?.phone}
              </span>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-4 resize-none focus:ring-green-500 focus:border-green-500"
              placeholder="WhatsApp message..."
            />

            <p className="text-xs text-gray-500 mt-2">
              Message will open in WhatsApp. You can edit before sending.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={handleSendClick}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md disabled:opacity-50"
          >
            {isLoading ? "Opening..." : "➡️ Open WhatsApp & Log"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChatModal;
