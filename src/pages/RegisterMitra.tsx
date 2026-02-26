import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { User, Phone, Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";

const RegisterMitra = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi.";
    if (!form.phone.trim()) {
      newErrors.phone = "Nomor WhatsApp wajib diisi.";
    } else if (!/^08\d{8,12}$/.test(form.phone)) {
      newErrors.phone = "Format nomor tidak valid. Contoh: 08123456789";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!form.password) {
      newErrors.password = "Password wajib diisi.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await register({ ...form, role: "mitra" });
      navigate("/mitra/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registrasi gagal. Coba lagi.";
      if (msg.toLowerCase().includes("email")) {
        setErrors({ email: msg });
      } else if (msg.toLowerCase().includes("whatsapp") || msg.toLowerCase().includes("nomor")) {
        setErrors({ phone: msg });
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border ${
      errors[field] ? "border-destructive" : "border-input"
    } bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">
            sayabantu<span className="text-accent">.com</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Daftar sebagai Mitra</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama kamu"
                  className={inputClass("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className={inputClass("phone")}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@contoh.com"
                  className={inputClass("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 karakter"
                  className={inputClass("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </p>
              )}
            </div>

            {errors.general && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta rounded-lg px-4 py-2.5 text-sm font-bold text-accent-foreground shadow-sm disabled:opacity-60 transition mt-2"
            >
              {loading ? "Mendaftarkan..." : "Daftar Sebagai Mitra"}
            </button>
          </form>

          {/* Link balik ke customer */}
          <div className="mt-5 rounded-xl border border-border bg-muted/40 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">Butuh bantuan?</p>
              <p className="text-xs text-muted-foreground">Daftar sebagai customer</p>
            </div>
            <Link to="/register" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0 ml-3">
              <ArrowLeft className="h-3 w-3" /> Daftar Customer
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterMitra;