const notFound = (req, res, next) => {
  const error = new Error(`Tidak Ditemukan - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Terkadang error datang dengan status 200, kita set ke 500 jika begitu
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Tampilkan stack trace hanya jika tidak di mode production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
