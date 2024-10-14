import mongoose from "mongoose";

const connectDb = () => {
  mongoose
    .connect(process.env.URL, { dbName: "class" })

    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch(() => {
      console.log("Database Failed");
    });
};

export default connectDb;
