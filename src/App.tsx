import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

// Placeholder pages — ganti dengan komponen asli nanti
const CustomerDashboard = () => <div className="p-8 text-center font-bold text-2xl">Customer Dashboard</div>;
const MitraDashboard = () => <div className="p-8 text-center font-bold text-2xl">Mitra Dashboard</div>;
const AdminDashboard = () => <div className="p-8 text-center font-bold text-2xl">Admin Dashboard</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Mitra Routes */}
        <Route
          path="/mitra/dashboard"
          element={
            <ProtectedRoute allowedRoles={["mitra"]}>
              <MitraDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;