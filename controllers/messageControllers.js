import { NEW_MESSAGE } from "../constants/event.js";
import { Message } from "../model/messagesSchema.js";
import { emitEvent } from "../utility/eventHandler.js";
import {
  deleteImageFromCloudanary,
  sendFileToCloud,
} from "../utility/features.js";

const getMessages = async (req, res, next) => {
  try {
    const course = req.query.course;
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    const chats = await Message.find({ course: course })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    if (!chats) {
      return next(new ErrorHandler("Chat Not Found"));
    }
    const messageCount = await Message.countDocuments({ course: course });
    const totalPages = Math.ceil(messageCount / limit) || 0;
    res.status(200).json({
      status: "Succesfull",
      messages: chats.reverse(),
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

const sendAttachment = async (req, res, next) => {
  const files = req.files?.files || [];
  const { fName, lName, userId, course } = req.body;

  const newFileArray = Array.from(files);
  if (newFileArray.length === 0) {
    newFileArray.push(files);
  }

  try {
    const fileLinks = await sendFileToCloud(newFileArray);

    const attachments = {
      message: "",
      attachments: fileLinks,
      sender: {
        userId,
        fName,
        lName,
      },
      course: course,
    };

    const message = await Message.create(attachments);

    emitEvent(req, NEW_MESSAGE, {
      ...attachments,
      _id: message._id,
    });

    res.status(200).json({
      message: "SuccessFully",
      message,
    });
  } catch (error) {
    next(error);
  }
};
const deleteMessage = async (req, res, next) => {
  try {
    const { mid } = req.params;

    const message = await Message.findById(mid).lean();

    const publicIds = [];
    message?.attachments.forEach((attachments) => {
      publicIds.push(attachments.public_id);
    });
    const [, messages] = await Promise.all([
      deleteImageFromCloudanary(publicIds),
      Message.findByIdAndDelete(mid),
    ]);
    if (messages) {
      res.status(200).json({
        message: "Delete Message Successfully",
        status: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

export { getMessages, sendAttachment, deleteMessage };
