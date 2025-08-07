const Standby = require("../models/Standby");
const Programmer = require("../models/Programmer");

/**
 * @desc    Get all standby schedules
 * @param {object} user - The authenticated user object
 * @returns {Promise<Standby[]>}
 */
exports.getAllStandbySchedules = async (user) => {
  let query = {};

  // If the user is a Programmer, only show their own standby schedule
  if (user.role === "Programmer") {
    const programmerProfile = await Programmer.findOne({ user: user._id });
    query = { programmer: programmerProfile ? programmerProfile._id : null };
  }

  return Standby.find(query).populate({
    path: "programmer",
    select: "user",
    populate: {
      path: "user",
      select: "name",
    },
  });
};

/**
 * @desc    Create a new standby schedule
 * @param {object} data - Standby data from request body
 * @returns {Promise<Standby>}
 */
exports.createStandbySchedule = async (data) => {
  const standby = new Standby(data);
  return standby.save();
};

/**
 * @desc    Delete a standby schedule
 * @param {string} id - Standby ID
 * @returns {Promise<Standby>}
 */
exports.deleteStandbySchedule = async (id) => {
  return Standby.findByIdAndDelete(id);
};
