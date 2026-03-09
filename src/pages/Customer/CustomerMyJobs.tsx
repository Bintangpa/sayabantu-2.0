import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  ClipboardList, MapPin, Tag, Clock, User,
  CheckCircle2, Hourglass, CircleDot, Flame,
  RefreshCw, PlusCircle
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
  updated_at: string;
}

const statusConfig = {
  open:  { label: "Menunggu Mitra",    icon: CircleDot,   color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  taken: { label: "Sedang Dikerjakan", icon: Hourglass,   color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  done:  { label: "Selesai",           icon: CheckCircle2, color: "bg-green-500/10 text-green-600 border-green-500/20" },
};

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

interface CustomerMyJobsProps {
  onPostJob?: () => void;
}

const CustomerMyJobs = ({ onPostJob }: CustomerMyJobsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "taken" | "done">("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchJobs = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    api.get("/jobs/my")
      .then((res) => { setJobs(res.data.jobs || []); setLastUpdated(new Date()); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchJobs(); }, []);

  // Auto-refresh setiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => fetchJobs(true), 10000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);
  const counts = {
    all: jobs.length,
    open: jobs.filter(j => j.status === "open").length,
    taken: jobs.filter(j => j.status === "taken").length,
    done: jobs.filter(j => j.status === "done").length,
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Menunggu",  count: counts.open,  color: "text-yellow-600" },
          { label: "Dikerjakan", count: counts.taken, color: "text-blue-600" },
          { label: "Selesai",   count: counts.done,  color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Auto-refresh + manual refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-xs text-muted-foreground">Auto-refresh setiap 10 detik</p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground hidden sm:block">
              · Update: {lastUpdated.toLocaleTimeString("id-ID")}
            </p>
          )}
        </div>
        <button
          onClick={() => fetchJobs()}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "open", "taken", "done"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {key === "all" && "Semua"}
            {key === "open" && "Menunggu Mitra"}
            {key === "taken" && "Dikerjakan"}
            {key === "done" && "Selesai"}
            <span className={`rounded-full px-1.5 py-0.5 font-bold ${filter === key ? "bg-white/20" : "bg-muted"}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Job list */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1,2,3].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="h-3 bg-muted rounded w-1/3 mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-base font-bold text-foreground">
            {jobs.length === 0 ? "Belum ada pekerjaan diposting" : "Tidak ada pekerjaan dengan status ini"}
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {jobs.length === 0 ? "Post pekerjaan pertamamu sekarang!" : "Coba pilih filter lain."}
          </p>
          {jobs.length === 0 && onPostJob && (
            <button
              onClick={onPostJob}
              className="flex items-center gap-2 gradient-cta rounded-xl px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Post Sekarang
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => {
            const s = statusConfig[job.status];
            const StatusIcon = s.icon;
            return (
              <div
                key={job.id}
                className={`bg-card border rounded-2xl p-5 transition-all hover:shadow-md ${
                  job.is_urgent ? "border-destructive/30" : "border-border"
                }`}
              >
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {s.label}
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

                <h3 className="text-sm font-bold text-foreground leading-snug mb-1 line-clamp-2">{job.title}</h3>
                {job.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                )}

                <div className="space-y-1.5 mb-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" /> {job.location}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" /> {timeAgo(job.created_at)}
                  </p>
                  {job.mitra_name && (
                    <p className="text-xs flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      <span className="text-muted-foreground">Dikerjakan:</span>
                      <span className="font-semibold text-foreground">{job.mitra_name}</span>
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Penawaran</p>
                  <p className="text-base font-extrabold text-primary">
                    Rp {Number(job.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerMyJobs;