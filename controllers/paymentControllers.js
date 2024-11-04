import razorpay from "../utility/config.js";
import crypto from "crypto";
import Payment from "../model/paymentSchema.js";
const payment = async (req, res, next) => {
  const { amount, studentName, className } = req.body;
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id, amount, studentName, className });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};
const verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature, studentName, course, amount } =
    req.body;

  const sign = crypto
    .createHmac("sha256", process.env.SECRETE_ID)
    .update(orderId + "|" + paymentId)
    .digest("hex");
  console.log(req.user);
  if (sign === signature) {
    const payment = await Payment.create({
      userId: req.user,
      studentName,
      course: course,
      amount,
      paymentId,
      orderId,
      status: "Success",
    });
    await payment.save();
    res.status(200).json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Payment verification failed" });
  }
};

const getAllPaymentData = async (req, res, next) => {
  try {
    console.log("enter");
    const getPaymentData = await Payment.find({
      userId: req.user,
      status: "Success",
    });
    res.status(200).json({
      message: "Success",
      paymentData: getPaymentData,
    });
  } catch (error) {
    next(error);
  }
};
const sendKey = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Success",
      key_id: process.env.KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};
export { payment, verifyPayment, getAllPaymentData, sendKey };
