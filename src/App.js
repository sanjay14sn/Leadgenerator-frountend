import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import AllLeadsPage from "./pages/AllLeadsPage";
import FollowUpPage from "./pages/FollowUpPage";
import ViewLeadPage from "./pages/ViewLeadPage";
import TeammatesPage from "./pages/TeammatesPage";
import AddTeammatePage from "./pages/AddTeammatePage";
import InstaLeads from "./pages/InstaLeads";
import CloudflareManager from "./pages/CloudflareManager";

import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED */}
        <Route
          path="/"
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

        {/* FALLBACK */}
        <Route path="*" element={<div>404 – Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
