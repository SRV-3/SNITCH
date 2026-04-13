import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../vaildator/auth.validator.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/register",
  validateRegisterUser,
  authController.registerController,
);

router.post("/login", validateLoginUser, authController.loginController);

export default router;
