const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama wajib diisi"],
    },
    npm: {
      type: String,
      required: [true, "NPM wajib diisi"],
      unique: true,
    },
    jurusan: {
      type: String,
      required: [true, "Jurusan wajib diisi"],
    },
    username: {
      type: String,
      required: [true, "Username wajib diisi"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      select: false, // Jangan tampilkan password secara default saat query
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    role: {
      type: String,
      enum: ["Admin", "Programmer"],
      default: "Programmer",
    },
  },
  {
    timestamps: true,
  }
);

// Enkripsi password sebelum disimpan
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Metode untuk membandingkan password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
