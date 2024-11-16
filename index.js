import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import enrollRoutes from "./routes/enrollRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import expressUpload from "express-fileupload";
import { errorHandler } from "./middleware/errorHandler.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE } from "./constants/event.js";
import { Message } from "./model/messagesSchema.js";
import { corsOptions } from "./utility/corsOptions.js";

const app = express();
dotenv.config({
  path: "./.env",
});

// const corsOptions = {
//   origin: [process.env.LOCALHOST],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// };

connectDb();
app.use(cors(corsOptions));
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});
app.use(
  expressUpload({
    useTempFiles: true,
  })
);
cloudinary.config({
  cloud_name: process.env.CLAUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/", enrollRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/lecture", lectureRoutes);
app.use(errorHandler);
app.set("io", io);
io.on("connection", (socket) => {
  socket.on(NEW_MESSAGE, async (data) => {
    const message = await Message.create(data);
    let newMessage = {
      ...data,
      _id: message._id,
    };
    io.emit(NEW_MESSAGE, newMessage);
  });
});
server.listen(process.env.PORT, () => {
  console.log("Server is Running at port", 4000);
});
