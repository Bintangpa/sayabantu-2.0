const express = require("express");
const router = express.Router();
const { createJob, getOpenJobs, getMyJobs, takeJob } = require("../controllers/jobController");
const { authenticate, authorize } = require("../middleware/auth");

// Customer post pekerjaan
router.post("/", authenticate, authorize("customer"), createJob);

// Mitra lihat semua pekerjaan open
router.get("/", authenticate, authorize("mitra", "admin"), getOpenJobs);

// Customer lihat pekerjaan miliknya
router.get("/my", authenticate, authorize("customer"), getMyJobs);

// Mitra ambil pekerjaan
router.put("/:id/take", authenticate, authorize("mitra"), takeJob);

module.exports = router;