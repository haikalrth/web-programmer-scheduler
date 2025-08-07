const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Terhubung ke MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Gagal koneksi MongoDB: ${error.message}`);
    process.exit(1); // Keluar dari proses dengan status gagal
  }
};

module.exports = connectDB;
