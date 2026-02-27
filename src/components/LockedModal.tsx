import { X, Shield, Bell, Star, CreditCard, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/data/jobs";

interface LockedModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const benefits = [
  { icon: Star, text: "Bisa ambil pekerjaan tanpa batas" },
  { icon: Bell, text: "Notifikasi pekerjaan baru" },
  { icon: Shield, text: "Akses pekerjaan prioritas" },
  { icon: CreditCard, text: "Sistem pembayaran aman" },
];

const LockedModal = ({ job, isOpen, onClose }: LockedModalProps) => {
  const navigate = useNavigate();

  if (!isOpen || !job) return null;

  const handleDaftar = () => {
    onClose();
    navigate("/register/mitra");
  };

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-md rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Detail Pekerjaan Dikunci</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Untuk melihat alamat lengkap, nomor kontak, dan mengambil pekerjaan ini, silakan daftar sebagai mitra.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-5 space-y-2.5">
          {benefits.map((b) => (
            <div key={b.text} className="flex items-center gap-3 rounded-xl bg-accent/8 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                <b.icon className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm font-medium text-foreground">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Urgency */}
        {job.applicantCount > 0 && (
          <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-urgent/8 p-3">
            <Users className="h-4 w-4 text-urgent" />
            <span className="text-sm font-semibold text-urgent">
              {job.applicantCount} mitra lain sudah mengajukan pekerjaan ini
            </span>
          </div>
        )}

        <button
          onClick={handleDaftar}
          className="gradient-cta mb-3 w-full rounded-xl py-4 text-base font-bold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          Daftar Sekarang
        </button>
        <button
          onClick={handleLogin}
          className="w-full text-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Login jika sudah punya akun
        </button>
      </div>
    </div>
  );
};

export default LockedModal;