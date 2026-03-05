import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const EditProfileMitra = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.currentPassword) e.currentPassword = "Kata sandi lama wajib diisi.";
    if (!form.newPassword) e.newPassword = "Kata sandi baru wajib diisi.";
    else if (form.newPassword.length < 6) e.newPassword = "Minimal 6 karakter.";
    if (!form.confirmPassword) e.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Kata sandi tidak cocok.";
    if (form.currentPassword && form.newPassword && form.currentPassword === form.newPassword)
      e.newPassword = "Kata sandi baru tidak boleh sama dengan yang lama.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setLoading(true);

    try {
      await api.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || "Gagal mengubah kata sandi. Coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border ${errors[field] ? "border-destructive" : "border-input"} bg-background px-3 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-textfield-decoration-container]:hidden`;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate("/mitra/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </button>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Ubah Kata Sandi</h1>
              <p className="text-xs text-muted-foreground">Akun: {user?.email}</p>
            </div>
          </div>

          {/* Info: email & no hp tidak bisa diubah */}
          <div className="rounded-xl bg-muted/60 border border-border px-4 py-3 mb-6">
            <p className="text-xs text-muted-foreground">
              Email dan nomor WhatsApp tidak dapat diubah. Hubungi admin jika perlu perubahan data akun.
            </p>
          </div>

          {/* Success state */}
          {success && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 mb-5 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-sm font-semibold text-green-700">Kata sandi berhasil diubah!</p>
            </div>
          )}

          {/* Error general */}
          {errors.general && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 mb-5 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Kata sandi lama */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Kata Sandi Lama
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="Masukkan kata sandi lama"
                  className={inputClass("currentPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.currentPassword}
                </p>
              )}
            </div>

            {/* Kata sandi baru */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className={inputClass("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.newPassword}
                </p>
              )}
            </div>

            {/* Konfirmasi kata sandi */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Ulangi kata sandi baru"
                  className={inputClass("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta rounded-xl px-4 py-2.5 text-sm font-bold text-accent-foreground shadow-sm disabled:opacity-60 transition mt-2"
            >
              {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileMitra;