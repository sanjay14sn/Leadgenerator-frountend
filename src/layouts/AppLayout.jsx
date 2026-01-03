import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ------------------ HELPERS ------------------ */
const getCurrentTitle = (pathname) => {
  if (pathname === "/") return "Dashboard Overview";
  if (pathname === "/all-leads") return "All Leads Database";
  if (pathname === "/followups") return "Assigned Leads (Follow-Up)";
  if (pathname === "/instaleads") return "Insta Leads (BETA)";
  if (pathname === "/cloudflare") return "Cloudflare Management";
  return "IQSync Dashboard";
};

/* ------------------ TAB ITEM ------------------ */
const HorizontalNavItem = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-semibold transition
      ${
        active
          ? "text-[#1ABC9C] border-b-2 border-[#1ABC9C]"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
  >
    {label}
  </button>
);

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const topBarHeight = "64px";
  const secondaryNavHeight = "56px";
  const currentTitle = getCurrentTitle(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= TOP BAR ================= */}
      <header
        className="fixed top-0 left-0 right-0 h-16 bg-[#1ABC9C] shadow-md flex items-center justify-between px-4 md:px-8 z-30"
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
            type="text"
            placeholder="Search leads..."
            className="hidden md:block w-96 p-2 rounded-lg text-sm bg-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-l border-teal-600 pl-4">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[#1ABC9C] font-bold">
              AU
            </div>
            <span className="hidden md:inline text-white text-sm">
              Admin User
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="ml-2 px-3 py-1 text-sm text-white border border-white rounded-lg hover:bg-white hover:text-[#1ABC9C]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= SECONDARY NAV ================= */}
      <nav
        className="fixed top-16 left-0 right-0 bg-white border-b shadow-sm z-20"
        style={{ height: secondaryNavHeight }}
      >
        <div className="max-w-7xl mx-auto flex gap-1 h-full overflow-x-auto">
          <HorizontalNavItem
            label="Home"
            active={location.pathname === "/"}
            onClick={() => navigate("/")}
          />
          <HorizontalNavItem
            label="All Leads"
            active={location.pathname === "/all-leads"}
            onClick={() => navigate("/all-leads")}
          />
          <HorizontalNavItem
            label="Assign Leads"
            active={location.pathname === "/followups"}
            onClick={() => navigate("/followups")}
          />
          <HorizontalNavItem
            label="Insta (BETA)"
            active={location.pathname === "/instaleads"}
            onClick={() => navigate("/instaleads")}
          />
          <HorizontalNavItem
            label="Cloudflare"
            active={location.pathname === "/cloudflare"}
            onClick={() => navigate("/cloudflare")}
          />
        </div>
      </nav>

      {/* ================= PAGE CONTENT ================= */}
      <main
        className="p-8 bg-gray-50"
        style={{
          marginTop: `calc(${topBarHeight} + ${secondaryNavHeight})`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 mb-1">
            IQSync / {currentTitle}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {currentTitle}
          </h1>

          {children}
        </div>
      </main>
    </div>
  );
}
