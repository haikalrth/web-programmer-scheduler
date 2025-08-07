const User = require("../models/User");
const Programmer = require("../models/Programmer");

/**
 * @desc    Get combined profile data for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<object>}
 */
exports.getProfileData = async (userId) => {
  // Ambil data user dan populate data programmer terkait dalam satu query
  const user = await User.findById(userId).lean(); // .lean() untuk hasil plain object
  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  const programmer = await Programmer.findOne({ user: userId }).lean();

  // Gabungkan data
  // Hapus password dari objek user sebelum digabungkan
  delete user.password;

  return {
    ...user, // Data dari model User (name, email, role)
    ...programmer, // Data dari model Programmer (nim, jurusan, skill, status)
  };
};

/**
 * @desc    Update profile data for a user in both User and Programmer collections
 * @param {string} userId - The ID of the user
 * @param {object} data - The data to update
 * @returns {Promise<object>}
 */
exports.updateProfileData = async (userId, data) => {
  // Pisahkan data untuk User dan Programmer
  const { name, email, password, ...programmerData } = data;

  // Update data User
  const userUpdateData = {};
  if (name) userUpdateData.name = name;
  if (email) userUpdateData.email = email;
  // Password hanya di-hash ulang jika ada di data
  if (password) {
    const user = await User.findById(userId);
    user.password = password; // Setter di schema akan menangani hashing
    await user.save();
  } else if (name || email) {
    await User.findByIdAndUpdate(userId, { $set: userUpdateData }, { new: true, runValidators: true });
  }

  // Update data Programmer jika ada
  if (Object.keys(programmerData).length > 0) {
    await Programmer.findOneAndUpdate({ user: userId }, { $set: programmerData }, { new: true, runValidators: true, upsert: true }); // upsert: true akan membuat profil programmer jika belum ada
  }

  // Ambil data gabungan yang sudah diperbarui untuk dikembalikan
  const updatedProfile = await this.getProfileData(userId);
  return updatedProfile;
};
