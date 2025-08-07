const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const programmerRoutes = require("./routes/programmerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const standbyRoutes = require("./routes/standbyRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables from /server/.env
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect to database
connectDB();

const app = express();

// Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Hanya izinkan akses dari origin ini
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/programmers", programmerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/standby", standbyRoutes);

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Frontend Serving ---
// (Untuk nanti saat frontend React sudah di-build)
/*
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
*/

app.get("/", (req, res) => {
  res.send("API server is running correctly.");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
