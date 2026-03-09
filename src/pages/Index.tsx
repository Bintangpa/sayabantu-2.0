import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/HeroSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import { LogIn, UserPlus, LayoutDashboard, LogOut, ClipboardList, PlusCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isLoading && isAuthenticated && role === "mitra") {
    return <Navigate to="/mitra/jobs" replace />;
  }

  const handleDashboard = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "mitra") navigate("/mitra/dashboard");
    else navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero">
        <div className="container flex items-center justify-between py-3">

          {/* Kiri — Logo */}
          <span
            onClick={() => navigate("/")}
            className="text-lg font-extrabold text-primary-foreground tracking-tight cursor-pointer shrink-0"
          >
            sayabantu<span className="text-accent">.com</span>
          </span>

          {/* Tengah — Tombol navigasi customer */}
          {isAuthenticated && role === "customer" && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate("/customer/jobs")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                Pekerjaan Saya
              </button>
              <button
                onClick={() => navigate("/customer/post-job")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Post Pekerjaan
              </button>
              <button
                onClick={handleDashboard}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </button>
            </div>
          )}

          {/* Kanan — Halo user + logout / login + daftar */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <>
                <span className="text-xs text-primary-foreground/70 hidden sm:block">
                  Halo, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 gradient-cta rounded-lg px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-sm"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-1.5 gradient-cta rounded-lg px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Daftar
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      <HeroSection />
      <WhyJoinSection />
    </div>
  );
};

export default Index;