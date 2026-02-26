import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Region {
  id: string;
  name: string;
}

const CATEGORIES = ["Antar Barang", "Belanja", "Bersih-bersih", "Perbaikan", "Jasa Titip", "Lainnya"];

const PostJob = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    is_urgent: false,
  });

  // Wilayah
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

  // Load provinces
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((r) => r.json())
      .then((data) => setProvinces(data))
      .catch(() => {});
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (!selectedProvince) { setCities([]); setSelectedCity(""); setDistricts([]); setSelectedDistrict(""); return; }
    setLoadingCity(true);
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince}.json`)
      .then((r) => r.json())
      .then((data) => { setCities(data); setSelectedCity(""); setDistricts([]); setSelectedDistrict(""); })
      .catch(() => {})
      .finally(() => setLoadingCity(false));
  }, [selectedProvince]);

  // Load districts when city changes
  useEffect(() => {
    if (!selectedCity) { setDistricts([]); setSelectedDistrict(""); return; }
    setLoadingDistrict(true);
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedCity}.json`)
      .then((r) => r.json())
      .then((data) => { setDistricts(data); setSelectedDistrict(""); })
      .catch(() => {})
      .finally(() => setLoadingDistrict(false));
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
      await api.post("/jobs", {
        ...form,
        price: Number(form.price),
        province: provinceName,
        city: cityName,
        district: districtName,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 2000);
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || "Gagal posting pekerjaan. Coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border ${errors[field] ? "border-destructive" : "border-input"} bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition`;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-lg font-bold text-foreground">Pekerjaan Berhasil Diposting!</p>
        <p className="text-sm text-muted-foreground mt-1">Mengarahkan ke dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-card border border-border rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Judul */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Judul Pekerjaan</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Ambilkan paket di Alfamart Jl. Merdeka"
              className={inputClass("title")}
            />
            {errors.title && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.title}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Deskripsi</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan detail pekerjaan yang kamu butuhkan..."
              className={`${inputClass("description")} resize-none`}
            />
            {errors.description && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.description}</p>}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Kategori</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass("category")}>
              <option value="">Pilih kategori</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.category}</p>}
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Provinsi</label>
            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className={inputClass("province")}>
              <option value="">Pilih provinsi</option>
              {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.province && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.province}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Kabupaten / Kota</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedProvince || loadingCity}
              className={inputClass("city")}
            >
              <option value="">{loadingCity ? "Memuat..." : "Pilih kabupaten/kota"}</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.city && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Kecamatan</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedCity || loadingDistrict}
              className={inputClass("district")}
            >
              <option value="">{loadingDistrict ? "Memuat..." : "Pilih kecamatan"}</option>
              {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            {errors.district && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.district}</p>}
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Harga yang Ditawarkan (Rp)</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Contoh: 50000"
              className={inputClass("price")}
            />
            {errors.price && <p className="mt-1 flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.price}</p>}
          </div>

          {/* Urgent */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="urgent"
              checked={form.is_urgent}
              onChange={(e) => setForm({ ...form, is_urgent: e.target.checked })}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <label htmlFor="urgent" className="text-sm font-medium text-foreground">
              Tandai sebagai <span className="text-destructive font-semibold">Mendesak</span>
            </label>
          </div>

          {errors.general && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-cta rounded-lg px-4 py-2.5 text-sm font-bold text-accent-foreground shadow-sm disabled:opacity-60 transition"
          >
            {loading ? "Memposting..." : "Post Pekerjaan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;