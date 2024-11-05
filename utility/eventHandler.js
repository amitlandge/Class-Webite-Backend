export const emitEvent = async (req, event, message) => {
  const io = req.app.get("io");

  io.emit(event, message);
};
