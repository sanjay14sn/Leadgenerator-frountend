import React from "react";
import { formatLeadData } from "../../utils/leadFormatter";

function TemplateC_Salon({ lead }) {
  if (!lead) return <p className="p-10 text-center">Loading...</p>;

  // ---- SAFE LEAD ----
  const safeLead = {
    hero_title: lead.hero_title || "",
    hero_subtitle: lead.hero_subtitle || "",
    cta_button: lead.cta_button || "",
    thumbnail: lead.thumbnail || "",
    description: lead.description || "",
    testimonials: lead.testimonials || [],
    ...lead,
  };

  const data = formatLeadData(safeLead);

  const encodedAddress = encodeURIComponent(data.address || "");
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  const ACCENT = "text-pink-500";
  const ACCENT_BORDER = "border-pink-500";
  const PRIMARY_BG = "bg-[#1F2A36]";

  // Icons used inside service cards
  const iconMap = {
    "Hair Styling": (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className={ACCENT}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16 4 16m-4-16v16" />
        <circle cx="9" cy="20" r="3" />
        <circle cx="19" cy="20" r="3" />
      </svg>
    ),
    "Manicure & Pedicure": (
      <svg width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" className={ACCENT}>
        <path d="M12 21h-2a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1zM18 17h-2a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1z" />
        <path d="M22 6L14 14M14 6L22 14" />
      </svg>
    ),
    "Facial Treatments": (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className={ACCENT}>
        <circle cx="15" cy="15" r="9" />
        <path d="M11 15h8M11 11h8" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="18" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    "Waxing & Threading": (
      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className={ACCENT}>
        <path d="M15 3a12 12 0 100 24 12 12 0 000-24zM15 9V3M15 27v-6" />
        <path d="M10 15h10" />
      </svg>
    ),
  };

  const servicesList = [
    { title: "Hair Styling", desc: "Expert cuts, coloring, and styling." },
    { title: "Manicure & Pedicure", desc: "Luxurious nail care with soft finish." },
    { title: "Facial Treatments", desc: "Premium facials for glowing skin." },
    { title: "Waxing & Threading", desc: "Smooth & painless grooming." },
  ];

  return (
    <div className="min-h-screen bg-[#F2F0EB] text-gray-800">
      <div className="max-w-[1400px] mx-auto shadow-xl bg-white">

        {/* ================= HEADER ================= */}
        <header className={`${PRIMARY_BG} text-white px-10 py-5 flex justify-between items-center`}>
          <h1 className="text-3xl font-bold tracking-wide flex gap-2 items-center">
            <svg width="32" height="32" stroke="currentColor" fill="none" strokeWidth="2">
              <path d="M10 20l4-16 4 16M14 4v16" />
              <circle cx="9" cy="20" r="3" />
              <circle cx="19" cy="20" r="3" />
            </svg>
            {data.name?.split(" ")[0] || "Salon"}
          </h1>

          <div className="hidden md:flex gap-8 text-lg tracking-wide">
            {data.phone && <span className="hover:text-pink-300">{data.phone}</span>}
            {data.email && <span className="hover:text-pink-300">{data.email}</span>}
          </div>
        </header>

        {/* ================= HERO BANNER ================= */}
        <section className="relative">
          <img
            src={safeLead.thumbnail || "https://images.pexels.com/photos/853426/pexels-photo-853426.jpeg"}
            className="w-full h-[420px] object-cover"
            alt="Salon Hero"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl md:text-6xl text-white font-extrabold drop-shadow-lg">
              {safeLead.hero_title || "Transform Your Beauty Ritual"}
            </h2>
            <p className="text-white text-xl mt-4 max-w-2xl drop-shadow">
              {safeLead.hero_subtitle ||
                "Experience bespoke luxury salon treatments in a calming ambience."}
            </p>

            <div className="flex gap-4 mt-8">
              <button className="px-8 py-3 bg-white text-gray-800 font-semibold rounded shadow">
                Book Now
              </button>
              <button className="px-8 py-3 bg-[#1F2A36] text-white font-semibold rounded shadow">
                View Services
              </button>
            </div>
          </div>
        </section>

        {/* ================= OUR SERVICES (TOP CARDS) ================= */}
        <section className="py-16 bg-[#FAF7F2] text-center">
          <h3 className="text-3xl font-bold mb-10">Our Services</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-20">
            {servicesList.map((s) => (
              <div key={s.title} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="mb-3 flex justify-center">{iconMap[s.title]}</div>
                <h4 className="font-bold">{s.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button className="px-8 py-3 bg-[#C2A77C] text-white rounded-md">Book Online</button>
            <button className="px-8 py-3 bg-[#1F2A36] text-white rounded-md">View Services</button>
          </div>
        </section>

        {/* ================= ABOUT + MINI IMAGE STRIP ================= */}
        <section className="px-10 py-16 grid lg:grid-cols-2 gap-16 bg-white">
          {/* LEFT TEXT */}
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Salon</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {safeLead.description ||
                "Welcome to a luxury beauty experience where every detail is crafted with care."}
            </p>

            <div className="flex gap-3 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src="https://images.pexels.com/photos/853426/pexels-photo-853426.jpeg"
                  className="w-20 h-20 object-cover rounded-lg shadow"
                  alt="Mini Salon"
                />
              ))}
            </div>
          </div>

          {/* RIGHT — SERVICE IMAGES (3) */}
          <div>
            <h3 className="text-3xl font-bold mb-6">Services</h3>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src="https://images.pexels.com/photos/853426/pexels-photo-853426.jpeg"
                  className="w-full h-40 object-cover rounded-lg shadow"
                  alt="Service"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= CLIENT LOVE + MAP ================= */}
        <section className="px-10 py-16 grid lg:grid-cols-2 gap-16 bg-white">

          {/* TESTIMONIALS */}
          <div>
            <h3 className="text-3xl font-bold mb-6">Client Love</h3>
            <div className="grid gap-6">
              {(safeLead.testimonials.length ? safeLead.testimonials : [
                { name: "Priya S.", text: "Amazing facial! Best salon experience I've had." },
                { name: "Meena R.", text: "Perfect haircut and great ambience!" },
                { name: "Kiran L.", text: "Loved the manicure service!" }
              ]).slice(0, 3).map((t, i) => (
                <div key={i} className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg shadow">
                  <img
                    src="https://randomuser.me/api/portraits/women/65.jpg"
                    className="w-16 h-16 rounded-full object-cover"
                    alt={t.name}
                  />
                  <div>
                    <p className="italic text-gray-700">{`"${t.text}"`}</p>
                    <h4 className="font-semibold text-gray-900 mt-1">{t.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAP + CONTACT */}
          <div>
            <h3 className="text-3xl font-bold mb-6">Contact & Location</h3>

            <iframe
              src={mapSrc}
              className="w-full h-72 rounded-xl shadow border"
              loading="lazy"
            />

            <p className="text-gray-700 mt-4 text-lg">📍 {data.address}</p>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-[#1F2A36] text-white text-center py-10">
          <p>© {new Date().getFullYear()} {data.name}. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default TemplateC_Salon;
