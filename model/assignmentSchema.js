import { Schema, model } from "mongoose";
const assignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    note: {
      type: String,
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
export const Assignment = model("Assignment", assignmentSchema);
