import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BulkUpload from "./pages/BulkUpload";
import AllLeadsPage from "./pages/AllLeadsPage";
import ViewLeadPage from "./pages/ViewLeadPage";
import InstaLeads from "./pages/InstaLeads";
import FollowUpPage from "./pages/FollowUpPage";
import CloudflareManager from "./pages/CloudflareManager"; // ⭐ ADD THIS

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/instaleads" element={<InstaLeads />} />

        <Route path="/bulk-upload" element={<BulkUpload />} />

        <Route path="/all-leads" element={<AllLeadsPage />} />

        <Route path="/view/:id" element={<ViewLeadPage />} />

        {/* FOLLOW UPS */}
        <Route path="/followups" element={<FollowUpPage />} />
        <Route path="/followup/:id" element={<FollowUpPage />} />

        {/* ⭐ CLOUDFLARE MANAGER PAGE */}
        <Route path="/cloudflare" element={<CloudflareManager />} />

      </Routes>
    </Router>
  );
}

export default App;
