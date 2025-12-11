import React from "react";
import { formatLeadData } from "../../utils/leadFormatter";


function TemplateB_CarWash({ lead }) {

  // Prevent crash if lead is undefined
  if (!lead) {
    return <p className="p-10 text-center text-gray-600">Loading...</p>;
  }

  // Ensure hero_title, subtitle etc always exist
  const safeLead = {
    hero_title: lead.hero_title || "",
    hero_subtitle: lead.hero_subtitle || "",
    cta_button: lead.cta_button || "",
    description: lead.description || "",
    testimonials: lead.testimonials || [],
    thumbnail: lead.thumbnail || "",
    ...lead,
  };

  const data = formatLeadData(safeLead);

  const encodedAddress = encodeURIComponent(data.address || "");
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  // --- Theme Constants ---
  const PRIMARY_COLOR = "bg-blue-800";
  const ACCENT_COLOR = "text-teal-400"; // Used for pop/shine
  const BORDER_COLOR = "border-blue-600";
  
  // SVG ICONS (using optimized paths for sleek, modern look)
  const iconMap = {
    "Deep Exterior Clean": (
      <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" className={ACCENT_COLOR}>
        {/* Spray/Water drop */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v8m-4-4h8" />
      </svg>
    ),
    "Wax & Protectant": (
      <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" className={ACCENT_COLOR}>
        {/* Star/Shine */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.62 12 2 9.19 8.62 2 9.24 7.46 13.97 5.82 21z" />
      </svg>
    ),
    "Interior Vacuum": (
      <svg width="30" height="30" className={ACCENT_COLOR} fill="none" stroke="currentColor" strokeWidth="2">
        {/* Vacuum cleaner symbol */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12V4h6v8M6 18h14M3 22h18V10H3z" />
      </svg>
    ),
    "Tire Shine": (
      <svg width="30" height="30" className={ACCENT_COLOR} fill="none" stroke="currentColor" strokeWidth="2">
        {/* Wheel/Tire */}
        <circle cx="15" cy="15" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7v16M7 15h16" />
      </svg>
    ),
  };

  const servicesList = [
    { title: "Deep Exterior Clean", desc: "Foam wash and rinse for a spotless finish." },
    { title: "Wax & Protectant", desc: "Long-lasting shine and paint protection." },
    { title: "Interior Vacuum", desc: "Seats, carpets, mats — thoroughly cleaned." },
    { title: "Tire Shine", desc: "Restores a deep rich look to your tires." },
  ];

  // Helper for short name in App Bar
  const shortName = data.name.split(' ')[0] || "Clean";


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="w-full max-w-7xl mx-auto shadow-2xl bg-white">

        {/* ================= HEADER (PREMIUM APP BAR) ================= */}
        <header className={`flex justify-between items-center py-4 px-8 ${PRIMARY_COLOR} text-white shadow-lg`}>
          <h1 className="text-2xl font-extrabold tracking-widest flex gap-3 items-center">
            {/* Car icon for logo */}
            <svg width="30" height="30" fill="currentColor" className={ACCENT_COLOR}>
              <path d="M3 13l2-5h14l2 5v8H3z" />
              <circle cx="7" cy="19" r="2" />
              <circle cx="17" cy="19" r="2" />
            </svg>

            {/* Only show the short name */}
            {shortName}
            <span className="text-base ml-1 font-normal text-blue-200">Wash</span>
          </h1>

          <div className="hidden md:flex gap-6 text-sm font-semibold">
            {data.phone && <span className="hover:text-teal-400 transition cursor-pointer">{data.phone}</span>}
            {data.email && <span className="hover:text-teal-400 transition cursor-pointer">{data.email}</span>}
          </div>
        </header>

        {/* ================= HERO SECTION ================= */}
        <section className="px-8 py-20 bg-white grid lg:grid-cols-3 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            <h2 className="text-6xl font-extrabold leading-tight text-gray-900">
              {lead?.hero_title || "Your Car, Restored to Premium Shine"}
            </h2>

            <p className="text-gray-600 mt-6 text-xl max-w-4xl border-l-4 border-teal-400 pl-4">
              {lead?.hero_subtitle ||
                "Professional car wash & detailing that protects and restores your vehicle’s beauty."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button className={`px-10 py-4 ${PRIMARY_COLOR} text-white rounded-lg font-bold shadow-xl hover:bg-blue-900 transition transform hover:scale-[1.02]`}>
                {lead?.cta_button || "View Packages"}
              </button>

              <button className="px-10 py-4 border border-blue-600 text-blue-800 rounded-lg font-bold hover:bg-blue-50 transition">
                Book Appointment
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE + CONTACT */}
          <div className="flex flex-col items-center">
            <img
              src={
                lead?.thumbnail ||
                "https://images.pexels.com/photos/17228229/pexels-photo-17228229/free-photo-of-man-washing-car.jpeg"
              }
              alt="Car Wash"
              className="rounded-xl w-full h-80 object-cover shadow-2xl border-4 border-teal-400"
            />

            <div className="w-full mt-6 p-4 bg-gray-100 rounded-lg text-center">
              <p className="font-bold text-lg text-gray-800">📞 Quick Contact</p>
              <p className="text-blue-700 font-extrabold text-2xl mt-1">
                {data.phone || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* ================= ABOUT + SERVICES ================= */}
        <section className="grid lg:grid-cols-2 bg-gray-50 border-t border-b border-gray-200">

          <div className="p-12 border-r border-gray-200">
            <h3 className="text-3xl font-bold mb-6 text-gray-900">Why Choose Us?</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {lead?.description ||
                "We offer premium car detailing, eco-friendly cleaning, and exceptional customer service. Our dedicated team ensures every vehicle leaves looking and feeling brand new."}
            </p>
          </div>

          {/* SERVICES GRID */}
          <div className="p-12">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Our Popular Services</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {servicesList.map((s) => (
                <div key={s.title} className="p-4 bg-white rounded-xl shadow-lg flex gap-4 items-start border-b-4 border-teal-400">
                  {iconMap[s.title]}
                  <div>
                    <p className="font-bold text-gray-900">{s.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS + MAP ================= */}
        <section className="px-8 py-16 grid lg:grid-cols-2 gap-12">

          {/* TESTIMONIALS */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Customer Feedback</h3>

            <div className="grid gap-6">
              {(lead?.testimonials?.length
                ? lead.testimonials
                : [
                    { name: "John D.", text: "Fantastic service! My car looks new, and the paint protection is noticeable." },
                    { name: "Aisha M.", text: "Interior cleaning was spotless! Worth every penny for the attention to detail." },
                    { name: "Vijay R.", text: "Affordable and fast! I can always rely on them for a quick, perfect wash." },
                  ]
              )
                .slice(0, 3)
                .map((review, i) => (
                  <div key={i} className={`p-5 border-l-4 ${BORDER_COLOR} bg-gray-50 rounded-r-lg shadow`}>
                    <p className="italic text-gray-700">{`"${review.text}"`}</p>
                    <h4 className="font-semibold text-blue-700 mt-3">{review.name}</h4>
                  </div>
                ))}
            </div>
          </div>

          {/* MAP */}
          <div>
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Visit Our Location</h3>

            <div className="bg-gray-100 rounded-xl shadow-xl overflow-hidden border-4 border-gray-100">
              <iframe
                title="Location Map"
                src={mapSrc}
                className="w-full h-80"
                loading="lazy"
              ></iframe>
            </div>

            <p className="text-gray-600 mt-4 text-center text-lg font-medium">📍 {data.address}</p>
          </div>
        </section>

        {/* ================= CTA (Action Bar) ================= */}
        <section className={`px-8 py-16 ${PRIMARY_COLOR} text-white`}>
          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-8">
            <h2 className="text-4xl font-extrabold leading-snug text-center md:text-left">
              Ready for a Showroom Shine?
              <p className="text-blue-200 text-xl mt-2 font-medium">Book your wash appointment today.</p>
            </h2>

            <button className={`px-10 py-4 bg-white ${ACCENT_COLOR.replace('text-', 'text-')} rounded-xl font-bold shadow-2xl hover:bg-gray-100 transition transform hover:scale-[1.05]`}>
              {lead?.cta_button || "Book Now"}
            </button>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-8 px-8 bg-gray-900 text-gray-400 text-sm text-center">
          © {new Date().getFullYear()} {data.name}. All rights reserved. | Powered by LeadGen Pro
        </footer>
      </div>
    </div>
  );
}

export default TemplateB_CarWash;