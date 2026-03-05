import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (status === "loading" || status === "success") return;

    // Validasi frontend
    if (!email.trim()) {
      setErrorMsg("Email wajib diisi.");
      setStatus("error");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Format email tidak valid.");
      setStatus("error");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Kata sandi wajib diisi.");
      setStatus("error");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const user = await login(email, password);
      setStatus("success");
      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "mitra") navigate("/mitra/dashboard");
        else navigate("/customer/dashboard");
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      let errText = "Email atau kata sandi salah. Silakan periksa kembali.";
      if (msg.toLowerCase().includes("kata sandi") || msg.toLowerCase().includes("password")) {
        errText = "Kata sandi yang kamu masukkan salah.";
      } else if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("tidak ditemukan")) {
        errText = "Email tidak terdaftar. Pastikan email sudah benar.";
      } else if (msg.toLowerCase().includes("dinonaktifkan")) {
        errText = "Akun kamu telah dinonaktifkan. Hubungi admin.";
      }
      setErrorMsg(errText);
      setStatus("error");
    }
  };

  const isError = status === "error";
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">
            sayabantu<span className="text-accent">.com</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Masuk ke akun Anda</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8 space-y-5">

          {/* Banner sukses */}
          {isSuccess && (
            <div className="flex items-start gap-3 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3.5">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-700">Login Berhasil!</p>
                <p className="text-xs text-green-600/80 mt-0.5">Mengarahkan ke dashboard kamu...</p>
              </div>
            </div>
          )}

          {/* Banner error */}
          {isError && errorMsg && (
            <div className="flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3.5">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-destructive">Login Gagal</p>
                <p className="text-xs text-destructive/80 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Field email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled={isLoading || isSuccess}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") { setStatus("idle"); setErrorMsg(""); }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="email@contoh.com"
              className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-60 ${isError ? "border-destructive" : "border-input"}`}
            />
          </div>

          {/* Field password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={isLoading || isSuccess}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (status === "error") { setStatus("idle"); setErrorMsg(""); }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-60 [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${isError ? "border-destructive" : "border-input"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Tombol masuk */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading || isSuccess}
            className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm transition disabled:opacity-70 ${
              isSuccess ? "bg-green-500 text-white" : "gradient-cta text-accent-foreground"
            }`}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading && "Memeriksa..."}
            {isSuccess && "✓ Berhasil Masuk"}
            {!isLoading && !isSuccess && "Masuk"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;