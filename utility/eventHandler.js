export const emitEvent = async (req, event, message) => {
  const io = req.app.get("io");
  console.log(io);
  io.emit(event, message);
};
