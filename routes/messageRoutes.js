import express from "express";

import auth from "../middleware/auth.js";
import {
  deleteMessage,
  getMessages,
  sendAttachment,
} from "../controllers/messageControllers.js";
import { askDought } from "../controllers/apiControllers.js";

const router = express.Router();

router.get("/getAllMessage", auth, getMessages);

router.post("/attachments", auth, sendAttachment);
router.delete("/delete/:mid", auth, deleteMessage);
router.post("/ask", auth, askDought);
export default router;
