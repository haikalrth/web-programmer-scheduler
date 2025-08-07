const express = require("express");
const router = express.Router();
const { getStandbySchedules, createStandbySchedule, deleteStandbySchedule } = require("../controllers/standbyController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Semua rute di bawah ini dilindungi dan memerlukan login
router.use(protect);

router.route("/").get(getStandbySchedules).post(authorize("Admin", "Manajer Proyek"), createStandbySchedule);

router.route("/:id").delete(authorize("Admin", "Manajer Proyek"), deleteStandbySchedule);

module.exports = router;
