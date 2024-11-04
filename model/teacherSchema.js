import { Schema, model } from "mongoose";
const teacherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    subjects: {
      type: String,
      required: true,
    },

    avatar: {
      public_id: {
        type: String,
        required: [true, "Please Upload Attachment"],
      },
      url: {
        type: String,
        required: [true, "Please Upload Attachment"],
      },
    },
  },
  {
    timestamps: true,
  }
);
export const Teacher = model("teacher", teacherSchema);
