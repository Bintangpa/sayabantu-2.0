const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const [existingEmail] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    const [existingPhone] = await db.execute("SELECT id FROM users WHERE phone = ?", [phone]);
    if (existingPhone.length > 0) {
      return res.status(409).json({ message: "Nomor WhatsApp sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, role]
    );

    const user = { id: result.insertId, name, email, phone, role };
    const token = generateToken(user);

    return res.status(201).json({ message: "Registrasi berhasil.", token, user });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan kata sandi wajib diisi." });
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email atau kata sandi salah." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau kata sandi salah." });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Akun Anda telah dinonaktifkan. Hubungi admin." });
    }

    const token = generateToken(user);
    const userData = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };

    return res.json({ message: "Login berhasil.", token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, phone, role FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Kata sandi lama dan baru wajib diisi." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Kata sandi baru minimal 6 karakter." });
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Kata sandi lama tidak sesuai." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "Kata sandi baru tidak boleh sama dengan yang lama." });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedNew, req.user.id]);

    return res.json({ message: "Kata sandi berhasil diubah." });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { register, login, me, changePassword };