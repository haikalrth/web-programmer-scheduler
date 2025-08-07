const Job = require("../models/Job");
const Programmer = require("../models/Programmer");

/**
 * @desc    Get all jobs based on user role
 * @param {object} user - The authenticated user object
 * @returns {Promise<Job[]>}
 */
exports.getAllJobs = async (user) => {
  let query = {};

  // If the user is a Programmer, only show jobs assigned to them
  if (user.role === "Programmer") {
    const programmerProfile = await Programmer.findOne({ user: user._id });
    // If programmer profile exists, filter by their profile ID
    query = { programmer: programmerProfile ? programmerProfile._id : null };
  }

  return Job.find(query).populate({
    path: "programmer",
    select: "user",
    populate: {
      path: "user",
      select: "name",
    },
  });
};

/**
 * @desc    Get a single job by ID
 * @param {string} id - Job ID
 * @returns {Promise<Job>}
 */
exports.getJobById = async (id) => {
  return Job.findById(id).populate("programmer", "user");
};

/**
 * @desc    Create a new job
 * @param {object} data - Job data from request body
 * @returns {Promise<Job>}
 */
exports.createJob = async (data) => {
  const job = new Job(data);
  return job.save();
};

/**
 * @desc    Update a job
 * @param {string} id - Job ID
 * @param {object} data - Data for update
 * @returns {Promise<Job>}
 */
exports.updateJob = async (id, data) => {
  return Job.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * @desc    Delete a job
 * @param {string} id - Job ID
 * @returns {Promise<Job>}
 */
exports.deleteJob = async (id) => {
  return Job.findByIdAndDelete(id);
};
