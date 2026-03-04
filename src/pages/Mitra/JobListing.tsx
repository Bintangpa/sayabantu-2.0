import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  MapPin, Flame, Search, SlidersHorizontal,
  LayoutDashboard, LogOut, Briefcase, MessageCircle,
  CheckCircle2, RefreshCw, Clock, Tag, ChevronRight,
  User
} from "lucide-react";

interface DBJob {
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
}

const CATEGORIES = ["Semua", "Antar Barang", "Belanja", "Bersih-bersih", "Perbaikan", "Jasa Titip", "Lainnya"];

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

const JobListing = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [jobs, setJobs] = useState<DBJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [takingJobId, setTakingJobId] = useState<number | null>(null);

  const fetchJobs = () => {
    setLoading(true);
    api.get("/jobs")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !job.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== "Semua" && job.category !== selectedCategory) return false;
      if (urgentOnly && !job.is_urgent) return false;
      return true;
    });
  }, [jobs, searchQuery, selectedCategory, urgentOnly]);

  const handleAmbil = async (jobId: number) => {
    setTakingJobId(jobId);
    try {
      await api.put(`/jobs/${jobId}/take`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengambil pekerjaan.");
    } finally {
      setTakingJobId(null);
    }
  };

  const handleWA = (phone: string, jobTitle: string) => {
    const msg = encodeURIComponent(`Halo, saya tertarik dengan pekerjaan "${jobTitle}" di SayaBantu. Apakah masih tersedia?`);
    window.open(`https://wa.me/62${phone.replace(/^0/, "")}?text=${msg}`, "_blank");
  };

  const urgentCount = jobs.filter(j => j.is_urgent).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-card sticky top-0 z-30 shadow-sm">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <span onClick={() => navigate("/")} className="text-base font-extrabold text-primary tracking-tight cursor-pointer">
              sayabantu<span className="text-accent">.com</span>
            </span>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">{jobs.length}</span>
                <span className="text-xs text-muted-foreground">pekerjaan</span>
              </div>
              {urgentCount > 0 && (
                <div className="flex items-center gap-1.5 bg-destructive/5 border border-destructive/10 rounded-lg px-3 py-1.5">
                  <Flame className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-xs font-bold text-destructive">{urgentCount}</span>
                  <span className="text-xs text-muted-foreground">mendesak</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground">{user?.name}</span>
            </div>
            <button
              onClick={() => navigate("/mitra/dashboard")}
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

      {/* Search & Filter */}
      <div className="border-b border-border bg-background sticky top-[53px] z-20">
        <div className="container py-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari pekerjaan berdasarkan judul atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-card pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="mx-1 h-5 w-px shrink-0 bg-border" />
            <button
              onClick={() => setUrgentOnly(!urgentOnly)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                urgentOnly ? "bg-destructive text-white shadow-sm" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Flame className="h-3 w-3" /> Mendesak
            </button>
            <button
              onClick={fetchJobs}
              className="shrink-0 flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="container py-6">
        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-bold text-foreground">{filteredJobs.length}</span> pekerjaan
            {selectedCategory !== "Semua" && <span> di kategori <span className="font-semibold text-primary">{selectedCategory}</span></span>}
          </p>
          {urgentCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive animate-pulse">
              <Flame className="h-3 w-3" /> {urgentCount} pekerjaan mendesak
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-muted rounded w-1/3 mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                <div className="flex gap-2">
                  <div className="h-9 bg-muted rounded-lg flex-1" />
                  <div className="h-9 bg-muted rounded-lg w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">Belum ada pekerjaan tersedia</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Coba ubah filter atau refresh halaman.</p>
            <button onClick={fetchJobs} className="flex items-center gap-2 gradient-cta rounded-lg px-4 py-2 text-sm font-bold text-accent-foreground">
              <RefreshCw className="h-4 w-4" /> Refresh Sekarang
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-card rounded-2xl p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 border ${
                  job.is_urgent ? "border-destructive/30 bg-destructive/[0.02]" : "border-border"
                }`}
              >
                {/* Top badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
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
                <h3 className="text-sm font-bold text-foreground leading-snug mb-1.5 line-clamp-2">
                  {job.title}
                </h3>

                {/* Description preview */}
                {job.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                )}

                {/* Meta info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{timeAgo(job.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span>Oleh {job.customer_name}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Penawaran</p>
                    <p className="text-xl font-extrabold text-primary">
                      Rp {Number(job.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  {job.is_urgent && (
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                        <Clock className="h-3 w-3" /> Segera
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border mb-4" />

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAmbil(job.id)}
                    disabled={takingJobId === job.id}
                    className="flex-1 flex items-center justify-center gap-1.5 gradient-cta rounded-xl py-2.5 text-xs font-bold text-accent-foreground disabled:opacity-60 transition shadow-sm hover:shadow-md"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {takingJobId === job.id ? "Mengambil..." : "Ambil Pekerjaan"}
                  </button>
                  <button
                    onClick={() => handleWA(job.customer_phone, job.title)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-green-400 transition"
                    title="Hubungi via WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    WA
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobListing;