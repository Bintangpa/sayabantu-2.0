import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  ClipboardList, MapPin, Tag, Clock, User,
  LayoutDashboard, LogOut, PlusCircle, RefreshCw,
  CheckCircle2, Hourglass, CircleDot, Flame
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  is_urgent: boolean;
  status: "open" | "taken" | "done";
  mitra_name: string | null;
  mitra_phone: string | null;
  created_at: string;
}

const statusConfig = {
  open: { label: "Menunggu Mitra", icon: CircleDot, color: "bg-yellow-500/10 text-yellow-600" },
  taken: { label: "Sedang Dikerjakan", icon: Hourglass, color: "bg-blue-500/10 text-blue-600" },
  done: { label: "Selesai", icon: CheckCircle2, color: "bg-green-500/10 text-green-600" },
};

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

const CustomerJobs = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "taken" | "done">("all");

  const fetchJobs = () => {
    setLoading(true);
    api.get("/jobs/my")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  const counts = {
    all: jobs.length,
    open: jobs.filter(j => j.status === "open").length,
    taken: jobs.filter(j => j.status === "taken").length,
    done: jobs.filter(j => j.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <span onClick={() => navigate("/")} className="text-base font-extrabold text-primary tracking-tight cursor-pointer">
              sayabantu<span className="text-accent">.com</span>
            </span>
            <div className="hidden sm:flex items-center gap-1.5 bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5">
              <ClipboardList className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">{jobs.length}</span>
              <span className="text-xs text-muted-foreground">pekerjaan diposting</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.name}</span>
            <button
              onClick={() => navigate("/customer/post-job")}
              className="flex items-center gap-1.5 gradient-cta rounded-lg px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Post Pekerjaan
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

      {/* Filter tabs */}
      <div className="border-b border-border bg-background sticky top-[53px] z-20">
        <div className="container py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {(["all", "open", "taken", "done"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {key === "all" && "Semua"}
              {key === "open" && "Menunggu Mitra"}
              {key === "taken" && "Sedang Dikerjakan"}
              {key === "done" && "Selesai"}
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                filter === key ? "bg-white/20" : "bg-muted"
              }`}>
                {counts[key]}
              </span>
            </button>
          ))}
          <button
            onClick={fetchJobs}
            className="shrink-0 flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition ml-auto"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="container py-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-muted rounded w-1/3 mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                <div className="h-6 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">
              {filter === "all" ? "Belum ada pekerjaan diposting" : `Tidak ada pekerjaan dengan status ini`}
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {filter === "all" ? "Post pekerjaan pertamamu sekarang!" : "Coba pilih filter yang lain."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => navigate("/customer/post-job")}
                className="flex items-center gap-2 gradient-cta rounded-xl px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                Post Pekerjaan Sekarang
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((job) => {
              const status = statusConfig[job.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={job.id}
                  className={`bg-card border rounded-2xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    job.is_urgent ? "border-destructive/30" : "border-border"
                  }`}
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                    {job.is_urgent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                        <Flame className="h-3 w-3" /> Mendesak
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      <Tag className="h-3 w-3" /> {job.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-foreground leading-snug mb-1.5 line-clamp-2">{job.title}</h3>

                  {/* Desc */}
                  {job.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{job.description}</p>
                  )}

                  {/* Meta */}
                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" /> {job.location}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" /> Diposting {timeAgo(job.created_at)}
                    </p>
                    {job.mitra_name && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 shrink-0" /> Dikerjakan oleh: <span className="font-semibold text-foreground">{job.mitra_name}</span>
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Penawaran</p>
                      <p className="text-base font-extrabold text-primary">
                        Rp {Number(job.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerJobs;