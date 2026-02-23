import { useState, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import SearchFilter from "@/components/SearchFilter";
import JobCard from "@/components/JobCard";
import LockedModal from "@/components/LockedModal";
import WhyJoinSection from "@/components/WhyJoinSection";
import { mockJobs, type Job } from "@/data/jobs";

const Index = () => {
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
    setSelectedJob(job);
    setModalOpen(true);
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
            <button className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Login
            </button>
            <button className="gradient-cta rounded-lg px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-sm">
              Daftar Mitra
            </button>
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
