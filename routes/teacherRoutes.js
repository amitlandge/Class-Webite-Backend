import express from "express";

import auth from "../middleware/auth.js";

import {
  addTeacher,
  deleteTeacher,
  getTeachers,
} from "../controllers/teacherControllers.js";

const router = express.Router();

router.post("/add-teacher", auth, addTeacher);
router.get("/getAllTeachers", getTeachers);
router.delete("/delete/:tid", auth, deleteTeacher);
export default router;
