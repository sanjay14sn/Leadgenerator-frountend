// src/pages/AddTeammatePage.jsx

import React, { useState } from "react";
// Assuming you have API and useNavigate correctly imported
import API from "../api/api";
import { useNavigate } from "react-router-dom";

// --- PROFESSIONAL ICONS (SVG Placeholders) ---
const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const MailIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>;
const PhoneIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75l1.5-1.5m8.25-1.5L21.75 6.75m-8.25 0H7.5M7.5 4.5H4.5m10.5 0h-3m4.5 16.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V7.5a2.25 2.25 0 0 1 2.25-2.25h15a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25Z" /></svg>;
const BriefcaseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.25v2.25H4.5v-2.25M20.25 14.25a7.5 7.5 0 0 0-15 0m15 0h2.25m-2.25 0a7.5 7.5 0 0 0-7.5 7.5v1.5a.75.75 0 0 1-1.5 0v-1.5a7.5 7.5 0 0 0-7.5-7.5h2.25m-15 0a7.5 7.5 0 0 0 7.5 7.5v1.5a.75.75 0 0 1-1.5 0v-1.5a7.5 7.5 0 0 0-7.5-7.5h2.25m15 0a7.5 7.5 0 0 0-7.5-7.5V3.75a.75.75 0 0 1 1.5 0V7.5a7.5 7.5 0 0 0 7.5 7.5h2.25M4.5 14.25v2.25H2.25v-2.25H4.5Z" /></svg>;
const TargetIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M12 3.75v16.5M12 1.5a10.5 10.5 0 1 1 0 21 10.5 10.5 0 0 1 0-21Z" /></svg>;
const NoteIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625A2.25 2.25 0 0 0 17.25 9H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const CheckCircleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.422 4.017-9.832 9.25-10.428V12c0 5.422-4.017 9.832-9.25 10.428V12Z" clipRule="evenodd" /><path d="M13.25 12a9.25 9.25 0 0 0 9.25-9.25V12a9.25 9.25 0 0 1-9.25 9.25Z" /></svg>;


export default function AddTeammatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "AGENT",
    monthly_target: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState(null); 

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setCreds(null); 
    try {
      const res = await API.post("/teammates", form);
      
      setCreds(res.data.login_credentials); 

      setForm({
        name: "",
        email: "",
        phone: "",
        role: "AGENT",
        monthly_target: "",
        instructions: "",
      });

    } catch (error) {
      console.error("Teammate creation failed:", error);
      alert("Failed to create teammate. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 FIX: Define InputGroup here to access 'form' and 'update' directly
  const InputGroup = ({ icon: Icon, name, placeholder, type = "text", inputMode = "text", required = false }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        // Access form state directly via name:
        value={form[name] || ''} 
        // Use the update handler directly:
        onChange={update} 
        inputMode={inputMode} 
        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition duration-150"
        required={required}
      />
    </div>
  );
  // End of InputGroup definition


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* --- MNC-LEVEL APP BAR --- */}
      <nav className="sticky top-0 z-50 bg-[#1ABC9C] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 text-white font-extrabold text-xl tracking-wider">
                TEAM | MANAGEMENT
              </div>
              <h1 className="ml-8 text-white text-lg font-semibold border-l border-white/30 pl-4 hidden sm:block">
                New Teammate Registration
              </h1>
            </div>
            <button
              onClick={() => navigate("/followups")}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition text-sm font-medium hidden md:block"
            >
              ← Back to Followups
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="flex-1 p-4 sm:p-8 flex items-start justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: VISUAL/INSTRUCTIONAL */}
          <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24">
            <h3 className="text-xl font-bold text-[#1ABC9C] mb-4 flex items-center">
                <BriefcaseIcon className="w-6 h-6 mr-2" />
                Team Onboarding Guide
            </h3>
            <p className="text-gray-600 mb-4">
              Use this form to securely create a new account for your sales agents or managers.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0"/>
                    Credentials are auto-generated upon submission.
                </li>
                <li className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0"/>
                    Monthly Target helps track performance.
                </li>
                <li className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0"/>
                    Instructions field for custom team notes.
                </li>
            </ul>

            {/* QR Code & App CTA Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <h4 className="font-bold text-gray-800 mb-3">Access Team Hub On The Go</h4>
                <div className="w-32 h-32 mx-auto border-4 border-white shadow-lg overflow-hidden flex items-center justify-center mb-4">
                    <img 
                        src="https://qrexplore.com/icon/apple-icon.png" 
                        alt="QR Code for App Download" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <div className="mt-4 flex justify-center gap-4">
                    <img
                        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        alt="App Store"
                        className="h-10 cursor-pointer"
                    />
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Google Play"
                        className="h-10 cursor-pointer"
                    />
                </div>
            </div>
          </div>


          {/* RIGHT COLUMN: FORM/SUCCESS VIEW */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6 sm:p-10 border border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
                New Team Member Profile
            </h2>

            {!creds ? (
              <form onSubmit={submit} className="space-y-6">
                
                {/* SECTION: PERSONAL DETAILS */}
                <fieldset className="border p-4 rounded-lg">
                    <legend className="px-2 text-md font-semibold text-gray-700">Personal Contact</legend>
                    <div className="space-y-4 pt-2">
                      <InputGroup
                        icon={UserIcon}
                        name="name"
                        placeholder="Full Name (Required)"
                        required
                        inputMode="text"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup
                          icon={MailIcon}
                          name="email"
                          placeholder="Professional Email (Required)"
                          type="email"
                          required
                          inputMode="email"
                        />
                        <InputGroup
                          icon={PhoneIcon}
                          name="phone"
                          placeholder="Phone Number"
                          type="tel"
                          inputMode="tel" 
                        />
                      </div>
                    </div>
                </fieldset>

                {/* SECTION: ROLE & TARGETS */}
                <fieldset className="border p-4 rounded-lg">
                    <legend className="px-2 text-md font-semibold text-gray-700">Role & Performance</legend>
                    <div className="space-y-4 pt-2">
                        {/* Role Select - This must use the update function directly */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <BriefcaseIcon className="w-5 h-5" />
                            </div>
                            <select
                              name="role"
                              value={form.role}
                              onChange={update}
                              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition duration-150 appearance-none"
                            >
                              <option value="AGENT">Sales Agent</option>
                              <option value="MANAGER">Sales Manager</option>
                            </select>
                        </div>
                        
                        <InputGroup
                          icon={TargetIcon}
                          name="monthly_target"
                          placeholder="Monthly Revenue Target (e.g., 50000)"
                          type="number" 
                          inputMode="numeric" 
                        />
                    </div>
                </fieldset>


                {/* SECTION: INSTRUCTIONS (The working native field) */}
                <fieldset className="border p-4 rounded-lg">
                    <legend className="px-2 text-md font-semibold text-gray-700">Team Instructions / Notes</legend>
                    <div className="space-y-4 pt-2 relative">
                        <div className="absolute top-5 left-3 text-gray-400">
                           <NoteIcon className="w-5 h-5" />
                        </div>
                        <textarea
                          name="instructions"
                          placeholder="Onboarding notes, specific region, or critical info."
                          value={form.instructions} // Correctly bound to state
                          onChange={update}         // Correctly using update function
                          rows="4"
                          className="block w-full pl-10 pr-4 pt-3 pb-3 border border-gray-300 rounded-lg shadow-sm focus:ring-[#1ABC9C] focus:border-[#1ABC9C] transition duration-150 resize-y"
                        />
                    </div>
                </fieldset>


                <button 
                  type="submit"
                  disabled={loading}
                  className="mt-6 bg-[#1ABC9C] text-white px-6 py-3 rounded-xl w-full text-lg font-semibold shadow-md hover:bg-teal-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Creating Teammate...
                    </>
                  ) : (
                    "Create New Teammate Account"
                  )}
                </button>
              </form>
            ) : (
              // --- SUCCESS STATE ---
              <div className="p-8 border-4 border-green-200 bg-green-50 rounded-xl shadow-inner text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-3xl font-extrabold text-green-800 mb-4">
                  Teammate Profile Created Successfully!
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Securely provide these temporary credentials to the new teammate.
                </p>

                <div className="space-y-3 p-4 bg-white border border-green-300 rounded-lg max-w-sm mx-auto shadow-md text-left">
                    <p className="text-gray-900 font-semibold">
                      Username: <span className="text-green-600 font-mono text-base ml-2">{creds.username}</span>
                    </p>
                    <p className="text-gray-900 font-semibold">
                      Password: <span className="text-red-500 font-mono text-base ml-2">{creds.password}</span>
                    </p>
                </div>
                
                <button
                  onClick={() => navigate("/admin/teammates")}
                  className="mt-8 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-gray-900 transition font-semibold"
                >
                  Go to Team Hub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}