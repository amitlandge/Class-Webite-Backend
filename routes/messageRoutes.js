import express from "express";

import auth from "../middleware/auth.js";
import {
  deleteMessage,
  getMessages,
  sendAttachment,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/getAllMessage", auth, getMessages);

router.post("/attachments", auth, sendAttachment);
router.delete("/delete/:mid", auth, deleteMessage);
export default router;
