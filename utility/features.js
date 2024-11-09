import { cookieOption } from "./cookiesOption.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
export const setToken = (res, payload, code, message) => {
  const token = jwt.sign({ id: payload._id }, process.env.SECRETE_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(code)
    .cookie("token", token, cookieOption)
    .json({
      message: message,
      user: {
        token: token,
        _id: payload._id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      },
    });
};
export const sendFileToCloud = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,

        {
          folder: "images",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            return resolve(result);
          }
        }
      );
    });
  });

  const results = await Promise.all(uploadPromises);

  try {
    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    return formattedResults;
  } catch (error) {}
};
export const deleteImageFromCloudanary = (public_ids) => {
  const deleteImageFromCloudanary = public_ids.map((publicId) =>
    cloudinary.uploader.destroy(publicId)
  );
  return deleteImageFromCloudanary;
};
