const Programmer = require("../models/Programmer");
const Job = require("../models/Job");
const Standby = require("../models/Standby");

/**
 * @desc    Mendapatkan semua data programmer
 * @returns {Promise<Programmer[]>}
 */
exports.getAllProgrammers = async () => {
  return Programmer.find().populate("user", "name email");
};

/**
 * @desc    Mendapatkan satu programmer berdasarkan ID
 * @param {string} id - ID Programmer
 * @returns {Promise<Programmer>}
 */
exports.getProgrammerById = async (id) => {
  return Programmer.findById(id).populate("user", "name email");
};

/**
 * @desc    Membuat profil programmer baru
 * @param {object} data - Data programmer dari request body
 * @returns {Promise<Programmer>}
 */
exports.createProgrammer = async (data) => {
  // Cek apakah user sudah punya profil programmer
  const existingProfile = await Programmer.findOne({ user: data.user });
  if (existingProfile) {
    const error = new Error("User ini sudah memiliki profil programmer.");
    error.statusCode = 400;
    throw error;
  }
  const programmer = new Programmer(data);
  return programmer.save();
};

/**
 * @desc    Mengupdate profil programmer
 * @param {string} id - ID Programmer
 * @param {object} data - Data untuk update
 * @returns {Promise<Programmer>}
 */
exports.updateProgrammer = async (id, data) => {
  return Programmer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * @desc    Menghapus profil programmer
 * @param {string} id - ID Programmer
 * @returns {Promise<Programmer>}
 */
exports.deleteProgrammer = async (id) => {
  // Cek apakah programmer masih terikat pada Job atau Standby
  const jobCount = await Job.countDocuments({ programmer: id });
  const standbyCount = await Standby.countDocuments({ programmer: id });

  if (jobCount > 0 || standbyCount > 0) {
    const error = new Error("Gagal menghapus. Programmer masih terikat pada Pekerjaan atau Jadwal Standby.");
    error.statusCode = 400;
    throw error;
  }

  return Programmer.findByIdAndDelete(id);
};
