import { Schema, model } from "mongoose";
const lectureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: [true, "Please Enter Grade"],
    },
    attachments: [
      {
        public_id: {
          type: String,
          required: [true, "Please Upload Attachment"],
        },
        url: {
          type: String,
          required: [true, "Please Upload Attachment"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Lecture = model("lecture", lectureSchema);
