import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  CheckCircle2, Clock, MapPin, Tag, User, ArrowLeft,
  TrendingUp, Calendar, Search, Filter, ChevronDown,
  Banknote, Star, MessageCircle, RefreshCw, Inbox
} from "lucide-react";

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
  completed_at?: string;
}

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  return `${Math.floor(diff / 2592000)} bulan lalu`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });
};

const CATEGORIES = [
  "Semua", "Kebersihan", "Pindahan", "Tukang", "Elektrik",
  "AC & Pendingin", "Taman", "Kurir", "Masak & Catering", "Lainnya"
];

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "highest", label: "Harga Tertinggi" },
  { value: "lowest", label: "Harga Terendah" },
];

export default function MitraJobHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilter, setShowFilter] = useState(false);

  const fetchHistory = () => {
    setLoading(true);
    api.get("/jobs/mitra/history")
      .then((res) => setJobs(res.data.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, []);

  // Filter & sort
  const filtered = jobs
    .filter((j) => {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.customer_name?.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "Semua" || j.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === "oldest") return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      if (sortBy === "highest") return Number(b.price) - Number(a.price);
      if (sortBy === "lowest") return Number(a.price) - Number(b.price);
      return 0;
    });

  const totalEarnings = filtered.reduce((sum, j) => sum + Number(j.price), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/mitra/dashboard")}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-foreground">Riwayat Pekerjaan</h1>
            <p className="text-xs text-muted-foreground">Semua pekerjaan yang telah selesai</p>
          </div>
          <button
            onClick={fetchHistory}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Selesai</span>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{jobs.length}</p>
            <p className="text-xs text-muted-foreground">pekerjaan</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Total Pendapatan</span>
              <Banknote className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-extrabold text-foreground leading-tight">
              Rp {totalEarnings.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-muted-foreground">total diterima</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Rata-rata</span>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-lg font-extrabold text-foreground leading-tight">
              Rp {jobs.length > 0 ? Math.round(totalEarnings / jobs.length).toLocaleString("id-ID") : "0"}
            </p>
            <p className="text-xs text-muted-foreground">per pekerjaan</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari pekerjaan atau nama customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                showFilter ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>

          {showFilter && (
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Kategori</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Urutkan</p>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-muted text-sm text-foreground rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-xs text-muted-foreground">
            Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> pekerjaan
            {selectedCategory !== "Semua" && ` dalam kategori "${selectedCategory}"`}
          </p>
        )}

        {/* Job list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-muted rounded w-1/4 mb-3" />
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-base font-bold text-foreground">
              {jobs.length === 0 ? "Belum ada riwayat pekerjaan" : "Tidak ada hasil"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {jobs.length === 0
                ? "Pekerjaan yang sudah selesai akan muncul di sini."
                : "Coba ubah kata kunci atau filter pencarian."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <HistoryCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ job }: { job: Job }) {
  const handleWA = () => {
    const msg = encodeURIComponent(`Halo ${job.customer_name}, terima kasih sudah menggunakan jasa saya melalui SayaBantu untuk pekerjaan "${job.title}".`);
    window.open(`https://wa.me/62${job.customer_phone?.replace(/^0/, "")}?text=${msg}`, "_blank");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-600">
              <CheckCircle2 className="h-3 w-3" /> Selesai
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <Tag className="h-3 w-3" /> {job.category}
            </span>
            {job.is_urgent && (
              <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                Mendesak
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-foreground leading-snug truncate">{job.title}</h3>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-extrabold text-primary">
            Rp {Number(job.price).toLocaleString("id-ID")}
          </p>
          <div className="flex items-center gap-0.5 justify-end mt-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="space-y-1.5 mb-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {job.location}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 shrink-0" /> Customer: <span className="text-foreground font-medium">{job.customer_name}</span>
        </p>
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" /> {formatDate(job.updated_at)}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" /> {timeAgo(job.updated_at)}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={handleWA}
          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:border-green-400 hover:text-foreground transition"
        >
          <MessageCircle className="h-3.5 w-3.5 text-green-500" /> Hubungi Customer
        </button>
      </div>
    </div>
  );
}