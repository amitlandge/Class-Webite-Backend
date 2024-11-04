import express from "express";
import {
  createContact,
  getAllUser,
  getProfile,
  login,
  logout,
  register,
} from "../controllers/userControllers.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/getMyProfile", auth, getProfile);
router.get("/getAllUsers", auth, getAllUser);
router.get("/logout", auth, logout);
router.post("/createContact", createContact);
export default router;
