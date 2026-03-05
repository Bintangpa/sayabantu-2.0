import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Selama auth belum selesai dicek, jangan render apapun — cegah flash/glitch
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "mitra") return <Navigate to="/mitra/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;