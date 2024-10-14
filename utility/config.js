import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.SECRETE_ID,
});
export default razorpay;
