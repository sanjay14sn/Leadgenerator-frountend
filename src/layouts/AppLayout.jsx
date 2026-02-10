// src/layouts/AppLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

/* ------------------ HELPERS ------------------ */
const getCurrentTitle = (pathname) => {
  if (pathname === "/") return "Dashboard Overview";
  if (pathname === "/all-leads") return "All Leads Database";
  if (pathname === "/followups") return "Assigned Leads (Follow-Up)";
  if (pathname === "/instaleads") return "Insta Leads (BETA)";
  if (pathname === "/cloudflare") return "Cloudflare Management";
  if (pathname === "/quotes") return "Smart Quotes Builder";
  if (pathname === "/aiposter") return "AI Poster Management";
  return "IQSync Dashboard";
};

const HorizontalNavItem = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition
      ${active
        ? "text-[#1ABC9C] border-b-2 border-[#1ABC9C]"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
  >
    {label}
  </button>
);

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const topBarHeight = "64px";
  const secondaryNavHeight = "56px";
  const currentTitle = getCurrentTitle(location.pathname);

  const mainContentClass =
    location.pathname === "/"
      ? "p-8 bg-gradient-to-br from-gray-50 to-teal-50"
      : "p-8 bg-gray-50";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP BAR */}
      <header
        className="fixed top-0 left-0 right-0 h-16 bg-[#1ABC9C] z-30 shadow-md flex items-center justify-between px-4 md:px-8"
        style={{ height: topBarHeight }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white md:hidden"
          >
            ☰
          </button>

          <h1 className="text-xl md:text-2xl font-extrabold text-white">
            IQSync
          </h1>

          <input
            placeholder="Search leads..."
            className="hidden md:block w-96 p-2 rounded-lg text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white">🔔</button>
          <div className="flex items-center gap-2 border-l pl-4">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center font-bold text-[#1ABC9C]">
              AU
            </div>
            <span className="hidden md:inline text-white">Admin User</span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="ml-2 px-3 py-1 border border-white rounded text-white hover:bg-white hover:text-[#1ABC9C]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* TABS */}
      <nav
        className="fixed top-16 left-0 right-0 bg-white border-b z-20"
        style={{ height: secondaryNavHeight }}
      >
        <div className="max-w-7xl mx-auto flex h-full">
          <HorizontalNavItem label="Home" active={location.pathname === "/"} onClick={() => navigate("/")} />
          <HorizontalNavItem label="All Leads" active={location.pathname === "/all-leads"} onClick={() => navigate("/all-leads")} />
          <HorizontalNavItem label="Assign Leads" active={location.pathname === "/followups"} onClick={() => navigate("/followups")} />
          <HorizontalNavItem label="Smart Quotes" active={location.pathname === "/quotes"} onClick={() => navigate("/quotes")} />
          <HorizontalNavItem label="Insta (BETA)" active={location.pathname === "/instaleads"} onClick={() => navigate("/instaleads")} />
          <HorizontalNavItem label="Cloudflare" active={location.pathname === "/cloudflare"} onClick={() => navigate("/cloudflare")} />
          <HorizontalNavItem label="AI Poster" active={location.pathname === "/aiposter"} onClick={() => navigate("/aiposter")} />
        </div>
      </nav>

      {/* CONTENT */}
      <main
        className={mainContentClass}
        style={{ marginTop: `calc(${topBarHeight} + ${secondaryNavHeight})` }}
      >
        <div className="max-w-7xl mx-auto">
          {location.pathname !== "/aiposter" && !location.pathname.includes("/templates") && (
            <div className="mb-8">
              <p className="text-sm text-gray-500">IQSync / {currentTitle}</p>
              <h1 className="text-3xl font-bold">{currentTitle}</h1>
            </div>
          )}

          <Outlet />
        </div>
      </main>
    </div>
  );
}