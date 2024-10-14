import express from "express";
import {
  enrollStudent,
  getEnrollDetails,
} from "../controllers/enrollControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/enroll", auth, enrollStudent);
router.get("/enrollDetails", auth, getEnrollDetails);

export default router;
