import { Teacher } from "../model/teacherSchema.js";
import cloudinary from "cloudinary";
import { ErrorHandler } from "../utility/error.js";
import { deleteImageFromCloudanary } from "../utility/features.js";
const addTeacher = async (req, res, next) => {
  try {
    const { name, bio, subjects } = req.body;
    if (!req.files) {
      return next(new ErrorHandler("Please Upload Image", 400));
    }
    const { avatar } = req.files;
    let avatarImage = {};
    await cloudinary.v2.uploader
      .upload(avatar.tempFilePath, {
        folder: "teacher-Image",
        width: 150,
        crop: "scale",
      })
      .then(async (res) => {
        (avatarImage.public_id = res.public_id),
          (avatarImage.url = res.secure_url);
        await Teacher.create({
          name,
          bio,
          subjects,
          avatar: avatarImage,
        });
      })
      .catch((err) => {
        return next(new ErrorHandler(err.message, 400));
      });
    res.status(200).json({
      message: true,
    });
  } catch (error) {
    next(error);
  }
};
const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({});
    res.status(200).json({
      message: "Success",
      teachers,
    });
  } catch (error) {
    next(error);
  }
};
const deleteTeacher = async (req, res, next) => {
  const { tid } = req.params;
  try {
    const [findTeacher] = await Promise.all([
      Teacher.findById(tid),
      Teacher.findByIdAndDelete(tid),
    ]);
    if (findTeacher) {
      await deleteImageFromCloudanary([findTeacher.avatar?.public_id]);
      res.status(200).json({
        message: "Success",
      });
    }
  } catch (error) {
    next(error);
  }
};
export { addTeacher, getTeachers, deleteTeacher };
