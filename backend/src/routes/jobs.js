const express = require("express");
const router = express.Router();
const { createJob, getOpenJobs, getMyJobs, getMyMitraJobs, takeJob, getStats } = require("../controllers/jobController");
const { authenticate, authorize } = require("../middleware/auth");

// Public
router.get("/stats", getStats);

// Customer
router.post("/", authenticate, authorize("customer"), createJob);
router.get("/my", authenticate, authorize("customer"), getMyJobs);

// Mitra
router.get("/mitra/my", authenticate, authorize("mitra"), getMyMitraJobs);
router.get("/", authenticate, authorize("mitra", "admin"), getOpenJobs);
router.put("/:id/take", authenticate, authorize("mitra"), takeJob);

module.exports = router;