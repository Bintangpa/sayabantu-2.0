-- ============================================
-- SayaBantu Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS sayabantu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sayabantu;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  role        ENUM('admin', 'mitra', 'customer') NOT NULL DEFAULT 'customer',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin (password: admin123 — ganti setelah deploy!)
INSERT INTO users (name, email, password, role)
VALUES ('Admin SayaBantu', 'admin@sayabantu.com', '$2a$10$rJ9cGqM3Y1kL5vN8pXwUuO2fZsT4hA6yBdKmIqE7nW0jC3xVoP1S2', 'admin');
-- Hash di atas = bcrypt('admin123', 10) — GANTI password ini setelah pertama login!