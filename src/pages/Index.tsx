import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import HeroSection from "@/components/HeroSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import SearchFilter from "@/components/SearchFilter";
import api from "@/lib/api";
import { LogIn, UserPlus, LayoutDashboard, LogOut, Flame, MapPin } from "lucide-react";

interface DBJob {
  id: number;
  title: string;
  category: string;
  location: string;
  price: number;
  is_urgent: boolean;
  status: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role, logout } = useAuth();

  const [dbJobs, setDbJobs] = useState<DBJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("Semua Lokasi");
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Fetch jobs hanya kalau sudah login
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingJobs(true);
      api.get("/jobs")
        .then((res) => setDbJobs(res.data.jobs))
        .catch(() => {})
        .finally(() => setLoadingJobs(false));
    }
  }, [isAuthenticated]);

  const filteredJobs = useMemo(() => {
    return dbJobs.filter((job) => {
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== "Semua" && job.category !== selectedCategory) return false;
      if (selectedLocation !== "Semua Lokasi" && !job.location.includes(selectedLocation)) return false;
      if (urgentOnly && !job.is_urgent) return false;
      return true;
    });
  }, [dbJobs, searchQuery, selectedCategory, selectedLocation, urgentOnly]);

  const handleDashboard = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "mitra") navigate("/mitra/dashboard");
    else navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="gradient-hero">
        <div className="container flex items-center justify-between py-3">
          <span
            onClick={() => navigate("/")}
            className="text-lg font-extrabold text-primary-foreground tracking-tight cursor-pointer"
          >
            sayabantu<span className="text-accent">.com</span>
          </span>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-xs text-primary-foreground/70 hidden sm:block">
                  Halo, {user?.name}
                </span>
                <button
                  onClick={handleDashboard}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </button>
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

      {/* Hero selalu tampil */}
      <HeroSection />

      {/* Job listing hanya kalau sudah login */}
      {isAuthenticated && (
        <>
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            urgentOnly={urgentOnly}
            onUrgentChange={setUrgentOnly}
          />

          <section className="py-6">
            <div className="container">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  {filteredJobs.length} pekerjaan tersedia
                </p>
                <span className="animate-pulse-slow inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Pekerjaan terus bertambah
                </span>
              </div>

              {loadingJobs ? (
                <div className="flex justify-center py-20">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-lg font-bold text-muted-foreground">Belum ada pekerjaan tersedia</p>
                  <p className="mt-1 text-sm text-muted-foreground">Coba ubah filter atau cek lagi nanti.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="glass-card rounded-2xl p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {job.is_urgent && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-urgent/15 px-2 py-0.5 text-xs font-bold text-urgent">
                            <Flame className="h-3 w-3" /> Butuh Cepat
                          </span>
                        )}
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {job.category}
                        </span>
                      </div>
                      <h3 className="mb-1 text-base font-bold text-foreground leading-snug">{job.title}</h3>
                      <p className="mb-3 text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {job.location}
                      </p>
                      <p className="mb-4 text-lg font-extrabold text-accent">
                        Rp {Number(job.price).toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => navigate(role === "mitra" ? "/mitra/dashboard" : "/customer/dashboard")}
                        className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
                      >
                        {role === "mitra" ? "Ambil Pekerjaan" : "Lihat Detail"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* WhyJoinSection selalu tampil */}
      <WhyJoinSection />
    </div>
  );
};

export default Index;