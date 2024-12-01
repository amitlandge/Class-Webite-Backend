import { Schema, Types, model } from "mongoose";
const attendanceSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: [true, "Please Enter Status"],
    },
  },
  {
    timestamps: true,
  }
);
export const Attendance = model("Attendance", attendanceSchema);
