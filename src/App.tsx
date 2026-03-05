import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RegisterMitra from "@/pages/RegisterMitra";
import CustomerDashboard from "@/pages/Customer/CustomerDashboard";
import CustomerJobs from "@/pages/Customer/CustomerJobs";
import CustomerPostJob from "@/pages/Customer/CustomerPostJob";
import MitraDashboard from "@/pages/Mitra/MitraDashboard";
import JobListing from "@/pages/Mitra/JobListing";
import EditProfileMitra from "@/pages/Mitra/EditProfileMitra";
import MitraJobHistory from "@/pages/Mitra/MitraJobHistory";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/mitra" element={<RegisterMitra />} />

        {/* Customer */}
        <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/jobs" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerJobs /></ProtectedRoute>} />
        <Route path="/customer/post-job" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerPostJob /></ProtectedRoute>} />

        {/* Mitra */}
        <Route path="/mitra/dashboard" element={<ProtectedRoute allowedRoles={["mitra"]}><MitraDashboard /></ProtectedRoute>} />
        <Route path="/mitra/jobs" element={<ProtectedRoute allowedRoles={["mitra"]}><JobListing /></ProtectedRoute>} />
        <Route path="/mitra/edit-profile" element={<ProtectedRoute allowedRoles={["mitra"]}><EditProfileMitra /></ProtectedRoute>} />
        <Route path="/mitra/history" element={<ProtectedRoute allowedRoles={["mitra"]}><MitraJobHistory /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;