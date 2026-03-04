import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  Briefcase, Clock, CheckCircle2, User, LogOut,
  MessageCircle, CheckCircle, MapPin, Tag, ExternalLink,
  TrendingUp, Star, Phone, Mail, RefreshCw
} from "lucide-react";

type Tab = "overview" | "inprogress" | "done" | "profile";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  is_urgent: boolean;
  status: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
  updated_at: string;
}

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

const MitraDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [inProgressJobs, setInProgressJobs] = useState<Job[]>([]);
  const [doneJobs, setDoneJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyJobs = () => {
    setLoading(true);
    api.get("/jobs/mitra/my")
      .then((res) => {
        const all: Job[] = res.data.jobs;
        setInProgressJobs(all.filter(j => j.status === "taken"));
        setDoneJobs(all.filter(j => j.status === "done"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMyJobs(); }, []);

  const totalEarnings = doneJobs.reduce((sum, j) => sum + Number(j.price), 0);

  const navItems = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "inprogress", label: "Sedang Dikerjakan", icon: Clock, count: inProgressJobs.length },
    { id: "done", label: "Riwayat Selesai", icon: CheckCircle2, count: doneJobs.length },
    { id: "profile", label: "Profil", icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <span onClick={() => navigate("/")} className="text-lg font-extrabold text-primary tracking-tight cursor-pointer">
            sayabantu<span className="text-accent">.com</span>
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">Mitra Panel</p>
        </div>

        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-muted-foreground">Mitra Aktif</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon, ...rest }: any) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </span>
              {rest.count !== undefined && rest.count > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  activeTab === id ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}>
                  {rest.count}
                </span>
              )}
            </button>
          ))}

          <div className="pt-2 border-t border-border mt-2">
            <button
              onClick={() => navigate("/mitra/jobs")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <Briefcase className="h-4 w-4 shrink-0" />
              Cari Pekerjaan
              <ExternalLink className="h-3 w-3 ml-auto" />
            </button>
          </div>
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
        <header className="border-b border-border bg-card px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-muted-foreground">Selamat datang, {user?.name}</p>
          </div>
          <button
            onClick={fetchMyJobs}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

        <div className="px-8 py-6">
          {activeTab === "overview" && (
            <OverviewTab
              inProgressJobs={inProgressJobs}
              doneJobs={doneJobs}
              totalEarnings={totalEarnings}
              navigate={navigate}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "inprogress" && (
            <JobsTab
              jobs={inProgressJobs}
              loading={loading}
              emptyTitle="Belum ada pekerjaan aktif"
              emptyDesc="Ambil pekerjaan dari halaman Cari Pekerjaan."
              onRefresh={fetchMyJobs}
              showDone
              onDone={(jobId: number) => alert(`Fitur selesaikan pekerjaan segera tersedia! (Job ID: ${jobId})`)}
            />
          )}
          {activeTab === "done" && (
            <JobsTab
              jobs={doneJobs}
              loading={loading}
              emptyTitle="Belum ada riwayat selesai"
              emptyDesc="Pekerjaan yang sudah selesai akan muncul di sini."
              onRefresh={fetchMyJobs}
            />
          )}
          {activeTab === "profile" && <ProfileTab user={user} />}
        </div>
      </main>
    </div>
  );
};

const OverviewTab = ({ inProgressJobs, doneJobs, totalEarnings, navigate, setActiveTab }: any) => (
  <div className="space-y-6 max-w-4xl">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Sedang Dikerjakan</span>
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-foreground">{inProgressJobs.length}</p>
        <p className="text-xs text-muted-foreground mt-1">pekerjaan aktif</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Selesai</span>
          <div className="h-9 w-9 rounded-xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-foreground">{doneJobs.length}</p>
        <p className="text-xs text-muted-foreground mt-1">pekerjaan selesai</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Pendapatan</span>
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-foreground">
          Rp {totalEarnings.toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">dari {doneJobs.length} pekerjaan</p>
      </div>
    </div>

    {inProgressJobs.length > 0 && (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Pekerjaan Aktif</h2>
          <button onClick={() => setActiveTab("inprogress")} className="text-xs font-semibold text-primary hover:underline">
            Lihat semua
          </button>
        </div>
        <div className="space-y-3">
          {inProgressJobs.slice(0, 2).map((job: Job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    )}

    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-foreground">Cari Pekerjaan Baru</p>
        <p className="text-xs text-muted-foreground mt-0.5">Lihat semua pekerjaan yang tersedia untukmu</p>
      </div>
      <button
        onClick={() => navigate("/mitra/jobs")}
        className="flex items-center gap-2 gradient-cta rounded-xl px-4 py-2.5 text-xs font-bold text-accent-foreground shadow-sm"
      >
        <Briefcase className="h-3.5 w-3.5" />
        Cari Sekarang
      </button>
    </div>
  </div>
);

const JobsTab = ({ jobs, loading, emptyTitle, emptyDesc, onRefresh, showDone, onDone }: any) => {
  if (loading) return (
    <div className="space-y-3 max-w-3xl">
      {[1,2,3].map(i => (
        <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
          <div className="h-3 bg-muted rounded w-1/4 mb-3" />
          <div className="h-4 bg-muted rounded w-2/3 mb-4" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      ))}
    </div>
  );

  if (jobs.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-base font-bold text-foreground">{emptyTitle}</p>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{emptyDesc}</p>
      <button onClick={onRefresh} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">
        <RefreshCw className="h-3.5 w-3.5" /> Refresh
      </button>
    </div>
  );

  return (
    <div className="space-y-4 max-w-3xl">
      {jobs.map((job: Job) => (
        <JobCard key={job.id} job={job} showDone={showDone} onDone={onDone} />
      ))}
    </div>
  );
};

const JobCard = ({ job, showDone, onDone }: { job: Job; showDone?: boolean; onDone?: (id: number) => void }) => {
  const handleWA = () => {
    const msg = encodeURIComponent(`Halo ${job.customer_name}, saya mitra SayaBantu yang mengerjakan "${job.title}".`);
    window.open(`https://wa.me/62${job.customer_phone?.replace(/^0/, "")}?text=${msg}`, "_blank");
  };

  return (
    <div className={`bg-card border rounded-2xl p-5 transition-all hover:shadow-md ${job.is_urgent ? "border-destructive/30" : "border-border"}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {job.is_urgent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">Mendesak</span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <Tag className="h-3 w-3" /> {job.category}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              job.status === "taken" ? "bg-blue-500/10 text-blue-600" : "bg-green-500/10 text-green-600"
            }`}>
              {job.status === "taken" ? "Sedang dikerjakan" : "Selesai"}
            </span>
          </div>
          <h3 className="text-sm font-bold text-foreground leading-snug">{job.title}</h3>
        </div>
        <p className="text-base font-extrabold text-primary shrink-0">
          Rp {Number(job.price).toLocaleString("id-ID")}
        </p>
      </div>

      <div className="space-y-1.5 mb-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" /> {job.location}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><User className="h-3.5 w-3.5 shrink-0" /> Customer: {job.customer_name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 shrink-0" /> Diambil {timeAgo(job.updated_at)}</p>
      </div>

      <div className="flex gap-2">
        {showDone && onDone && (
          <button
            onClick={() => onDone(job.id)}
            className="flex-1 flex items-center justify-center gap-1.5 gradient-cta rounded-xl py-2 text-xs font-bold text-accent-foreground transition"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Tandai Selesai
          </button>
        )}
        <button
          onClick={handleWA}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted hover:border-green-400 transition"
        >
          <MessageCircle className="h-3.5 w-3.5 text-green-500" /> Hubungi Customer
        </button>
      </div>
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
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-muted-foreground">Mitra Aktif</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        {[
          { icon: Mail, label: "Email", value: user?.email },
          { icon: Phone, label: "No. WhatsApp", value: user?.phone || "-" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-2.5 border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => window.location.href = "/mitra/edit-profile"}
        className="w-full mt-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
      >
        Ubah Kata Sandi
      </button>
    </div>
  </div>
);

export default MitraDashboard;