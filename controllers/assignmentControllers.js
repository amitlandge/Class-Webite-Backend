import { Assignment } from "../model/assignmentSchema.js";
import { ErrorHandler } from "../utility/error.js";
import {
  deleteImageFromCloudanary,
  sendFileToCloud,
} from "../utility/features.js";

const createAssignment = async (req, res, next) => {
  try {
    const { title, note, course } = req.body;

    if (!req.files) {
      return next(new ErrorHandler("Please Upload Video", 400));
    }
    const { images } = req.files;
    const newFileArray = Array.from(images);
    if (newFileArray.length === 0) {
      newFileArray.push(images);
    }

    const fileLinks = await sendFileToCloud(newFileArray);
    if (fileLinks) {
      const createAssignment = await Assignment.create({
        title,
        note,
        course,
        attachments: fileLinks,
      });
      return res.status(200).json({
        message: true,
        assignments: createAssignment,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getAllAssignment = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({});
    return res.status(200).json({
      message: "Success",
      assignments,
    });
  } catch (error) {
    next(error);
  }
};
const deleteAssignments = async (req, res, next) => {
  const { aid } = req.params;
  try {
    const [findAssignments] = await Promise.all([
      Assignment.findById(aid),
      Assignment.findByIdAndDelete(aid),
    ]);
    if (findAssignments) {
      let publicIds = [];
      findAssignments.attachments?.map((assign) => {
        publicIds.push(assign.public_id);
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
const getSingleAssignments = async (req, res, next) => {
  try {
    const { aid } = req.params;
    const getAssignment = await Assignment.findById(aid);
    if (getAssignment) {
      res.status(200).json({
        message: "Success",
        assignment: getAssignment,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getCourseAssignments = async (req, res, next) => {
  try {
    const { course } = req.query;

    const assignments = await Assignment.find({
      course: course,
    });

    if (assignments) {
      res.status(200).json({
        message: "Success",
        assignment: assignments,
      });
    }
  } catch (error) {
    next(error);
  }
};
export {
  createAssignment,
  getAllAssignment,
  deleteAssignments,
  getSingleAssignments,
  getCourseAssignments,
};
