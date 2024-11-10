import { Course } from "../model/courseSchema.js";
import cloudinary from "cloudinary";
import { ErrorHandler } from "../utility/error.js";
import {
  deleteImageFromCloudanary,
  sendFileToCloud,
} from "../utility/features.js";
import { Enroll } from "../model/enrollSchema.js";
import { Assignment } from "../model/assignmentSchema.js";
import { User } from "../model/userSchema.js";
const createCourse = async (req, res, next) => {
  try {
    const { title, description, subjects, topic } = req.body;
    if (!req.files) {
      return next(new ErrorHandler("Please Upload Image", 400));
    }
    const { image } = req.files;
    let courseImage = {};
    await cloudinary.v2.uploader
      .upload(image.tempFilePath, {
        folder: "Course-Image",
        quality: "auto:best",
        width: 800,

        crop: "scale",
      })
      .then(async (res) => {
        (courseImage.public_id = res.public_id),
          (courseImage.url = res.secure_url);
        await Course.create({
          title,
          description,
          subjects,
          topic,
          attachment: courseImage,
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

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      message: "Success",
      courses,
    });
  } catch (error) {
    next(error);
  }
};
const getCourseDetails = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const course = await Course.findOne({ _id: cid }).lean();
    const courseCount = await Enroll.countDocuments({ course: course?.title });
    res.status(200).json({
      message: "Success",
      course: {
        ...course,
        courseCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const editCourse = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const updates = { ...req.body };

    const course = await Course.findById(cid);
    if (!course) {
      return next(new ErrorHandler("Course is not found"));
    }
    if (!req.files) {
      const updatedCourse = await Course.findByIdAndUpdate(cid, updates, {
        new: true,
      });
      res
        .status(200)
        .json({ message: "Course updated successfully", updatedCourse });
    }
    let publicIds = [course.attachment?.public_id];
    console.log(publicIds);

    if (req.files?.image) {
      const newFileArray = Array.from(req.files?.image);
      if (newFileArray.length === 0) {
        newFileArray.push(req.files?.image);
      }
      console.log(newFileArray);
      const fileLinks = await sendFileToCloud(newFileArray);

      const [updatedCourse] = await Promise.all([
        Course.findByIdAndUpdate(
          cid,
          {
            ...updates,
            attachment: fileLinks[0],
          },
          {
            new: true, // Return the updated course
            runValidators: true, // Ensure model validators run on update
          }
        ),
        deleteImageFromCloudanary(publicIds),
      ]);
      res
        .status(200)
        .json({ message: "Course updated successfully", updatedCourse });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
const deleteCourse = async (req, res, next) => {
  const { cid } = req.params;
  try {
    const [findCouse] = await Promise.all([
      Course.findById(cid),
      Course.findByIdAndDelete(cid),
    ]);
    if (findCouse) {
      await deleteImageFromCloudanary([findCouse.attachment?.public_id]);
      res.status(200).json({
        message: "Success",
      });
    }
  } catch (error) {
    next(error);
  }
};
const getAllCourseName = async (req, res, next) => {
  try {
    const course = await Course.find({});
    const getName = course?.map((c) => {
      return c.title;
    });
    res.status(200).json({
      message: "Success",
      courses: getName,
    });
  } catch (error) {
    next(error);
  }
};
const countEnrollment = async (req, res, next) => {
  try {
    const course = await Course.find({});
    const getName = course?.map((c) => {
      return c.title;
    });

    const getCount = await Promise.all(
      getName.map(async (course) => {
        const count = await Enroll.countDocuments({ course: course }); // assuming course field is a reference ID
        return count;
      })
    );

    res.status(200).json({
      message: "Success",
      courses: getCount,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminData = async (req, res, next) => {
  try {
    const [enroll, course, assignments, user] = await Promise.all([
      Enroll.countDocuments(),
      Course.countDocuments(),
      Assignment.countDocuments(),
      User.countDocuments(),
    ]);
    res.status(200).json({
      enroll,
      course,
      assignments,
      user,
    });
  } catch (error) {
    next(error);
  }
};
export {
  createCourse,
  getAllCourses,
  getCourseDetails,
  editCourse,
  deleteCourse,
  getAllCourseName,
  countEnrollment,
  getAdminData,
};
