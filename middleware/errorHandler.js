const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  err.message = err.message || "Internal Server Problem";
  err.statusCode = err.statusCode || 400;
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
export { errorHandler };
