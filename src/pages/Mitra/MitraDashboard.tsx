import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Clock, CheckCircle2, User, LogOut, MessageCircle, Check } from "lucide-react";

type Tab = "jobs" | "inprogress" | "done" | "profile";

const dummyJobs = [
  { id: 1, title: "Ambilkan paket di Alfamart Jl. Merdeka", category: "Antar Barang", location: "Soreang", price: 50000, isUrgent: true, customerName: "Andi", customerPhone: "081234567890" },
  { id: 2, title: "Belanja sayur di pasar pagi", category: "Belanja", location: "Ciwidey", price: 30000, isUrgent: false, customerName: "Sari", customerPhone: "082345678901" },
  { id: 3, title: "Bersihkan rumah 2 lantai", category: "Bersih-bersih", location: "Soreang", price: 150000, isUrgent: false, customerName: "Budi", customerPhone: "083456789012" },
];

const MitraDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("jobs");

  const navItems = [
    { id: "jobs", label: "Pekerjaan Tersedia", icon: Briefcase },
    { id: "inprogress", label: "Sedang Dikerjakan", icon: Clock },
    { id: "done", label: "Riwayat Selesai", icon: CheckCircle2 },
    { id: "profile", label: "Profil", icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <span className="text-lg font-extrabold text-primary tracking-tight">
            sayabantu<span className="text-accent">.com</span>
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">Mitra Panel</p>
        </div>

        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
              <User className="h-4 w-4 text-accent" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="border-b border-border bg-card px-8 py-4">
          <h1 className="text-lg font-bold text-foreground">{navItems.find((n) => n.id === activeTab)?.label}</h1>
          <p className="text-xs text-muted-foreground">Selamat datang, {user?.name}</p>
        </header>

        <div className="px-8 py-6">
          {activeTab === "jobs" && <JobListTab />}
          {activeTab === "inprogress" && <EmptyState icon={Clock} title="Tidak ada pekerjaan aktif" desc="Pekerjaan yang kamu ambil akan muncul di sini." />}
          {activeTab === "done" && <EmptyState icon={CheckCircle2} title="Belum ada riwayat" desc="Pekerjaan yang sudah selesai akan muncul di sini." />}
          {activeTab === "profile" && <ProfileTab user={user} />}
        </div>
      </main>
    </div>
  );
};

const JobListTab = () => {
  const handleAmbil = (jobId: number) => {
    alert(`Fitur ambil pekerjaan akan segera tersedia! (Job ID: ${jobId})`);
  };

  const handleWA = (phone: string, jobTitle: string) => {
    const msg = encodeURIComponent(`Halo, saya tertarik dengan pekerjaan "${jobTitle}" di SayaBantu. Apakah masih tersedia?`);
    window.open(`https://wa.me/62${phone.replace(/^0/, "")}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {dummyJobs.map((job) => (
        <div key={job.id} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {job.isUrgent && <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">Mendesak</span>}
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{job.category}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">{job.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{job.location}</p>
            </div>
            <p className="text-base font-extrabold text-primary shrink-0">Rp {job.price.toLocaleString("id-ID")}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => handleAmbil(job.id)} className="flex items-center gap-1.5 gradient-cta rounded-lg px-4 py-2 text-xs font-bold text-accent-foreground transition">
              <Check className="h-3.5 w-3.5" /> Ambil Pekerjaan
            </button>
            <button onClick={() => handleWA(job.customerPhone, job.title)} className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition">
              <MessageCircle className="h-3.5 w-3.5 text-green-500" /> Hubungi via WA
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProfileTab = ({ user }: { user: any }) => (
  <div className="max-w-md">
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="h-8 w-8 text-accent" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">Mitra</p>
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
      <button className="w-full mt-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">Edit Profil</button>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <p className="text-base font-bold text-foreground">{title}</p>
    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
  </div>
);

export default MitraDashboard;