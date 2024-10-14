import { model, Schema, Types } from "mongoose";

const messagesSchema = new Schema(
  {
    message: {
      type: String,
    },
    grade: {
      type: String,
    },
    attachments: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    sender: {
      userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
      fName: String,
      lName: String,
    },
  },
  {
    timestamps: true,
  }
);
export const Message = model.Message || model("Message", messagesSchema);
