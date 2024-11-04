import { Schema, Types, model } from "mongoose";
const enrollSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: [true, "Please Enter Your First Name"],
      trim: true,
    },
    middleName: {
      type: String,
      required: [true, "Please Enter Your Middle Name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please Enter Your Last Name"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Please Enter Your Gender"],
      trim: true,
    },
    request: {
      type: String,
      default: "Pending",
      enum: ["Accepted", "Rejected", "Pending"],
    },
    phone: {
      type: Number,
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
        required: [true, "Please Upload Avatar"],
      },
      url: {
        type: String,
        required: [true, "Please Upload Avatar"],
      },
    },

    address: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Enroll = model("Enroll", enrollSchema);
