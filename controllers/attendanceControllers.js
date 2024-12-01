import { Attendance } from "../model/attendanceSchema.js";
import { ErrorHandler } from "../utility/error.js";

const createAttendance = async (req, res, next) => {
  try {
    const { date, status } = req.body;

    const user = await Attendance.findOne({ userId: req.user, date: date });
    if (user) {
      return next(new ErrorHandler("You have Already filled the Attendance"));
    }
    const createAttendance = await Attendance.create({
      userId: req.user,
      date,
      status,
    });
    res.status(200).json({
      message: "SuccessFully",
      attendance: createAttendance,
    });
  } catch (error) {
    next(error);
  }
};
const getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ userId: req.user });
    res.status(200).json({
      message: "SuccessFully",
      attendance: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export { createAttendance, getAttendance };
