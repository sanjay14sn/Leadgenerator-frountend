import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

/* ------------------ HELPERS ------------------ */
const getCurrentTitle = (pathname) => {
  if (pathname === "/home") return "Dashboard Overview";
  if (pathname === "/all-leads") return "All Leads Database";
  if (pathname === "/followups") return "Assigned Leads (Follow-Up)";
  if (pathname === "/instaleads") return "Insta Leads (BETA)";
  if (pathname === "/cloudflare") return "Cloudflare Management";
  if (pathname === "/quotes") return "Smart Quotes Builder";
  if (pathname === "/aiposter") return "AI Poster Management";
  if (pathname === "/campaigns") return "Lead Outreach Campaigns";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsFetching(true);
      try {
        const res = await API.get("/leads");
        const allLeads = res.data || [];
        const term = searchTerm.toLowerCase();
        const filtered = allLeads.filter(l =>
          l.name?.toLowerCase().includes(term) ||
          l.email?.toLowerCase().includes(term) ||
          l.category?.toLowerCase().includes(term) ||
          l.website?.toLowerCase().includes(term)
        ).slice(0, 8); // Top 8 suggestions

        setSuggestions(filtered);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsFetching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/all-leads?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

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

          <div className="relative" ref={dropdownRef}>
            <input
              placeholder="Search leads..."
              className="hidden md:block w-96 p-2 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            />

            {showDropdown && (suggestions.length > 0 || isFetching) && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-2xl border z-50 max-h-[400px] overflow-y-auto">
                {isFetching && suggestions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">Searching...</div>
                ) : (
                  <>
                    {suggestions.map((lead) => (
                      <button
                        key={lead._id}
                        onClick={() => {
                          navigate(`/leads/${lead._id}/edit`);
                          setShowDropdown(false);
                          setSearchTerm("");
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-teal-50 border-b last:border-b-0 flex flex-col transition"
                      >
                        <span className="font-bold text-gray-900 text-sm">{lead.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-bold uppercase truncate max-w-[100px]">
                            {lead.category || "No Category"}
                          </span>
                          <span className="text-xs text-gray-400 truncate">{lead.email || "No Email"}</span>
                        </div>
                      </button>
                    ))}
                    {suggestions.length > 0 && (
                      <button
                        onClick={() => {
                          navigate(`/all-leads?search=${encodeURIComponent(searchTerm)}`);
                          setShowDropdown(false);
                        }}
                        className="w-full text-center py-2 text-xs font-bold text-teal-600 hover:bg-gray-50 border-t"
                      >
                        See all results for "{searchTerm}"
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/teammates")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-lg hover:bg-white/30 transition font-bold text-sm border border-white/30"
          >
            👥 Team Hub
          </button>
          <button className="text-white">🔔</button>
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
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
          <HorizontalNavItem label="Dashboard" active={location.pathname === "/home"} onClick={() => navigate("/home")} />
          <HorizontalNavItem label="All Leads" active={location.pathname === "/all-leads"} onClick={() => navigate("/all-leads")} />
          <HorizontalNavItem label="Assign Leads" active={location.pathname === "/followups"} onClick={() => navigate("/followups")} />
          <HorizontalNavItem label="Smart Quotes" active={location.pathname === "/quotes"} onClick={() => navigate("/quotes")} />
          <HorizontalNavItem label="Insta (BETA)" active={location.pathname === "/instaleads"} onClick={() => navigate("/instaleads")} />
          <HorizontalNavItem label="Cloudflare" active={location.pathname === "/cloudflare"} onClick={() => navigate("/cloudflare")} />
          <HorizontalNavItem label="AI Poster" active={location.pathname === "/aiposter"} onClick={() => navigate("/aiposter")} />
          <HorizontalNavItem label="Campaigns" active={location.pathname === "/campaigns"} onClick={() => navigate("/campaigns")} />
        </div>
      </nav>

      {/* CONTENT */}
      <main
        className={location.pathname.includes("/ai-builder") ? "p-0 overflow-hidden" : mainContentClass}
        style={{ marginTop: `calc(${topBarHeight} + ${secondaryNavHeight})` }}
      >
        <div className={location.pathname.includes("/ai-builder") ? "w-full" : "max-w-7xl mx-auto"}>
          {location.pathname !== "/aiposter" &&
            !location.pathname.includes("/templates") &&
            !location.pathname.includes("/leads/") && (
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