import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import SearchFilter from "@/components/SearchFilter";
import JobCard from "@/components/JobCard";
import LockedModal from "@/components/LockedModal";
import WhyJoinSection from "@/components/WhyJoinSection";
import { useAuth } from "@/hooks/useAuth";
import { mockJobs, type Job } from "@/data/jobs";
import { LogIn, UserPlus, LayoutDashboard, LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("Semua Lokasi");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory !== "Semua" && job.category !== selectedCategory) return false;
      if (selectedLocation !== "Semua Lokasi" && job.location !== selectedLocation) return false;
      if (urgentOnly && !job.isUrgent) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, selectedLocation, urgentOnly]);

  const handleViewDetail = (job: Job) => {
    if (!isAuthenticated) {
      setSelectedJob(job);
      setModalOpen(true);
    } else {
      // kalau sudah login arahkan ke dashboard
      if (role === "mitra") navigate("/mitra/dashboard");
      else if (role === "customer") navigate("/customer/dashboard");
      else navigate("/admin/dashboard");
    }
  };

  const handleDashboard = () => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "mitra") navigate("/mitra/dashboard");
    else navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="gradient-hero">
        <div className="container flex items-center justify-between py-3">
          <span className="text-lg font-extrabold text-primary-foreground tracking-tight">
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
                  onClick={() => navigate("/register/mitra")}
                  className="flex items-center gap-1.5 gradient-cta rounded-lg px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Daftar Mitra
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <HeroSection />
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

      {/* Job List */}
      <section className="py-6">
        <div className="container">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              {filteredJobs.length} pekerjaan ditemukan
            </p>
            <span className="animate-pulse-slow inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Pekerjaan terus bertambah
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onViewDetail={handleViewDetail} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-bold text-muted-foreground">Tidak ada pekerjaan ditemukan</p>
              <p className="mt-1 text-sm text-muted-foreground">Coba ubah filter pencarian Anda.</p>
            </div>
          )}
        </div>
      </section>

      <WhyJoinSection />
      <LockedModal job={selectedJob} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Index;