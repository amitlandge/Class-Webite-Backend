import cloudinary from "cloudinary";
import { Enroll } from "../model/enrollSchema.js";
import { ErrorHandler } from "../utility/error.js";

const enrollStudent = async (req, res, next) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      age,
      grade,
      address,
      userId,
    } = req.body;

    if (!req.files) {
      return next(new ErrorHandler("Please Upload Aavatar", 400));
    }
    const { avatar } = req.files;

    let profilePicture = {};
    let enroll;
    const user = await Enroll.findOne({ user: userId });
    if (user) {
      return next(new ErrorHandler("User Already Enrolled The Form"));
    }

    await cloudinary.v2.uploader
      .upload(avatar.tempFilePath, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      })
      .then(async (res) => {
        (profilePicture.public_id = res.public_id),
          (profilePicture.url = res.secure_url);
        enroll = await Enroll.create({
          firstName,
          middleName,
          lastName,
          phone,
          address,
          age,
          grade,
          user: userId,
          avatar: profilePicture,
        });
      })
      .catch((err) => {
        return next(new ErrorHandler(err.message, 400));
      });
    if (enroll) {
      return res.status(200).json({
        message: "Success",
        enroll: enroll,
      });
    }
  } catch (error) {
    return next(error);
  }
};
const getEnrollDetails = async (req, res, next) => {
  try {
    const enrolldetails = await Enroll.findOne({ user: req.user })
      .populate("user", "email username")
      .lean();
    if (enrolldetails) {
      res.status(200).json({
        message: "Success",
        enrolldetails,
      });
    }
  } catch (error) {
    return next(error);
  }
};
export { enrollStudent, getEnrollDetails };
