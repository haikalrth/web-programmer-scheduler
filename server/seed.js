const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect to DB
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "Admin",
      },
      {
        name: "Manager User",
        email: "manager@example.com",
        password: "password123",
        role: "Manajer Proyek",
      },
      {
        name: "Programmer User",
        email: "programmer@example.com",
        password: "password123",
        role: "Programmer",
      },
    ];

    await User.insertMany(users);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
