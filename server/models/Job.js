const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Judul pekerjaan wajib diisi"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Deskripsi pekerjaan wajib diisi"],
    },
    programmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programmer",
      default: null,
    },
    status: {
      type: String,
      enum: ["Backlog", "In Progress", "Review", "Completed"],
      default: "Backlog",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);
