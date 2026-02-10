import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ---------- PUBLIC PAGES ---------- */
import LoginPage from "./pages/LoginPage";
import IQSyncLanding from "./pages/website";

/* ---------- LAYOUT ---------- */
import AppLayout from "./layouts/AppLayout";

/* ---------- PROTECTED PAGES ---------- */
import Home from "./pages/Dashboard";
import AllLeadsPage from "./pages/AllLeadsPage";
import FollowUpPage from "./pages/FollowUpPage";
import ViewLeadPage from "./pages/ViewLeadPage";
import TeammatesPage from "./pages/TeammatesPage";
import AddTeammatePage from "./pages/AddTeammatePage";
import InstaLeads from "./pages/InstaLeads";
import CloudflareManager from "./pages/CloudflareManager";
import ChooseTemplatePage from "./pages/ChooseTemplatePage";
import AIPoster from "./pages/AIPoster";
import SmartQuotes from "./pages/SmartQuotes";

/* ---------- ROUTE GUARD ---------- */
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<IQSyncLanding />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 PROTECTED APP (WITH GLOBAL LAYOUT) */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/all-leads" element={<AllLeadsPage />} />
          <Route path="/followups" element={<FollowUpPage />} />
          <Route path="/instaleads" element={<InstaLeads />} />
          <Route path="/aiposter" element={<AIPoster />} />
          <Route path="/quotes" element={<SmartQuotes />} />

          <Route
            path="/cloudflare"
            element={
              <PrivateRoute roles={["SUPER_ADMIN"]}>
                <CloudflareManager />
              </PrivateRoute>
            }
          />

          <Route path="/leads/:id/edit" element={<ViewLeadPage />} />
          <Route path="/leads/:id/templates" element={<ChooseTemplatePage />} />

          <Route path="/admin/teammates" element={<TeammatesPage />} />
          <Route path="/admin/teammates/new" element={<AddTeammatePage />} />
        </Route>

        {/* 🌍 FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}