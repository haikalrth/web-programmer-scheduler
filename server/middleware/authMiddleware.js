const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware untuk melindungi rute yang memerlukan autentikasi
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari token (tanpa password) dan lampirkan ke request
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Tidak terautentikasi, token gagal" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Tidak terautentikasi, tidak ada token" });
  }
};

// Middleware untuk otorisasi berdasarkan peran
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Peran '${req.user.role}' tidak diizinkan untuk mengakses sumber daya ini` });
    }
    next();
  };
};

module.exports = { protect, authorize };
