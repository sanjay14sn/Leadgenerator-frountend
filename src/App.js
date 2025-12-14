 // src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* -------------------- PAGES -------------------- */
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import AllLeadsPage from "./pages/AllLeadsPage";
import FollowUpPage from "./pages/FollowUpPage";
import ViewLeadPage from "./pages/ViewLeadPage";

/* TEAM MANAGEMENT */
import TeammatesPage from "./pages/TeammatesPage";
import AddTeammatePage from "./pages/AddTeammatePage";

/* EXTRA MODULES */
import InstaLeads from "./pages/InstaLeads";
import CloudflareManager from "./pages/CloudflareManager";

/* ROUTE GUARD */
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------------- PUBLIC ---------------- */}
        <Route path="/login" element={<LoginPage />} />

        {/* ---------------- DASHBOARD ---------------- */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* ---------------- LEADS ---------------- */}
        <Route
          path="/all-leads"
          element={
            <PrivateRoute>
              <AllLeadsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/lead/:id"
          element={
            <PrivateRoute>
              <ViewLeadPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/followups"
          element={
            <PrivateRoute>
              <FollowUpPage />
            </PrivateRoute>
          }
        />

        <Route path="/followup/:id" element={<PrivateRoute><FollowUpPage /></PrivateRoute>} />


        {/* ---------------- INSTAGRAM ---------------- */}
        <Route
          path="/instaleads"
          element={
            <PrivateRoute>
              <InstaLeads />
            </PrivateRoute>
          }
        />

        {/* ---------------- CLOUDFLARE ---------------- */}
        <Route
          path="/cloudflare"
          element={
            <PrivateRoute>
              <CloudflareManager />
            </PrivateRoute>
          }
        />

        {/* ---------------- TEAM MANAGEMENT ---------------- */}
        <Route
          path="/admin/teammates"
          element={
            <PrivateRoute>
              <TeammatesPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/teammates/new"
          element={
            <PrivateRoute>
              <AddTeammatePage />
            </PrivateRoute>
          }
        />

        {/* ---------------- FALLBACK ---------------- */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
              404 – Page Not Found
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
