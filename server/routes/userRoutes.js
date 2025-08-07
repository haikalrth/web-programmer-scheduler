const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Rute untuk mendapatkan dan mengupdate profil user yang sedang login
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
