import React from "react";
import { motion } from "framer-motion";
import { formatLeadData } from "../../utils/leadFormatter";

function Template_KidsPlay({ lead }) {
  if (!lead) {
    return <div className="p-10 text-center text-gray-500">Loading…</div>;
  }

  const safeLead = {
    hero_title: lead.hero_title || "Providing Good Qualities For Your Loving Kids",
    hero_subtitle: lead.hero_subtitle || "Welcome to Kids Play",
    cta_button: lead.cta_button || "Buy Ticket",
    thumbnail: lead.thumbnail || "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg",
    description: lead.description || "There are many variations of passages of Lorem Ipsum available, but the majority suffered alteration.",
    testimonials: lead.testimonials || [],
    ...lead,
  };

  const data = formatLeadData(safeLead);

  const encodedAddress = encodeURIComponent(data.address || "New York, USA");
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  const defaultTestimonials = [
    { name: "Wade Warren", place: "Toledo", text: "I want you to know that everyone is very impressed and pleased with the work of your entire teams.", color: "bg-blue-100" },
    { name: "Jane Cooper", place: "Austin", text: "The environment is so safe and the staff is incredibly friendly. My kids never want to leave!", color: "bg-yellow-100" },
    { name: "Savannah Nguyen", place: "Owaria", text: "Best playground in the city. The indoor activities are creative and very engaging for all ages.", color: "bg-pink-100" },
  ];

  const testimonials = safeLead.testimonials.length > 0 ? safeLead.testimonials : defaultTestimonials;

  const PURPLE = "bg-[#8E44AD]";
  const PURPLE_TEXT = "text-[#8E44AD]";

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF9F1] text-gray-700 overflow-x-hidden font-sans">

      {/* ================= NAVBAR ================= */}
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center justify-between sticky top-0 bg-[#FFF9F1]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-pink-500 text-white font-bold rounded-lg px-2 py-1 md:px-3 md:py-1 text-sm md:text-base">
            {data.name ? data.name.substring(0, 2).toUpperCase() : "KP"}
          </div>
          <span className="text-xl md:text-2xl font-bold truncate max-w-[150px] md:max-w-none">
            {data.name || "Kids Play"}
          </span>
        </div>

        <div className="hidden lg:flex gap-8 font-medium">
          <a href="#" className={`${PURPLE_TEXT} hover:opacity-80`}>Home</a>
          <a href="#" className="hover:text-[#8E44AD] transition">About</a>
          <a href="#" className="hover:text-[#8E44AD] transition">Services</a>
          <a href="#" className="hover:text-[#8E44AD] transition">Contact</a>
        </div>

        <button className={`${PURPLE} text-white px-4 py-2 md:px-6 md:py-2 rounded-full font-semibold shadow hover:opacity-90 transition text-sm md:text-base`}>
          {safeLead.cta_button}
        </button>
      </nav>

      {/* ================= HERO ================= */}
      <section className="w-full py-12 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="space-y-6 text-center md:text-left order-2 md:order-1"
          >
            <span className="text-blue-500 font-semibold uppercase tracking-wider text-sm block">
              {safeLead.hero_subtitle}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              {safeLead.hero_title}
            </h1>
            <button className={`${PURPLE} text-white px-8 py-3 md:py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform active:scale-95`}>
              {safeLead.cta_button}
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative flex justify-center order-1 md:order-2"
          >
            <div className="aspect-square w-full max-w-[300px] md:max-w-[420px] relative">
              <div className="absolute inset-0 rounded-full border-[10px] md:border-[14px] border-white shadow-2xl overflow-hidden z-10">
                <img src={safeLead.thumbnail} alt={data.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 md:w-32 md:h-32 bg-yellow-400 rounded-full -z-0 animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative">
            <div className="rounded-[32px] md:rounded-[48px] overflow-hidden border-[8px] md:border-[12px] border-[#F5EDFF] shadow-xl">
              <img src="https://images.pexels.com/photos/1912868/pexels-photo-1912868.jpeg" className="w-full h-[300px] md:h-[420px] object-cover" alt="About" />
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
            <span className={`${PURPLE_TEXT} font-semibold uppercase text-sm`}>About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Special Care For <br className="hidden md:block" /> Your Children</h2>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">{safeLead.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Experienced Staff", "Safety First", "Creative Learning", "Daily Activities"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">✔</span>
                  <span className="font-medium text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED SERVICES ================= */}
      <section className="w-full py-16 md:py-24 bg-[#FFF9F1]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 md:mb-14 text-center md:text-left">
            <span className={`${PURPLE_TEXT} font-semibold uppercase text-sm`}>Featured</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Discover The Best Playground Fun</h2>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Safety Zone", icon: "🛡️", color: "bg-green-500" },
              { title: "Kids Entertainment", icon: "🎭", color: "bg-blue-400" },
              { title: "Playland & Cafe", icon: "🍕", color: "bg-pink-500" },
            ].map((s) => (
              <motion.div key={s.title} variants={fadeInUp} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border-b-[6px] border-gray-100 hover:-translate-y-2 transition-transform">
                <div className={`${s.color} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6 shadow-md`}>
                  {s.icon}
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-2">{s.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed text-balance">Fun, safe and engaging activities designed for kids to learn through play.</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= ACTIVITY SERVICES ================= */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-purple-600 font-semibold uppercase text-sm">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">The Largest Indoor Activity</h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-12 md:mt-16 text-left">
            {[
              { title: "Indoor & Outdoor Play Areas", img: "https://images.pexels.com/photos/3661354/pexels-photo-3661354.jpeg" },
              { title: "Supervised Playtime", img: "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg" },
              { title: "Playgroup Sessions", img: "https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg" },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeInUp} className="bg-[#FFF9F1] rounded-[28px] overflow-hidden shadow hover:shadow-xl transition-shadow group">
                <div className="overflow-hidden h-48 md:h-56">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-6">
                  <h4 className="text-lg md:text-xl font-bold mb-3 group-hover:text-[#8E44AD] transition-colors">{item.title}</h4>
                  <p className="text-gray-500 text-sm">Providing a safe environment for physical and social development through curated sessions.</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= MAP & ADDRESS ================= */}
      <section className="w-full py-16 md:py-24 bg-[#FFF9F1]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Visit {data.name}</h2>
            <div className="p-6 md:p-8 bg-white rounded-[32px] shadow-sm inline-block w-full">
              <div className="mb-6">
                <p className="text-lg md:text-xl font-bold mb-2 flex items-center justify-center lg:justify-start gap-2">📍 Our Location</p>
                <p className="text-gray-600 text-sm md:text-base">{data.address || "Address not provided"}</p>
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold mb-2 flex items-center justify-center lg:justify-start gap-2">📞 Phone Number</p>
                <p className="text-gray-600 text-sm md:text-base">{data.phone || "Contact info not available"}</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
             className="h-[300px] md:h-[400px] rounded-[32px] md:rounded-[40px] overflow-hidden border-4 md:border-8 border-white shadow-xl"
          >
            <iframe src={mapSrc} className="w-full h-full grayscale hover:grayscale-0 transition duration-700" loading="lazy" title="Location"></iframe>
          </motion.div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="w-full py-16 md:py-24 bg-[#FFF4E9]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-purple-600 font-semibold uppercase text-sm">Parent Reviews</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-900">What People Say</h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-16">
            {testimonials.map((t, idx) => (
              <motion.div key={idx} variants={fadeInUp} className={`${t.color || 'bg-white'} rounded-[32px] p-6 md:p-8 relative shadow-sm hover:shadow-md transition-shadow`}>
                <div className="text-4xl md:text-5xl absolute top-4 left-4 opacity-10">“</div>
                <p className="text-gray-700 mb-6 text-sm md:text-base leading-relaxed relative z-10 italic">
                  {t.text || "Wonderful experience for the children. Very professional and caring staff!"}
                </p>
                <div className="flex justify-center gap-1 mb-4 text-yellow-500 text-xs">★★★★★</div>
                <div className="font-bold text-gray-900 text-sm md:text-base">{t.name}</div>
                {t.place && <div className="text-xs text-gray-500 mt-1">{t.place}</div>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1A1A1A] text-white pt-16 md:pt-20 pb-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="text-center sm:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-4">{data.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{safeLead.description.substring(0, 100)}...</p>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold mb-4 text-pink-500">Contact</h4>
            <ul className="text-gray-400 text-sm space-y-3">
              <li className="flex items-center justify-center sm:justify-start gap-2 truncate">📍 {data.address}</li>
              <li className="flex items-center justify-center sm:justify-start gap-2">📞 {data.phone}</li>
              <li className="flex items-center justify-center sm:justify-start gap-2">✉️ {data.email}</li>
            </ul>
          </div>
          <div className="hidden lg:block">
            <h4 className="font-bold mb-4 text-blue-400">Quick Links</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="hover:text-white cursor-pointer transition">About Us</li>
              <li className="hover:text-white cursor-pointer transition">Safety Standards</li>
              <li className="hover:text-white cursor-pointer transition">Parent Portal</li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold mb-4 text-yellow-400">Join Newsletter</h4>
            <div className="flex bg-white/10 rounded-full p-1 max-w-[300px] mx-auto sm:mx-0">
              <input className="bg-transparent px-4 text-xs md:text-sm w-full focus:outline-none" placeholder="Email address" />
              <button className={`${PURPLE} px-4 py-2 rounded-full text-xs`}>Join</button>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-gray-500 text-xs px-6">
          © {new Date().getFullYear()} {data.name}. All Rights Reserved. Designed for Loving Kids.
        </div>
      </footer>
    </div>
  );
}

export default Template_KidsPlay;