const express = require("express");
const router = express.Router();
const { getAllJobs, getJobById, createJob, updateJob, deleteJob, updateJobStatus } = require("../controllers/jobsController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Semua rute di bawah ini dilindungi dan memerlukan login
router.use(protect);

router
  .route("/")
  .get(getAllJobs) // Semua role yang login bisa melihat, logika filter ada di service
  .post(authorize("Admin", "Manajer Proyek"), createJob); // Hanya Admin dan Manajer

router.route("/:id").get(getJobById).put(authorize("Admin", "Manajer Proyek"), updateJob).delete(authorize("Admin", "Manajer Proyek"), deleteJob);

// Rute baru untuk mengubah status pekerjaan
router.route("/:id/status").patch(updateJobStatus); // `protect` sudah diterapkan di atas

module.exports = router;
