import { CheckCircle, DollarSign, Zap, Shield, TrendingUp, Clock } from "lucide-react";

const reasons = [
  { icon: Zap, title: "Mulai Cepat", desc: "Daftar 2 menit, langsung bisa ambil pekerjaan." },
  { icon: DollarSign, title: "Bayaran Transparan", desc: "Lihat budget sebelum ambil. Tanpa potongan tersembunyi." },
  { icon: Shield, title: "Pembayaran Aman", desc: "Dana ditahan sistem, dicairkan setelah selesai." },
  { icon: TrendingUp, title: "Banyak Peluang", desc: "Ratusan pekerjaan baru setiap hari di kota Anda." },
  { icon: Clock, title: "Jadwal Fleksibel", desc: "Kerja kapan saja. Anda yang atur sendiri." },
  { icon: CheckCircle, title: "Rating & Reputasi", desc: "Semakin bagus rating, semakin banyak job premium." },
];

const testimonials = [
  { name: "Andi", city: "Bekasi", text: "Dalam 1 minggu saya sudah dapat 5 proyek. Bayarannya jelas dan cepat cair." },
  { name: "Sari", city: "Jakarta Selatan", text: "Daftar pagi, sore sudah dapat pekerjaan pertama. Gak ribet!" },
  { name: "Budi", city: "Tangerang", text: "Setiap hari ada pekerjaan baru. Penghasilan tambahan yang konsisten." },
];

const WhyJoinSection = () => {
  return (
    <>
      {/* Why Join */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="mb-2 text-center text-2xl font-extrabold text-foreground md:text-3xl">
            Kenapa Gabung Jadi Mitra?
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-muted-foreground">
            Bergabung dengan ribuan mitra yang sudah merasakan manfaatnya.
          </p>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title} className="glass-card rounded-2xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <r.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-1 text-sm font-bold text-foreground">{r.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-2xl font-extrabold text-foreground md:text-3xl">
            Apa Kata Mitra Kami?
          </h2>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-5">
                <p className="mb-4 text-sm italic leading-relaxed text-foreground">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">Mitra {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="gradient-hero py-16">
        <div className="container text-center">
          <h2 className="text-gradient mb-3 text-2xl font-extrabold md:text-3xl">
            Siap Mulai Dapat Penghasilan?
          </h2>
          <p className="mb-6 text-sm text-primary-foreground/70">
            Daftar sekarang dan ambil pekerjaan pertama Anda hari ini.
          </p>
          <button className="gradient-cta rounded-xl px-10 py-4 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-all hover:shadow-xl hover:-translate-y-0.5">
            🚀 Daftar Jadi Mitra Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container text-center">
          <p className="text-lg font-bold text-foreground">sayabantu.com</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Marketplace jasa serabutan terpercaya di Indonesia.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">© 2026 SayaBantu. Semua hak dilindungi.</p>
        </div>
      </footer>
    </>
  );
};

export default WhyJoinSection;
