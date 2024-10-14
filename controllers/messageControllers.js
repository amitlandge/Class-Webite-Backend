import { NEW_MESSAGE } from "../constants/event.js";
import { Message } from "../model/messagesSchema.js";
import { emitEvent } from "../utility/eventHandler.js";
import {
  deleteImageFromCloudanary,
  sendFileToCloud,
} from "../utility/features.js";

const getMessages = async (req, res, next) => {
  try {
    const { grade } = req.query;

    // const resultPerpage = 7;
    // const skipChat = (page - 1) * resultPerpage;
    console.log(grade);
    const chats = await Message.find({ grade: grade })
      //   .skip(skipChat)
      //   .limit(resultPerpage)
      .sort({ createdAt: -1 })
      //   .populate("sender", "name")
      .lean();
    if (!chats) {
      return next(new ErrorHandler("Chat Not Found"));
    }
    // const messageCount = await Message.countDocuments({ chatId: cid });

    // const totalPages = Math.ceil(messageCount / resultPerpage) || 0;
    res.status(200).json({
      status: "Succesfull",
      //   chats: chats.length,
      messages: chats.reverse(),
      //   totalPages: totalPages,
    });
  } catch (error) {
    next(error);
  }
};

const sendAttachment = async (req, res, next) => {
  const files = req.files?.files || [];
  const { fName, lName, userId, grade } = req.body;
  console.log(req.body);

  const newFileArray = Array.from(files);
  if (newFileArray.length === 0) {
    newFileArray.push(files);
  }

  try {
    // const chats = await Chat.findById(chatId);
    // const myProfile = await User.findById(req.user, "name");
    // if (!chats) {
    //   return next(new ErrorHandler("Chat Not Found"));
    // }

    const fileLinks = await sendFileToCloud(newFileArray);

    // {
    //   _id: "something",
    //   sender: {
    //     _id: "xyz",
    //     name: "amit",
    //     std: "8th",
    //   },
    //   content: "Hii This side Amit",
    //   attachments: "",
    // },

    const attachments = {
      message: "",
      attachments: fileLinks,
      sender: {
        userId,
        fName,
        lName,
      },
      grade: grade,
    };
    console.log(attachments);
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
    console.log(req.params);
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
