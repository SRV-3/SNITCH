import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(user, res) {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
  );
  res.cookie("token", token);
}

async function registerController(req, res) {
  const { email, contact, fullname, password } = req.body;

  const isUser = await userModel.findOne({
    $or: [{ email }, { contact }],
  });

  if (isUser) {
    return res
      .status(400)
      .json({ message: "user with these credetials already exist" });
  }

  const user = await userModel.create({
    email,
    contact,
    fullname,
    password,
  });

  sendTokenResponse(user, res);

  res.status(201).json({
    message: "user registered succesfully",
  });
}
const authController = {
  registerController,
};

export default authController;
