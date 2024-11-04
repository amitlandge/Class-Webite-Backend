import express from "express";

import auth from "../middleware/auth.js";
import {
  getAllPaymentData,
  payment,
  sendKey,
  verifyPayment,
} from "../controllers/paymentControllers.js";

const router = express.Router();

router.post("/razorpay", auth, payment);
router.post("/create-payment", auth, verifyPayment);
router.get("/getPaymentData", auth, getAllPaymentData);

router.get("/sendKey", auth, sendKey);

export default router;
