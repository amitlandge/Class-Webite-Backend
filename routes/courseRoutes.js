import express from "express";

import auth from "../middleware/auth.js";
import {
  countEnrollment,
  createCourse,
  deleteCourse,
  editCourse,
  getAdminData,
  getAllCourseName,
  getAllCourses,
  getCourseDetails,
} from "../controllers/courseControllers.js";
import {
  createAssignment,
  deleteAssignments,
  getAllAssignment,
  getCourseAssignments,
  getSingleAssignments,
} from "../controllers/assignmentControllers.js";

const router = express.Router();

router.post("/create-course", auth, createCourse);
router.get("/getAllCourses", getAllCourses);
router.get("/getCourseDetails/:cid", getCourseDetails);
router.put("/update/:cid", auth, editCourse);
router.delete("/delete/:cid", auth, deleteCourse);
router.post("/create-assignment", auth, createAssignment);
router.get("/getAllAssignment", getAllAssignment);
router.delete("/assignments/delete/:aid", deleteAssignments);
router.get("/assignment/course", auth, getCourseAssignments);
router.get("/assignment/:aid", auth, getSingleAssignments);
router.get("/getCourseName", auth, getAllCourseName);
router.get("/getCount", auth, countEnrollment);
router.get("/getAdminData", auth, getAdminData);
export default router;
