import { User } from "../model/userSchema.js";
import { setToken } from "../utility/features.js";
import { ErrorHandler } from "../utility/error.js";
import bcryptjs from "bcryptjs";
import { cookieOption } from "../utility/cookiesOption.js";
import { Contact } from "../model/contactSchema.js";
const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email && !password) {
      return next(new ErrorHandler("Please Fill All Details", 400));
    }
    let user = await User.findOne({ username: username });
    let userEmail = await User.findOne({ email: email });
    if (user && userEmail) {
      return next(
        new ErrorHandler("This Username and Email Already Exist", 400)
      );
    }
    user = await User.create({
      username,
      password,
      email: email,
    });

    setToken(res, user, 200, "User Register");
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username && !password) {
      res.status(400).json({
        message: "Please Fill All the field",
      });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid User", 400));
    }
    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      return next(new ErrorHandler("Password Does Not Matched", 400));
    }

    setToken(res, user, 200, "SuccesFully Login");
  } catch (error) {
    next(error);
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).lean();
    res.status(200).json({
      message: "success",
      user: {
        ...user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "success",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};
const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOption, maxAge: 0 })
    .json({
      message: "logout Successfully",
    });
};
const createContact = async (req, res, next) => {
  try {
    const { name, subject, email, message } = req.body;
    const create = await Contact.create({
      name,
      email,
      subject,
      message,
    });
    if (create) {
      res.status(200).json({
        message: "Success",
      });
    }
  } catch (error) {
    next(error);
  }
};
export { register, login, getProfile, logout, getAllUser, createContact };
