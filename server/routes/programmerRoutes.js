const express = require("express");
const router = express.Router();
const { getAllProgrammers, getProgrammerById, createProgrammer, updateProgrammer, deleteProgrammer } = require("../controllers/programmersController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Semua rute di bawah ini dilindungi dan memerlukan login
router.use(protect);

router.route("/").get(authorize("Admin"), getAllProgrammers).post(authorize("Admin"), createProgrammer);

router
  .route("/:id")
  .get(authorize("Admin"), getProgrammerById)
  .put(authorize("Admin"), updateProgrammer) // Hanya Admin yang bisa update
  .delete(authorize("Admin"), deleteProgrammer); // Hanya Admin yang bisa hapus

module.exports = router;
