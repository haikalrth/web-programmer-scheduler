const standbyService = require("../services/standbyService");

/**
 * @desc    Get all standby schedules
 * @route   GET /api/standby
 * @access  Protected
 */
exports.getStandbySchedules = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const schedules = await standbyService.getStandbySchedules(startDate, endDate);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a standby schedule
 * @route   POST /api/standby
 * @access  Admin, Manajer Proyek
 */
exports.createStandbySchedule = async (req, res, next) => {
  try {
    const schedule = await standbyService.createStandbySchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a standby schedule
 * @route   DELETE /api/standby/:id
 * @access  Admin, Manajer Proyek
 */
exports.deleteStandbySchedule = async (req, res, next) => {
  try {
    const schedule = await standbyService.deleteStandbySchedule(req.params.id);
    if (!schedule) {
      res.status(404);
      throw new Error("Jadwal standby tidak ditemukan");
    }
    res.json({ message: "Jadwal standby berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
