const userService = require("../services/userService");

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    // req.user.id didapat dari middleware 'protect'
    const userProfile = await userService.getProfileData(req.user.id);
    res.json(userProfile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const updatedProfile = await userService.updateProfileData(req.user.id, req.body);
    res.json({
      message: "Profil berhasil diperbarui",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};
