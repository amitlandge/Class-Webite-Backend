class ErrorHandler extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code;
  }
}
export { ErrorHandler };
