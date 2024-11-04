import { Schema, model } from "mongoose";
const courseShema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subjects: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    attachment: {
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
export const Course = model("course", courseShema);
