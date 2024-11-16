import { Lecture } from "../model/lectureSchema.js";
import {
  deleteImageFromCloudanary,
  sendFileToCloud,
} from "../utility/features.js";

const createLectures = async (req, res, next) => {
  try {
    const { title, subject, course } = req.body;

    if (!req.files) {
      return next(new ErrorHandler("Please Upload Video", 400));
    }
    const { videos } = req.files;
    const newFileArray = Array.from(videos);
    if (newFileArray.length === 0) {
      newFileArray.push(videos);
    }

    const fileLinks = await sendFileToCloud(newFileArray);
    if (fileLinks) {
      const createLecture = await Lecture.create({
        title,
        subject,
        course,
        attachments: fileLinks,
      });
      return res.status(200).json({
        message: true,
        lecture: createLecture,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getAllLecture = async (req, res, next) => {
  try {
    const lectures = await Lecture.find({});
    return res.status(200).json({
      message: "Success",
      lectures,
    });
  } catch (error) {
    next(error);
  }
};
const getSingleLecture = async (req, res, next) => {
  try {
    const { aid } = req.params;
    const getLecture = await Lecture.findById(aid);
    if (getLecture) {
      res.status(200).json({
        message: "Success",
        lecture: getLecture,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getCourseLecture = async (req, res, next) => {
  try {
    const { course } = req.query;

    const lectures = await Lecture.find({
      course: course,
    });

    if (lectures) {
      res.status(200).json({
        message: "Success",
        lectures,
      });
    }
  } catch (error) {
    next(error);
  }
};
const deleteLecture = async (req, res, next) => {
  const { aid } = req.params;
  try {
    const [findLecture] = await Promise.all([
      Lecture.findById(aid),
      Lecture.findByIdAndDelete(aid),
    ]);
    if (findLecture) {
      let publicIds = [];
      findLecture.attachments?.map((lec) => {
        publicIds.push(lec.public_id);
      });
      await deleteImageFromCloudanary(publicIds);
      res.status(200).json({
        message: "Success",
      });
    }
  } catch (error) {
    next(error);
  }
};
export {
  createLectures,
  getAllLecture,
  getSingleLecture,
  getCourseLecture,
  deleteLecture,
};
