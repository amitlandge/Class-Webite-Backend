import cloudinary from "cloudinary";
import { Enroll } from "../model/enrollSchema.js";
import { ErrorHandler } from "../utility/error.js";
import {
  deleteImageFromCloudanary,
  sendFileToCloud,
} from "../utility/features.js";

const enrollStudent = async (req, res, next) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      age,
      course,
      address,
      userId,
      gender,
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
          gender,
          age,
          course,
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
const getAllEnroll = async (req, res, next) => {
  try {
    const getAllEnrollData = await Enroll.find();
    res.status(200).json({
      message: "Success",
      enrolls: getAllEnrollData,
    });
  } catch (error) {
    next(error);
  }
};
const getStudentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getEnrollData = await Enroll.findById(id);
    res.status(200).json({
      message: "Success",
      studentDeatils: getEnrollData,
    });
  } catch (error) {
    next(error);
  }
};
const changeRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const changeStatus = await Enroll.findByIdAndUpdate(id, req.body);
    await changeStatus.save();
    res.status(200).json({
      message: "Success",
      changeStatus: changeStatus,
    });
  } catch (error) {
    next(error);
  }
};
const deleteEnroll = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteEnrollForm = await Enroll.findByIdAndDelete(id);
    // await deleteEnrollForm.save();
    res.status(200).json({
      message: "Success",
      changeStatus: deleteEnrollForm,
    });
  } catch (error) {
    next(error);
  }
};
const getGirlsAndBoys = async (req, res, next) => {
  try {
    const [boys, girls] = await Promise.all([
      Enroll.countDocuments({ gender: "male" }),
      Enroll.countDocuments({ gender: "female" }),
    ]);
    res.status(200).json({
      message: "Success",
      count: { girls, boys },
    });
  } catch (error) {
    next(error);
  }
};
const editEnroll = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    const enroll = await Enroll.findById(updates._id);
    if (!enroll) {
      return next(new ErrorHandler("Enroll is not found"));
    }
    if (!req.files) {
      delete updates.avatar;
      const updatedCourse = await Enroll.findByIdAndUpdate(
        updates._id,
        updates,
        {
          new: true,
        }
      );
      res
        .status(200)
        .json({ message: "Enroll updated successfully", updatedCourse });
    }
    let publicIds = [enroll.avatar?.public_id];

    if (req.files?.avatar) {
      const newFileArray = Array.from(req.files?.avatar);
      if (newFileArray.length === 0) {
        newFileArray.push(req.files?.avatar);
      }

      const fileLinks = await sendFileToCloud(newFileArray);

      const [updatedCourse] = await Promise.all([
        Enroll.findByIdAndUpdate(
          updates._id,
          {
            ...updates,
            avatar: fileLinks[0],
          },
          {
            new: true,
            runValidators: true,
          }
        ),
        deleteImageFromCloudanary(publicIds),
      ]);
      res
        .status(200)
        .json({ message: "Enroll updated successfully", updatedCourse });
    }
  } catch (error) {
    next(error);
  }
};
export {
  enrollStudent,
  getEnrollDetails,
  getAllEnroll,
  getStudentDetails,
  changeRequestStatus,
  deleteEnroll,
  getGirlsAndBoys,
  editEnroll,
};
