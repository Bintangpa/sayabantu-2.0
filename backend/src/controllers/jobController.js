const db = require("../database/db");

// POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, description, category, province, city, district, price, is_urgent } = req.body;
    const customer_id = req.user.id;

    if (!title || !description || !category || !province || !city || !district || !price) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const location = `${district}, ${city}, ${province}`;

    const [result] = await db.execute(
      `INSERT INTO jobs (customer_id, title, description, category, location, price, is_urgent, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'open')`,
      [customer_id, title, description, category, location, price, is_urgent ? 1 : 0]
    );

    return res.status(201).json({ message: "Pekerjaan berhasil diposting.", jobId: result.insertId });
  } catch (err) {
    console.error("Create job error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// GET /api/jobs — semua job open (untuk mitra)
const getOpenJobs = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT j.*, u.name as customer_name, u.phone as customer_phone
       FROM jobs j
       JOIN users u ON j.customer_id = u.id
       WHERE j.status = 'open'
       ORDER BY j.is_urgent DESC, j.created_at DESC`
    );
    return res.json({ jobs: rows });
  } catch (err) {
    console.error("Get jobs error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// GET /api/jobs/my — job milik customer
const getMyJobs = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT j.*, u.name as mitra_name, u.phone as mitra_phone
       FROM jobs j
       LEFT JOIN users u ON j.taken_by = u.id
       WHERE j.customer_id = ?
       ORDER BY j.created_at DESC`,
      [req.user.id]
    );
    return res.json({ jobs: rows });
  } catch (err) {
    console.error("Get my jobs error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// PUT /api/jobs/:id/take — mitra ambil pekerjaan
const takeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const mitra_id = req.user.id;

    const [existing] = await db.execute(
      "SELECT * FROM jobs WHERE id = ? AND status = 'open'",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Pekerjaan tidak ditemukan atau sudah diambil." });
    }

    await db.execute(
      "UPDATE jobs SET status = 'taken', taken_by = ? WHERE id = ?",
      [mitra_id, id]
    );

    return res.json({ message: "Pekerjaan berhasil diambil." });
  } catch (err) {
    console.error("Take job error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// GET /api/jobs/stats — statistik untuk hero section (public)
const getStats = async (req, res) => {
  try {
    const [[{ total }]] = await db.execute("SELECT COUNT(*) as total FROM jobs WHERE status = 'open'");
    const [[{ urgent }]] = await db.execute("SELECT COUNT(*) as urgent FROM jobs WHERE status = 'open' AND is_urgent = 1");
    const [[{ mitras }]] = await db.execute("SELECT COUNT(*) as mitras FROM users WHERE role = 'mitra' AND is_active = 1");
    return res.json({ total, urgent, mitras });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { createJob, getOpenJobs, getMyJobs, takeJob, getStats };