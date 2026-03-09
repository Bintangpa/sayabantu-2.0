import { useState, useEffect } from "react";
import api from "@/lib/api";
import { AlertCircle, CheckCircle2, Briefcase, MapPin, Tag, DollarSign, FileText, Zap } from "lucide-react";

interface Region { id: string; name: string; }
interface PostJobProps { onSuccess?: () => void; }

const CATEGORIES = ["Antar Barang", "Belanja", "Bersih-bersih", "Perbaikan", "Jasa Titip", "Lainnya"];

const PostJob = ({ onSuccess }: PostJobProps) => {
  const [form, setForm] = useState({ title: "", description: "", category: "", price: "", is_urgent: false });
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((r) => r.json()).then(setProvinces).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProvince) { setCities([]); setSelectedCity(""); setDistricts([]); setSelectedDistrict(""); return; }
    setLoadingCity(true);
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`)
      .then((r) => r.json()).then((data) => { setCities(data); setSelectedCity(""); setDistricts([]); setSelectedDistrict(""); })
      .catch(() => {}).finally(() => setLoadingCity(false));
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedCity) { setDistricts([]); setSelectedDistrict(""); return; }
    setLoadingDistrict(true);
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCity}.json`)
      .then((r) => r.json()).then((data) => { setDistricts(data); setSelectedDistrict(""); })
      .catch(() => {}).finally(() => setLoadingDistrict(false));
  }, [selectedCity]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Judul wajib diisi.";
    if (!form.description.trim()) e.description = "Deskripsi wajib diisi.";
    if (!form.category) e.category = "Kategori wajib dipilih.";
    if (!selectedProvince) e.province = "Provinsi wajib dipilih.";
    if (!selectedCity) e.city = "Kabupaten/Kota wajib dipilih.";
    if (!selectedDistrict) e.district = "Kecamatan wajib dipilih.";
    if (!form.price || Number(form.price) <= 0) e.price = "Harga wajib diisi dan lebih dari 0.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setLoading(true);
    const provinceName = provinces.find((p) => p.id === selectedProvince)?.name || "";
    const cityName = cities.find((c) => c.id === selectedCity)?.name || "";
    const districtName = districts.find((d) => d.id === selectedDistrict)?.name || "";
    try {
      await api.post("/jobs", { ...form, price: Number(form.price), province: provinceName, city: cityName, district: districtName });
      setSuccess(true);
      setTimeout(() => { onSuccess?.(); }, 1500);
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || "Gagal posting pekerjaan. Coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border ${errors[field] ? "border-destructive" : "border-input"} bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition`;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <p className="text-xl font-bold text-foreground">Pekerjaan Berhasil Diposting!</p>
        <p className="text-sm text-muted-foreground mt-2">Mengarahkan ke Pekerjaan Saya...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Post Pekerjaan Baru</h2>
        <p className="text-sm text-muted-foreground mt-1">Isi detail pekerjaan yang kamu butuhkan, mitra siap membantu.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Kolom kiri — info utama */}
          <div className="lg:col-span-2 space-y-5">

            {/* Judul & Kategori */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-foreground">Informasi Pekerjaan</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Judul Pekerjaan</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Ambilkan paket di Alfamart Jl. Merdeka"
                  className={inputClass("title")}
                />
                {errors.title && <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Deskripsi</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Jelaskan detail pekerjaan yang kamu butuhkan, termasuk waktu, lokasi spesifik, dan kebutuhan khusus lainnya..."
                  className={`${inputClass("description")} resize-none`}
                />
                {errors.description && <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Kategori</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, category: c })}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        form.category === c
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "border-input text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.category && <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.category}</p>}
              </div>
            </div>

            {/* Lokasi */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-foreground">Lokasi Pekerjaan</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Provinsi</label>
                  <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className={inputClass("province")}>
                    <option value="">Pilih provinsi</option>
                    {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {errors.province && <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.province}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Kabupaten / Kota</label>
                  <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedProvince || loadingCity} className={inputClass("city")}>
                    <option value="">{loadingCity ? "Memuat..." : "Pilih kota"}</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.city && <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Kecamatan</label>
                  <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedCity || loadingDistrict} className={inputClass("district")}>
                    <option value="">{loadingDistrict ? "Memuat..." : "Pilih kecamatan"}</option>
                    {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  {errors.district && <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.district}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom kanan — harga & submit */}
          <div className="space-y-5">

            {/* Harga */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <p className="text-sm font-bold text-foreground">Penawaran Harga</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Harga (Rp)</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Contoh: 50000"
                  className={inputClass("price")}
                />
                {form.price && Number(form.price) > 0 && (
                  <p className="mt-1.5 text-xs font-semibold text-primary">
                    Rp {Number(form.price).toLocaleString("id-ID")}
                  </p>
                )}
                {errors.price && <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.price}</p>}
              </div>
            </div>

            {/* Urgent */}
            <div className={`bg-card border rounded-2xl p-5 cursor-pointer transition-all ${form.is_urgent ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-destructive/30"}`}
              onClick={() => setForm({ ...form, is_urgent: !form.is_urgent })}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${form.is_urgent ? "bg-destructive border-destructive" : "border-input"}`}>
                  {form.is_urgent && <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-destructive" />
                    <p className="text-sm font-bold text-destructive">Tandai Mendesak</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Pekerjaan akan diprioritaskan dan lebih cepat ditemukan mitra.</p>
                </div>
              </div>
            </div>

            {/* Preview ringkas */}
            {(form.title || form.category || form.price) && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-primary mb-2">Preview</p>
                {form.title && <p className="text-sm font-semibold text-foreground line-clamp-2">{form.title}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {form.category && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{form.category}</span>}
                  {form.is_urgent && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">Mendesak</span>}
                </div>
                {form.price && Number(form.price) > 0 && (
                  <p className="text-base font-extrabold text-primary">Rp {Number(form.price).toLocaleString("id-ID")}</p>
                )}
              </div>
            )}

            {/* Error general */}
            {errors.general && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {errors.general}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-cta rounded-xl px-4 py-3 text-sm font-bold text-accent-foreground shadow-sm disabled:opacity-60 transition flex items-center justify-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              {loading ? "Memposting..." : "Post Pekerjaan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJob;