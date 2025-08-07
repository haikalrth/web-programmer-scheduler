const User = require("../models/User");
const generateToken = require("../utils/jwtUtils");

/**
 * @desc    Mendaftarkan user baru
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { name, npm, jurusan, username, password, role } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error("User dengan username ini sudah terdaftar");
    }

    const user = await User.create({
      name,
      npm,
      jurusan,
      username,
      password,
      role,
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          npm: user.npm,
          jurusan: user.jurusan,
          username: user.username,
          role: user.role,
          status: user.status,
        },
        token: token,
      });
    } else {
      res.status(400);
      throw new Error("Data user tidak valid");
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & mendapatkan token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const user = await User.findOne({ username }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          npm: user.npm,
          jurusan: user.jurusan,
          username: user.username,
          role: user.role,
          status: user.status,
        },
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      throw new Error("Username atau password salah");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
