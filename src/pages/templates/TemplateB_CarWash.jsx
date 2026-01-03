// import React, { useState } from "react";
// import { formatLeadData } from "../../utils/leadFormatter";

// function TemplateB_DentalPremium({ lead }) {
//   const [activeSlide, setActiveSlide] = useState(0);

//   if (!lead) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <p className="text-xl font-light text-slate-400 animate-pulse">Initializing Clinic Interface...</p>
//       </div>
//     );
//   }

//   const safeLead = {
//     hero_title: lead.hero_title || "Excellence in Modern Dentistry",
//     hero_subtitle: lead.hero_subtitle || "Providing world-class oral healthcare with a gentle, patient-centered approach.",
//     description: lead.description || "Our hospital is equipped with the latest dental technology and a team of specialists dedicated to providing the highest standard of care in a comfortable, premium environment.",
//     ...lead,
//   };

//   const data = formatLeadData(safeLead);
//   const encodedAddress = encodeURIComponent(data.address || "Medical District");
//   const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`; 

//   // --- Premium Assets ---
//   const galleryImages = [
   
//     "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200",
//     "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200",
//     "https://images.unsplash.com/photo-1629909608185-42f4b717842b?auto=format&fit=crop&q=80&w=1200"
//   ];

//   const PRIMARY_COLOR = "bg-indigo-950";
//   const ACCENT_TEXT = "text-emerald-500";
//   const ACCENT_BG = "bg-emerald-500";

//   return (
//     <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
      
//       {/* ================= HEADER ================= */}
//       <header className={`sticky top-0 z-50 flex justify-between items-center py-4 px-8 ${PRIMARY_COLOR} text-white shadow-xl`}>
//         <div className="flex gap-3 items-center">
//           <div className={`${ACCENT_BG} p-1.5 rounded-md`}>
//             <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
//           </div>
//           <h1 className="text-lg font-bold tracking-tight uppercase">
//             {data.name.split(' ')[0]} <span className="font-light text-slate-400">Dental</span>
//           </h1>
//         </div>
//         <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest items-center">
//           <span className="hover:text-emerald-400 cursor-pointer transition">{data.phone}</span>
//           <button className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-full transition shadow-lg">Book Now</button>
//         </div>
//       </header>

//       {/* ================= HERO & SLIDER ================= */}
//       <section className="relative h-[70vh] overflow-hidden bg-slate-900">
//         {galleryImages.map((img, idx) => (
//           <div 
//             key={idx}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-60' : 'opacity-0'}`}
//           >
//             <img src={img} alt="Clinic Interior" className="w-full h-full object-cover" />
//           </div>
//         ))}
        
//         <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
//           <span className="text-emerald-400 font-bold tracking-[0.4em] uppercase text-sm mb-4">Welcome to {data.name}</span>
//           <h2 className="text-5xl md:text-7xl font-serif text-white max-w-4xl leading-tight">
//             {safeLead.hero_title}
//           </h2>
//           <div className="flex gap-4 mt-10">
//             <button 
//               onClick={() => setActiveSlide((prev) => (prev + 1) % galleryImages.length)}
//               className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/20 transition"
//             >
//               <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ================= ABOUT US ================= */}
//       <section className="py-24 px-8 max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
//         <div className="relative">
//           <img 
//             src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" 
//             alt="Doctor Consulting" 
//             className="rounded-2xl shadow-2xl relative z-10"
//           />
//           <div className="absolute -bottom-6 -right-6 bg-emerald-500 p-8 rounded-2xl text-white shadow-xl z-20 hidden md:block">
//             <p className="text-4xl font-bold">15+</p>
//             <p className="text-sm font-medium opacity-90 uppercase tracking-tighter">Years of Excellence</p>
//           </div>
//         </div>
        
//         <div>
//           <h3 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">About Our Practice</h3>
//           <h2 className="text-4xl font-serif text-indigo-950 mb-6 leading-snug">Restoring Confidence, One Smile at a Time.</h2>
//           <p className="text-slate-600 text-lg leading-relaxed mb-8">
//             {safeLead.description}
//           </p>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {['Expert Specialists', 'Advanced Technology', 'Emergency Care', 'Comfortable Suites'].map((item) => (
//               <li key={item} className="flex items-center gap-3 font-semibold text-indigo-900">
//                 <span className="text-emerald-500">✓</span> {item}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* ================= SERVICES (STATIC IMAGES) ================= */}
//       <section className="bg-slate-50 py-24 px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <h3 className="text-indigo-950 text-4xl font-serif">Our Expertise</h3>
//               <p className="text-slate-500 mt-2">Specialized dental care for the whole family.</p>
//             </div>
//             <button className="text-indigo-900 font-bold border-b-2 border-indigo-900 pb-1">View All Services</button>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { title: "Dental Implants", img: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=500" },
//               { title: "Teeth Whitening", img: "https://images.unsplash.com/photo-1593054941019-2f22b822bc2f?auto=format&fit=crop&q=80&w=500" },
//               { title: "Pediatric Care", img: "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&q=80&w=500" }
//             ].map((s) => (
//               <div key={s.title} className="group cursor-pointer">
//                 <div className="overflow-hidden rounded-2xl mb-4 h-64 shadow-lg">
//                   <img src={s.img} alt={s.title} className="w-full h-full object-cover transition transform group-hover:scale-110" />
//                 </div>
//                 <h4 className="text-xl font-bold text-indigo-950 group-hover:text-emerald-600 transition">{s.title}</h4>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

      

//       {/* ================= MAP & CONTACT ================= */}
//       <section className="py-24 px-8 max-w-7xl mx-auto">
//         <div className="bg-indigo-950 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
//           <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
//             <h3 className="text-3xl font-serif text-white mb-8">Visit Our Clinic</h3>
//             <div className="space-y-6">
//               <div className="flex gap-4 items-start">
//                 <div className="bg-white/10 p-3 rounded-full text-emerald-400">
//                   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
//                 </div>
//                 <div>
//                   <p className="text-white font-bold">Address</p>
//                   <p className="text-indigo-200">{data.address || "123 Medical Plaza, Suite 400"}</p>
//                 </div>
//               </div>
//               <div className="flex gap-4 items-start">
//                 <div className="bg-white/10 p-3 rounded-full text-emerald-400">
//                   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
//                 </div>
//                 <div>
//                   <p className="text-white font-bold">Hours</p>
//                   <p className="text-indigo-200">Mon - Sat: 09:00 AM - 08:00 PM</p>
//                 </div>
//               </div>
//             </div>
//             <button className="mt-12 w-full bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-900/20">
//               Get Directions
//             </button>
//           </div>
          
//           <div className="lg:w-1/2 h-[400px] lg:h-auto bg-slate-200 relative">
//              <iframe
//                 title="Location Map"
//                 src={mapSrc}
//                 className="w-full h-full grayscale opacity-80 hover:grayscale-0 transition duration-500"
//                 loading="lazy"
//               ></iframe>
//           </div>
//         </div>
//       </section>

//       {/* ================= FOOTER ================= */}
//       <footer className="py-12 bg-white text-center border-t border-slate-100">
//         <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {data.name} Clinical Excellence. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default TemplateB_DentalPremium;
import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf"; // Requires: npm install jspdf
import { formatLeadData } from "../../utils/leadFormatter";

function TemplateB_SolarShop({ lead }) {
  // --- State for Calculator ---
  const [billAmount, setBillAmount] = useState(3000);
  const [roofArea, setRoofArea] = useState(500);
  const [selectedCity, setSelectedCity] = useState("Chennai");

  // --- State for Quote/PDF ---
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");

  // --- State for Contact Form ---
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    message: ""
  });

  // --- Constants & Logic ---
  const UNIT_PRICE = 8; // ₹8 per unit
  const SQFT_PER_KW = 100; // 1kW requires approx 100 sqft
  const PRICE_PER_KW = 50000; // ₹50,000 per kW (Market Average)

  const sunHoursData = {
    Chennai: 4.5,
    Delhi: 4.8,
    Mumbai: 4.3,
    Hyderabad: 4.4,
    Bangalore: 4.6,
    Kolkata: 4.2,
    Other: 4.5
  };

  const calculation = useMemo(() => {
    // 1. Calculate Consumption
    const monthlyUnits = billAmount / UNIT_PRICE;
    const dailyUnits = monthlyUnits / 30;

    // 2. Solar Requirement
    const sunHours = sunHoursData[selectedCity];
    const requiredKW = dailyUnits / sunHours;

    // 3. Roof Constraint
    const maxRoofCapacityKW = roofArea / SQFT_PER_KW;
    
    // 4. Logic: Compare Required vs Roof Max
    const isRoofLimited = maxRoofCapacityKW < requiredKW;
    const finalSystemSize = isRoofLimited ? maxRoofCapacityKW : requiredKW;

    // 5. Financials
    const estimatedSystemCost = finalSystemSize * PRICE_PER_KW;
    const monthlySavings = monthlyUnits * UNIT_PRICE;
    const annualSavings = monthlySavings * 12;
    const lifetimeSavings = annualSavings * 25; // 25 Year Panel Life

    return {
      monthlyUnits: monthlyUnits.toFixed(0),
      dailyUnits: dailyUnits.toFixed(1),
      sunHours,
      requiredKW: requiredKW.toFixed(2),
      maxRoofCapacityKW: maxRoofCapacityKW.toFixed(2),
      finalSystemSize: finalSystemSize.toFixed(2),
      isRoofLimited,
      // Formatting currency
      estimatedSystemCost: estimatedSystemCost.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      monthlySavings: monthlySavings.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      lifetimeSavings: lifetimeSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })
    };
  }, [billAmount, roofArea, selectedCity]);

  // --- PDF Generator Function ---
  const generatePDF = () => {
    if (!customerName.trim()) {
      alert("Please enter your name to download the quote.");
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(lead?.name || "Solar Shop", 20, 25);
    
    // Customer Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Solar Estimation Quote`, 20, 55);
    doc.setFontSize(12);
    doc.text(`Prepared for: ${customerName}`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 72);
    doc.text(`City: ${selectedCity}`, 20, 79);

    // System Details Box
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, 90, 170, 80);
    
    doc.setFontSize(14);
    doc.text("System Configuration", 30, 105);
    
    doc.setFontSize(12);
    doc.text(`Recommended System Size: ${calculation.finalSystemSize} kW`, 30, 120);
    doc.text(`Monthly Bill Offset: Rs. ${calculation.monthlySavings}`, 30, 130);
    doc.text(`Roof Area Usage: ~${(calculation.finalSystemSize * 100).toFixed(0)} sqft`, 30, 140);

    // Financials
    doc.setFontSize(14);
    doc.setTextColor(22, 163, 74); // Green color
    doc.text(`Estimated Lifetime Savings (25 Yrs): Rs. ${calculation.lifetimeSavings}`, 30, 160);
    
    doc.setTextColor(0, 0, 0);
    doc.text(`Estimated Project Cost: Rs. ${calculation.estimatedSystemCost}*`, 30, 185); // Adjusted Y position
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("* Includes Panels, Inverter, Structure & Installation.", 30, 192);

    // Footer
    doc.setFontSize(10);
    doc.text("This is an automated estimation. Final price may vary based on site survey.", 20, 280);
    
    doc.save(`${customerName.replace(/\s+/g, '_')}_Solar_Quote.pdf`);
    setIsQuoteModalOpen(false);
  };

  // --- Lead Data Safety ---
  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-xl font-light text-yellow-400 animate-pulse">Energizing System...</p>
      </div>
    );
  }

  const safeLead = {
    hero_title: lead.hero_title || "Power Your Future With Solar Energy",
    hero_subtitle: lead.hero_subtitle || "Switch to clean energy, reduce your electricity bills to zero, and secure a greener tomorrow.",
    description: lead.description || "We provide premium Tier-1 solar panels and smart inverter solutions. Our expert team ensures a hassle-free installation with a 25-year performance warranty.",
    ...lead,
  };

  const data = formatLeadData(safeLead);
  const encodedAddress = encodeURIComponent(data.address || "Solar Market, Green City");
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-yellow-200">
      
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="bg-yellow-500 p-2 rounded-lg text-slate-900">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">
              {data.name}
            </h1>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-semibold items-center">
            <span className="hover:text-yellow-400 cursor-pointer transition">{data.phone}</span>
            <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-2 rounded-full transition font-bold shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              Get Quote
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200" 
            alt="Solar Panels" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-6 border border-yellow-500/50 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold tracking-wider uppercase">
              Sustainable Energy Solutions
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              {safeLead.hero_title}
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">
              {safeLead.hero_subtitle}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                className="bg-yellow-500 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg"
              >
                How it Works
              </button>
            </div>
          </div>
          
          {/* --- CALCULATOR CARD --- */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl animate-fade-in-up relative">
            
            {/* Download Quote Overlay Modal */}
            {isQuoteModalOpen && (
              <div className="absolute inset-0 bg-slate-900/95 z-50 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                <h4 className="text-xl font-bold text-white mb-2">Download Your Quote</h4>
                <p className="text-sm text-slate-400 mb-6">Enter your name to personalize the PDF.</p>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full max-w-[250px] bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 mb-4 focus:border-yellow-500 outline-none"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <div className="flex gap-3">
                   <button 
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="text-slate-300 hover:text-white px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={generatePDF}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-6 py-2 rounded-full"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Solar Calculator</h3>
              <span className="text-yellow-400">⚡ Smart Estimate</span>
            </div>

            <div className="space-y-6">
              {/* Input 1: Bill */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Electricity Bill (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input 
                    type="number" 
                    value={billAmount}
                    onChange={(e) => setBillAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Input 2: City & Roof */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none appearance-none"
                  >
                    {Object.keys(sunHoursData).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Roof (sqft)</label>
                  <input 
                    type="number" 
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                </div>
              </div>

              {/* Results Display */}
              <div className="bg-slate-900/80 rounded-xl p-5 space-y-4 border-l-4 border-yellow-500">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-700 pb-4">
                   <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wide">Rec. System</span>
                      <p className="text-2xl font-bold text-white">{calculation.finalSystemSize} kW</p>
                   </div>
                   <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase tracking-wide">Est. Cost</span>
                      <p className="text-xl font-bold text-white">₹{calculation.estimatedSystemCost}</p>
                   </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 font-semibold text-sm">25-Year Savings:</span>
                    <span className="text-xl font-bold text-green-400">₹{calculation.lifetimeSavings}</span>
                  </div>
                  {calculation.isRoofLimited && (
                    <p className="text-xs text-red-400 mt-1">
                      * Limited by Roof Size.
                    </p>
                  )}
                  
                  <button 
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download Detailed Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT / STEPS ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Solar Works for You</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">We simplify the transition to renewable energy. From calculation to installation, we handle everything.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              step: "01", 
              title: "Analyze & Design", 
              desc: "We analyze your bill and roof structure (as you did above) to design the perfect 3D model for maximum efficiency.",
            },
            { 
              step: "02", 
              title: "Installation", 
              desc: "Our certified technicians install Tier-1 panels and inverters with zero structural damage to your roof.",
            },
            { 
              step: "03", 
              title: "Net Metering", 
              desc: "We handle government approvals. Excess power generated is sent back to the grid, giving you credits.",
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition duration-300">
              <div className="bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center text-yellow-400 font-bold mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="bg-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-yellow-600 font-bold tracking-widest uppercase text-xs">Our Technology</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Premium Solar Kits</h2>
            </div>
            <button className="text-slate-900 font-bold border-b-2 border-slate-900 pb-1 hover:text-yellow-600 hover:border-yellow-600 transition">
              View All Products
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Monocrystalline Panels", type: "High Efficiency", img: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=500" },
              { name: "Hybrid Inverters", type: "Smart Grid Tie", img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=500" },
              { name: "Lithium Storage", type: "Night Backup", img: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=500" }
            ].map((p, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl h-80 cursor-pointer">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-yellow-400 text-xs font-bold uppercase mb-1">{p.type}</p>
                  <h4 className="text-white text-xl font-bold">{p.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAP & CONTACT FORM ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row text-white">
          
          {/* --- CONTACT FORM SECTION --- */}
          <div className="lg:w-1/2 p-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-3xl font-bold mb-4">Request a Site Visit</h3>
            <p className="text-slate-400 mb-8">Fill out the form below and our solar expert will contact you within 24 hours.</p>

            <form className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input 
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="tel"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                  placeholder="+91 98765 43210"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea 
                  rows="3"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition"
                  placeholder="I am interested in a 3kW system..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                ></textarea>
              </div>
              <button type="button" className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg transition shadow-lg mt-2">
                Send Request
              </button>
            </form>
          </div>
          
          {/* --- MAP & INFO SECTION --- */}
          <div className="lg:w-1/2 bg-slate-800 relative flex flex-col">
             <div className="h-64 lg:h-1/2 w-full">
                <iframe
                    title="Location Map"
                    src={mapSrc}
                    className="w-full h-full opacity-80 hover:opacity-100 transition duration-500"
                    loading="lazy"
                  ></iframe>
             </div>
             <div className="p-10 lg:h-1/2 flex flex-col justify-center gap-6">
                <div className="flex gap-4 items-center">
                  <div className="bg-slate-700 p-3 rounded-lg text-yellow-500">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Visit Us</p>
                    <p className="text-white font-medium">{data.address || "Solar Tech Park, Sector 4"}</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="bg-slate-700 p-3 rounded-lg text-yellow-500">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Call Now</p>
                    <p className="text-white font-medium font-mono">{data.phone}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 bg-slate-50 text-center border-t border-slate-200">
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {data.name}. Powered by Green Energy.</p>
      </footer>
    </div>
  );
}

export default TemplateB_SolarShop;