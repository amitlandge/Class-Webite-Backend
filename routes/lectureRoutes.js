import express from "express";

import auth from "../middleware/auth.js";
import {
  createLectures,
  deleteLecture,
  getAllLecture,
  getCourseLecture,
  getSingleLecture,
} from "../controllers/lecturesControllers.js";
const router = express.Router();
router.post("/create-lecture", auth, createLectures);
router.get("/getAllLecture", getAllLecture);
router.delete("/delete/:aid", deleteLecture);
router.get("/course", auth, getCourseLecture);
router.get("/course/:aid", auth, getSingleLecture);
export default router;
