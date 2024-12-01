import express from "express";
import auth from "../middleware/auth.js";
import {
  createAttendance,
  getAttendance,
} from "../controllers/attendanceControllers.js";
const router = express.Router();
router.post("/create", auth, createAttendance);
router.get("/getAttendance", auth, getAttendance);
export default router;
