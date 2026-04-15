import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.cookie("token", token);
  res.status(201).json({
    message: message,
  });
}

export async function registerController(req, res) {
  const { email, contact, fullname, password, isSeller } = req.body;

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

  sendTokenResponse(user, res, "user registered succesfully");
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  sendTokenResponse(user, res, "user loged in succesfully");
}
export async function googleCallback(req, res) {
  const { id, displayName, emails } = req.user;
  const email = emails[0].value;

  let user = await userModel.findOne({ email });

  if (!user) {
    user = await userModel.create({
      email,
      fullname: displayName,
      googleId: id,
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.redirect("http://localhost:5173/");
}
