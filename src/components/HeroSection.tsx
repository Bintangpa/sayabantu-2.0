import { Briefcase, Users, Zap } from "lucide-react";

const stats = [
  { icon: Briefcase, value: "125+", label: "pekerjaan tersedia hari ini" },
  { icon: Users, value: "87", label: "mitra online sekarang" },
  { icon: Zap, value: "24", label: "pekerjaan butuh cepat" },
];

const HeroSection = () => {
  return (
    <section className="gradient-hero relative overflow-hidden">
      {/* Decorative circles */}
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
            <button className="gradient-cta w-full rounded-xl px-8 py-4 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 sm:w-auto">
              🚀 Daftar Jadi Mitra
            </button>
            <button className="w-full rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/20 sm:w-auto">
              Login
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
          {stats.map((stat) => (
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
