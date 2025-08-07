const programmerService = require("../services/programmerService");

/**
 * @desc    Get all programmers
 * @route   GET /api/programmers
 * @access  Protected
 */
exports.getAllProgrammers = async (req, res, next) => {
  try {
    const programmers = await programmerService.getAllProgrammers();
    res.json(programmers);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single programmer
 * @route   GET /api/programmers/:id
 * @access  Protected
 */
exports.getProgrammerById = async (req, res, next) => {
  try {
    const programmer = await programmerService.getProgrammerById(req.params.id);
    if (!programmer) {
      res.status(404);
      throw new Error("Profil programmer tidak ditemukan");
    }
    res.json(programmer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a programmer profile
 * @route   POST /api/programmers
 * @access  Admin
 */
exports.createProgrammer = async (req, res, next) => {
  try {
    const programmer = await programmerService.createProgrammer(req.body);
    res.status(201).json(programmer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a programmer profile
 * @route   PUT /api/programmers/:id
 * @access  Admin
 */
exports.updateProgrammer = async (req, res, next) => {
  try {
    const programmer = await programmerService.updateProgrammer(req.params.id, req.body);
    if (!programmer) {
      res.status(404);
      throw new Error("Profil programmer tidak ditemukan");
    }
    res.json(programmer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a programmer profile
 * @route   DELETE /api/programmers/:id
 * @access  Admin
 */
exports.deleteProgrammer = async (req, res, next) => {
  try {
    const programmer = await programmerService.deleteProgrammer(req.params.id);
    if (!programmer) {
      res.status(404);
      throw new Error("Profil programmer tidak ditemukan");
    }
    res.json({ message: "Profil programmer berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
