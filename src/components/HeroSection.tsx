import { useEffect, useState } from "react";
import { Briefcase, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [stats, setStats] = useState({ total: 0, mitras: 0, urgent: 0 });

  useEffect(() => {
    api.get("/jobs/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats({ total: 125, mitras: 87, urgent: 24 }));
  }, []);

  const handleDaftarMitra = () => {
    if (isAuthenticated && role === "mitra") navigate("/mitra/dashboard");
    else navigate("/register/mitra");
  };

  const handleLogin = () => {
    if (isAuthenticated) {
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "mitra") navigate("/mitra/dashboard");
      else navigate("/customer/dashboard");
    } else {
      navigate("/login");
    }
  };

  const statItems = [
    { icon: Briefcase, value: `${stats.total}+`, label: "pekerjaan tersedia hari ini" },
    { icon: Users, value: `${stats.mitras}`, label: "mitra online sekarang" },
    { icon: Zap, value: `${stats.urgent}`, label: "pekerjaan butuh cepat" },
  ];

  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-gradient mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl animate-fade-in-up">
            Ambil Pekerjaan. Kerjakan. Dibayar.
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/75 md:text-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Ratusan pekerjaan serabutan tersedia setiap hari di kota Anda.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={handleDaftarMitra}
              className="gradient-cta w-full rounded-xl px-8 py-4 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 sm:w-auto flex items-center justify-center gap-2"
            >
              <Zap className="h-5 w-5" />
              Daftar Jadi Mitra
            </button>
            <button
              onClick={handleLogin}
              className="w-full rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/20 sm:w-auto"
            >
              {isAuthenticated ? "Dashboard" : "Login"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          {statItems.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm">
              <stat.icon className="mb-2 h-5 w-5 text-accent" />
              <span className="text-2xl font-extrabold text-primary-foreground md:text-3xl">{stat.value}</span>
              <span className="mt-1 text-center text-xs text-primary-foreground/60 md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;