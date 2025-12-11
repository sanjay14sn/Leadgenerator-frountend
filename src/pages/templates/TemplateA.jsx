import React from "react";
import { formatLeadData } from "../../utils/leadFormatter";
import { useNavigate } from "react-router-dom"; 

function TemplateB({ lead }) {
  const data = formatLeadData(lead);
  const navigate = useNavigate(); 

  const encodedAddress = encodeURIComponent(data.address);
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  const iconMap = {
    "Premium Quality": "⭐",
    "Fast Delivery": "⚡",
    "Customer Support": "📞",
    "Affordable Pricing": "💰",
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* MAIN WRAPPER FOR CENTERING */}
      <div className="w-full max-w-7xl mx-auto shadow-2xl bg-white">

        {/* ================= HEADER (Dark Purple) ================= */}
        <header className="flex justify-between items-center py-4 px-8 bg-purple-800 text-white">
          <h1 className="text-2xl font-extrabold tracking-wider">
            {data.name.split(" ")[0]}
            <span className="text-teal-400">
              {data.name.split(" ")[1] || ""}
            </span>
            <span className="text-base ml-2 font-normal">Templates</span>
          </h1>

          <div className="hidden md:flex gap-4 text-sm font-medium"> {/* Hiding contact info on small screens */}
            <span className="hover:text-teal-400 cursor-pointer">{data.email || "info@domain.com"}</span>
            <span className="hover:text-teal-400 cursor-pointer">{data.phone}</span>
          </div>
        </header>

        {/* ================= HERO SECTION (Clean Grid) ================= */}
        <section className="px-8 py-20 bg-white grid lg:grid-cols-3 gap-12 items-center">
            
            {/* Left Column: Title and CTAs */}
            <div className="lg:col-span-2">
                <h2 className="text-5xl font-extrabold leading-tight text-gray-900">
                    {lead.hero_title || "Unlock Your Business's Full Potential"}
                </h2>

                <p className="text-gray-600 mt-5 text-xl max-w-3xl">
                    {lead.hero_subtitle || `Lead, hero subtitle here about services and trust. Trusted by thousands—powered by ${data.name}.`}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8"> {/* Added sm:flex-row for responsiveness */}
                    <button className="px-8 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-800 transition transform hover:scale-105">
                        {lead.cta_button || "Discover More"}
                    </button>
                    <button className="px-8 py-3 border border-gray-300 text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition">
                        Get Started
                    </button>
                </div>
            </div>

            {/* Right Column: Image and Contact Info Block */}
            <div className="lg:col-span-1 flex flex-col items-center">
                <img
                    src={lead.thumbnail || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                    alt="Business Owner"
                    className="rounded-xl w-full h-80 object-cover shadow-xl border-4 border-gray-100"
                />
                
                <div className="w-full mt-6 p-4 bg-gray-100 rounded-lg text-center">
                    <p className="font-bold text-gray-800 text-lg">📞 Contact Now</p>
                    <p className="text-purple-700 font-extrabold text-xl mt-1">{data.phone}</p>
                </div>
            </div>
        </section>

        {/* ================= ABOUT & CAPABILITIES SECTION (RESPONSIVE) ================= */}
        <section className="grid lg:grid-cols-2 bg-gray-50 border-t border-b border-gray-200">
            {/* About Us Block */}
            <div className="p-10 border-r border-gray-200">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">About Us</h3>
                <p className="text-gray-700 text-lg leading-relaxed max-w-xl">
                    {lead.description || "At Your Company Name, we are committed to delivering high-quality services that help businesses grow. Dedicated and powered by local expertise, we strive for operational excellence and customer satisfaction."}
                </p>
            </div>

            {/* Capabilities Block (Services) */}
            <div className="p-10">
                <h3 className="text-3xl font-bold mb-8 text-gray-900">Our Capabilities</h3>
                {/* CRITICAL CHANGE: Changed grid to be 1 column on mobile, 2 columns on small screens and up */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> 
                    {[
                        { title: "Premium Quality", desc: "Always delivering the best." },
                        { title: "Fast Delivery", desc: "Quick and efficient service." },
                        { title: "Customer Support", desc: "Always there for our clients." },
                        { title: "Affordable Pricing", desc: "Growth shouldn't break the bank." },
                    ].map((c) => (
                        <div key={c.title} className="p-4 bg-white rounded-xl shadow-md flex items-start gap-3">
                            <span className="text-2xl text-purple-600">{iconMap[c.title]}</span>
                            <div>
                                <p className="font-bold text-gray-800">{c.title}</p>
                                <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ================= TESTIMONIALS & MAP ================= */}
        <section className="px-8 py-16 bg-white grid lg:grid-cols-2 gap-12">
            
            {/* Testimonials */}
            <div>
                <h3 className="text-3xl font-bold mb-8 text-gray-900">What Our Clients Say</h3>
                <div className="grid gap-6">
                    {(lead.testimonials?.length ? lead.testimonials : [
                        { name: "Raj Patel", text: "Great service and amazing quality! They transformed our online marketing." },
                        { name: "Anya Sharma", text: "Really satisfied with the experience. Highly responsive and professional." },
                        { name: "Vikram Singh", text: "Highly recommended! The best solution for local business growth." },
                    ]).slice(0, 3).map((review, i) => (
                        <div key={i} className="p-5 border-l-4 border-purple-600 bg-gray-50 rounded-r-lg shadow-sm">
                            <p className="italic text-gray-700">"{review.text}"</p>
                            <h4 className="font-semibold text-purple-700 mt-3">{review.name}</h4>
                            <p className="text-xs text-gray-500">Satisfied Customer</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map */}
            <div>
                <h3 className="text-3xl font-bold mb-8 text-gray-900">Find Us</h3>
                <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden">
                    <iframe
                        title="location"
                        src={mapSrc}
                        className="w-full h-80"
                        loading="lazy"
                        allowFullScreen=""
                    ></iframe>
                </div>
                <p className="text-gray-600 mt-4 text-center">📍 {data.address}</p>
            </div>
        </section>

        {/* ================= CTA (Action Bar) ================= */}
        <section className="px-8 py-16 bg-purple-700 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-8">
            <h2 className="text-4xl font-extrabold leading-snug text-center md:text-left">
              Ready to Grow?
              <p className="text-xl font-normal mt-2 text-purple-200">
                Join thousands of successful businesses today.
              </p>
            </h2>

            <button className="px-10 py-4 bg-white text-purple-700 font-bold rounded-xl shadow-2xl text-lg hover:bg-gray-100 transition transform hover:scale-105">
              {lead.cta_button || "Get Started Today!"}
            </button>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="py-8 px-8 bg-gray-800 text-gray-400 text-sm text-center">
            <p className="mb-2">
                © {new Date().getFullYear()} {data.name}. All rights reserved.
            </p>
            <p>Designed with {data.name} / LeadGen Pro</p>
        </footer>

      </div>
    </div>
  );
}

export default TemplateB;