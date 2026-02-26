const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const allowedRoles = ["customer", "mitra"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid." });
    }

    // Cek email duplikat
    const [existingEmail] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(409).json({ message: "Email sudah terdaftar, gunakan email lain." });
    }

    // Cek phone duplikat
    const [existingPhone] = await db.execute(
      "SELECT id FROM users WHERE phone = ?",
      [phone]
    );
    if (existingPhone.length > 0) {
      return res.status(409).json({ message: "Nomor WhatsApp sudah terdaftar, gunakan nomor lain." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "customer";

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, userRole]
    );

    const user = { id: result.insertId, name, email, phone, role: userRole };
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
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    const [rows] = await db.execute(
      "SELECT id, name, email, password, phone, role, is_active FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const dbUser = rows[0];

    if (!dbUser.is_active) {
      return res.status(403).json({ message: "Akun Anda dinonaktifkan. Hubungi admin." });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const user = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone,
      role: dbUser.role,
    };
    const token = generateToken(user);

    return res.json({ message: "Login berhasil.", token, user });
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
    if (rows.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

module.exports = { register, login, me };