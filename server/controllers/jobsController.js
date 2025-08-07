const Job = require("../models/Job");
const Programmer = require("../models/Programmer");
const asyncHandler = require("express-async-handler");

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Protected
const getAllJobs = asyncHandler(async (req, res) => {
  let query = {};

  // If the user is a Programmer, only show jobs assigned to them
  if (req.user.role === "Programmer") {
    // Find the programmer profile linked to the user ID
    const programmerProfile = await Programmer.findOne({ user: req.user._id });
    // If a programmer profile exists, filter jobs by their ID
    // If not, they see no jobs.
    query = { programmer: programmerProfile ? programmerProfile._id : null };
  }
  // Admins and Project Managers can see all jobs, so the query object remains empty

  const jobs = await Job.find(query).populate({
    path: "programmer",
    select: "name", // Populate the programmer's name
  });

  res.status(200).json(jobs);
});

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Protected
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("programmer", "name");

  if (!job) {
    res.status(404);
    throw new Error("Pekerjaan tidak ditemukan");
  }

  // Optional: Add RBAC here if programmers should only see their own jobs' details
  if (
    req.user.role === "Programmer" &&
    (!job.programmer || job.programmer._id.toString() !== req.user.programmerId) // Assuming programmerId is on req.user
  ) {
    res.status(403);
    throw new Error("Tidak diizinkan untuk mengakses pekerjaan ini");
  }

  res.status(200).json(job);
});

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Admin, Manajer Proyek
const createJob = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, programmer } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Harap isi semua bidang yang wajib diisi");
  }

  const job = await Job.create({
    title,
    description,
    priority,
    dueDate,
    programmer, // Can be null initially
  });

  res.status(201).json(job);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Admin, Manajer Proyek
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Pekerjaan tidak ditemukan");
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedJob);
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Admin, Manajer Proyek
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Pekerjaan tidak ditemukan");
  }

  await job.remove();

  res.status(200).json({ message: "Pekerjaan berhasil dihapus" });
});

// @desc    Update job status
// @route   PATCH /api/jobs/:id/status
// @access  Protected
const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    res.status(404);
    throw new Error("Pekerjaan tidak ditemukan");
  }

  // RBAC Logic
  const { role, _id: userId } = req.user;

  if (role === "Programmer") {
    // Find the programmer profile for the current user
    const programmerProfile = await Programmer.findOne({ user: userId });
    if (!programmerProfile || !job.programmer || job.programmer.toString() !== programmerProfile._id.toString()) {
      res.status(403);
      throw new Error("Programmer hanya dapat mengubah status pekerjaan yang ditugaskan kepadanya.");
    }
  }
  // Admins and Project Managers can update any job status without restriction

  job.status = status;
  await job.save();

  res.status(200).json(job);
});

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
};
