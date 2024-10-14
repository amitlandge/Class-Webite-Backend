import express from "express";
import {
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
router.get("/logout", auth, logout);
export default router;
