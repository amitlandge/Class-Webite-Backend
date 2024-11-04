import express from "express";
import {
  changeRequestStatus,
  deleteEnroll,
  editEnroll,
  enrollStudent,
  getAllEnroll,
  getEnrollDetails,
  getGirlsAndBoys,
  getStudentDetails,
} from "../controllers/enrollControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/enroll", auth, enrollStudent);
router.get("/enrollDetails", auth, getEnrollDetails);
router.get("/getAllEnrolls", auth, getAllEnroll);
router.get("/enroll/:id", auth, getStudentDetails);
router.put("/enroll/update/:id", auth, changeRequestStatus);
router.delete("/enroll/delete/:id", auth, deleteEnroll);
router.get("/enroll/get/counts", auth, getGirlsAndBoys);
router.put("/enroll/update", auth, editEnroll);
export default router;
