import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import AllLeadsPage from "./pages/AllLeadsPage";
import FollowUpPage from "./pages/FollowUpPage";
import ViewLeadPage from "./pages/ViewLeadPage";
import TeammatesPage from "./pages/TeammatesPage";
import AddTeammatePage from "./pages/AddTeammatePage";
import InstaLeads from "./pages/InstaLeads";
import CloudflareManager from "./pages/CloudflareManager";
import ChooseTemplatePage from "./pages/ChooseTemplatePage";
import AIPoster from "./pages/AIPoster";
import IQSyncLanding from "./pages/website";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<IQSyncLanding />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-leads"
          element={
            <PrivateRoute>
              <AllLeadsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/leads/:id/templates"
          element={
            <PrivateRoute>
              <ChooseTemplatePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/leads/:id/edit"
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

        <Route
          path="/instaleads"
          element={
            <PrivateRoute>
              <InstaLeads />
            </PrivateRoute>
          }
        />

        <Route
          path="/cloudflare"
          element={
            <PrivateRoute roles={["SUPER_ADMIN"]}>
              <CloudflareManager />
            </PrivateRoute>
          }
        />

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

        <Route
          path="/aiposter"
          element={
            <PrivateRoute>
              <AIPoster />
            </PrivateRoute>
          }
        />

        {/* 🌍 FALLBACK → redirect unknown routes to website */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
