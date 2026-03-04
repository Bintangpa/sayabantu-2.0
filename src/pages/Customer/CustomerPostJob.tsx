import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PostJob from "./PostJob";
import { ArrowLeft, LayoutDashboard, LogOut, ClipboardList } from "lucide-react";

const CustomerPostJob = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <span onClick={() => navigate("/")} className="text-base font-extrabold text-primary tracking-tight cursor-pointer">
              sayabantu<span className="text-accent">.com</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.name}</span>
            <button
              onClick={() => navigate("/customer/jobs")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Pekerjaan Saya
            </button>
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Post Pekerjaan Baru</h1>
          <p className="text-sm text-muted-foreground mt-1">Isi detail pekerjaan yang kamu butuhkan</p>
        </div>
        <PostJob />
      </main>
    </div>
  );
};

export default CustomerPostJob;