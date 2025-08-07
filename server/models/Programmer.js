const mongoose = require("mongoose");

const ProgrammerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    nim: {
      type: String,
      default: "",
    },
    jurusan: {
      type: String,
      default: "",
    },
    skill: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ["Tersedia", "Mengerjakan Tugas", "Cuti"],
      default: "Tersedia",
    },
  },
  {
    timestamps: true,
    // Opsi untuk memastikan virtual fields disertakan saat toJSON (misal: saat mengirim response)
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field untuk mengambil nama dan email dari model User yang direferensikan
// Ini berguna agar tidak perlu melakukan .populate() setiap saat secara manual
ProgrammerSchema.virtual("name", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
  get: (user) => user.name,
});

ProgrammerSchema.virtual("email", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
  get: (user) => user.email,
});

module.exports = mongoose.model("Programmer", ProgrammerSchema);
