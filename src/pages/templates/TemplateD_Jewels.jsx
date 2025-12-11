import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { formatLeadData } from "../../utils/leadFormatter";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

function TemplateD_Jewels({ lead }) {
  if (!lead) return <p className="p-10 text-center">Loading...</p>;

  const safe = {
    hero_title: lead.hero_title || "",
    hero_subtitle: lead.hero_subtitle || "",
    cta_button: lead.cta_button || "Shop Collection",
    description: lead.description || "",
    testimonials: lead.testimonials || [],
    thumbnail: lead.thumbnail || "",
    ...lead,
  };

  const data = formatLeadData(safe);

  const encodedAddress = encodeURIComponent(data.address || "");
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  const CREAM_BG = "bg-[#F5F1E8]";
  const GOLD = "text-[#C8A76A]";
  const GOLD_BORDER = "border-[#C8A76A]";
  const GOLD_BG = "bg-[#C8A76A]";

  const craftsmanship = [
    {
      title: "Handcrafted Detail",
      subtitle: "Each piece carved by master artisans",
      img: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    },
    {
      title: "Certified Gold",
      subtitle: "Hallmarked & ethically sourced materials",
      img: "https://cdn-icons-png.flaticon.com/512/2716/2716066.png",
    },
    {
      title: "Timeless Brilliance",
      subtitle: "Premium diamonds & gemstones",
      img: "https://cdn-icons-png.flaticon.com/512/2921/2921818.png",
    },
    {
      title: "Custom Designs",
      subtitle: "Jewelry crafted exclusively for you",
      img: "https://cdn-icons-png.flaticon.com/512/2921/2921817.png",
    },
  ];

  const defaultTestimonials = [
    { name: "Priya S.", text: "Beautiful craftsmanship! My ring is stunning." },
    { name: "Nikhil R.", text: "Best jeweler in town. Amazing service." },
    { name: "Sneha M.", text: "Elegant designs and premium finishing!" },
  ];

  const testimonials = safe.testimonials.length
    ? safe.testimonials
    : defaultTestimonials;

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ================= HERO ================= */}
      <section className={`${CREAM_BG} py-20 px-10 grid lg:grid-cols-2 gap-12 items-center`}>
        <div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 leading-tight">
            {safe.hero_title || "Discover Your Legacy."}
          </h1>

          <p className="text-xl text-gray-700 mt-5 font-light">
            {safe.hero_subtitle ||
              "Exquisite handcrafted jewelry designed with heritage and artistry."}
          </p>

          <div className="flex gap-4 mt-10">
            <button
              className={`px-8 py-3 rounded-md text-white font-semibold shadow-lg hover:opacity-90 transition ${GOLD_BG}`}
            >
              {safe.cta_button || "Shop Collection"}
            </button>

            <button
              className={`px-8 py-3 rounded-md ${GOLD_BORDER} ${GOLD} border hover:bg-yellow-50 transition font-medium`}
            >
              Request Custom Design
            </button>
          </div>
        </div>

        <div>
          <img
            src={
              safe.thumbnail ||
              "https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg"
            }
            alt="Jewelry"
            className="rounded-xl w-full h-[450px] object-cover shadow-xl"
          />
        </div>
      </section>

      {/* ================= CRAFTSMANSHIP ================= */}
      <section className="py-20 px-10 text-center">
        <h2 className="text-3xl font-serif font-bold mb-12">Our Craftsmanship</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {craftsmanship.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white border rounded-xl shadow-sm flex flex-col items-center"
            >
              <img src={item.img} className="w-16 mb-4" alt="" />
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-gray-600 text-sm mt-2">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= GOLD & SILVER PRICE SECTION ================= */}
      <section className="py-20 px-10 bg-[#FDFBF6]">
        <h2 className="text-3xl font-serif font-bold text-center mb-10">
          Today's Gold & Silver Price
        </h2>

        <LivePrices />
      </section>

      {/* ================= STORY + GALLERY + MAP ================= */}
      <section className="py-20 px-10 grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">

        <div className="p-8 bg-[#F8F5EF] rounded-xl shadow">
          <h3 className="text-2xl font-serif font-bold mb-4">Our Story</h3>
          <p className="text-gray-700 leading-relaxed">
            {safe.description ||
              "For decades, we have crafted fine jewelry with passion and precision. Our boutique blends tradition with modern artistry."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <img
            src="https://images.pexels.com/photos/1459397/pexels-photo-1459397.jpeg

"
            className="rounded-xl shadow object-cover h-44"
          />
          <img
            src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg"
            className="rounded-xl shadow object-cover h-44"
          />
        </div>

        <div className="p-8 bg-[#F8F5EF] rounded-xl shadow">
          <h3 className="text-2xl font-serif font-bold mb-4">Visit Our Boutique</h3>

          <iframe
            src={mapSrc}
            className="w-full h-40 rounded-xl shadow mb-4"
            loading="lazy"
          ></iframe>

          <p className="text-gray-800">{data.address}</p>
          <p className="text-gray-800 mt-2 font-medium">{data.phone}</p>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className={`${CREAM_BG} py-20 px-10`}>
        <h2 className="text-3xl font-serif font-bold text-center mb-12">
          Client Love
        </h2>

        <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow">
              <p className="italic text-gray-700">{`"${t.text}"`}</p>
              <h4 className="mt-4 font-bold text-[#C8A76A]">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1E1E1E] text-gray-300 py-10 text-center">
        <p className="text-lg font-serif">{data.name}</p>
        <p className="text-sm mt-2">© {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}


/* ==============================================================
   📌 LIVE GOLD & SILVER PRICE COMPONENT (FRONTEND ONLY)
============================================================== */
function LivePrices() {
  const [gold, setGold] = useState(null);
  const [silver, setSilver] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchGold();
    fetchSilver();
    fetchHistory();
  }, []);

  async function fetchGold() {
    try {
      const res = await fetch(
        "https://api.metalpriceapi.com/v1/latest?base=XAU&curr=INR&amount=1"
      );
      const data = await res.json();
      setGold(Math.round(data.rates.INR / 31)); // per gram
    } catch (err) {
      console.log("Gold price error:", err);
    }
  }

  async function fetchSilver() {
    try {
      const res = await fetch(
        "https://api.metalpriceapi.com/v1/latest?base=XAG&curr=INR&amount=1"
      );
      const data = await res.json();
      setSilver(Math.round(data.rates.INR / 31)); // per gram
    } catch (err) {
      console.log("Silver price error:", err);
    }
  }

  async function fetchHistory() {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);

      const startStr = start.toISOString().slice(0, 10);
      const endStr = end.toISOString().slice(0, 10);

      const url = `https://api.metalpriceapi.com/v1/timeframe?base=XAU&curr=INR&start_date=${startStr}&end_date=${endStr}`;

      const res = await fetch(url);
      const data = await res.json();

      const prices = Object.entries(data.rates).map(([date, value]) => ({
        date,
        price: Math.round(value.INR / 31),
      }));

      setHistory(prices);
    } catch (err) {
      console.log("History error:", err);
    }
  }

  const chartData = {
    labels: history.map((x) => x.date),
    datasets: [
      {
        label: "Gold Price (per gram, INR)",
        data: history.map((x) => x.price),
        borderColor: "#C8A76A",
        backgroundColor: "rgba(200,167,106,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Price Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        <div className="p-8 bg-white shadow rounded-xl text-center border">
          <h3 className="text-xl font-bold text-[#C8A76A]">GOLD (per gram)</h3>
          <p className="text-3xl font-serif mt-3">
            ₹ {gold ? gold : "Loading..."}
          </p>
        </div>

        <div className="p-8 bg-white shadow rounded-xl text-center border">
          <h3 className="text-xl font-bold text-gray-500">SILVER (per gram)</h3>
          <p className="text-3xl font-serif mt-3">
            ₹ {silver ? silver : "Loading..."}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-8 rounded-xl shadow border">
        <h3 className="text-xl font-serif font-bold mb-6">
          Gold Price Trend (Last 7 days)
        </h3>

        <Line data={chartData} height={120} />
      </div>
    </div>
  );
}

export default TemplateD_Jewels;
