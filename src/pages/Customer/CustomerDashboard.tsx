import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PlusCircle, ClipboardList, User, LogOut } from "lucide-react";
import PostJob from "./PostJob";
import CustomerMyJobs from "./CustomerMyJobs";

type Tab = "post" | "myjobs" | "profile";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("post");

  const navItems = [
    { id: "post",    label: "Post Pekerjaan",  icon: PlusCircle },
    { id: "myjobs",  label: "Pekerjaan Saya",  icon: ClipboardList },
    { id: "profile", label: "Profil",           icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <span onClick={() => navigate("/")} className="text-lg font-extrabold text-primary tracking-tight cursor-pointer">
            sayabantu<span className="text-accent">.com</span>
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">Customer Panel</p>
        </div>

        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-8 py-4">
          <h1 className="text-lg font-bold text-foreground">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
          <p className="text-xs text-muted-foreground">Selamat datang, {user?.name}</p>
        </header>

        <div className="px-8 py-6">
          {activeTab === "post" && (
            <PostJob onSuccess={() => setActiveTab("myjobs")} />
          )}
          {activeTab === "myjobs" && (
            <CustomerMyJobs onPostJob={() => setActiveTab("post")} />
          )}
          {activeTab === "profile" && <ProfileTab user={user} />}
        </div>
      </main>
    </div>
  );
};

const ProfileTab = ({ user }: { user: any }) => (
  <div className="max-w-md">
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">Customer</p>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        {[{ label: "Email", value: user?.email }, { label: "No. WhatsApp", value: user?.phone || "-" }].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CustomerDashboard;