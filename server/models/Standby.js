const mongoose = require("mongoose");

const StandbySchema = new mongoose.Schema(
  {
    programmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programmer",
      required: true,
    },
    standbyDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mencegah satu programmer memiliki jadwal standby ganda pada hari yang sama
StandbySchema.index({ programmer: 1, standbyDate: 1 }, { unique: true });

module.exports = mongoose.model("Standby", StandbySchema);
