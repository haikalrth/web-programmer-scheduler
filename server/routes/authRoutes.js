const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Rute untuk registrasi user baru
router.post("/register", registerUser);

// Rute untuk login user
router.post("/login", loginUser);

module.exports = router;
