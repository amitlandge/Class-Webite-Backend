import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentName: String,
  course: String,
  amount: Number,
  paymentId: String,
  orderId: String,
  status: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", PaymentSchema);
