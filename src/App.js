import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BulkUpload from "./pages/BulkUpload";
import AllLeadsPage from "./pages/AllLeadsPage";
import ViewLeadPage from "./pages/ViewLeadPage";
import InstaLeads from "./pages/InstaLeads"; // <-- Import the new InstaLeads page

function App() {
  return (
    <Router>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* INSTA LEADS PAGE (NEW) */}
        <Route path="/instaleads" element={<InstaLeads />} /> 

        {/* BULK UPLOAD PAGE */}
        <Route path="/bulk-upload" element={<BulkUpload />} />

        {/* ALL LEADS PAGE */}
        <Route path="/all-leads" element={<AllLeadsPage />} />

        {/* VIEW LEAD PAGE (50/50 SPLIT SCREEN) */}
        <Route path="/view/:id" element={<ViewLeadPage />} />

      </Routes>
    </Router>
  );
}

export default App;