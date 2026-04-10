import { Router } from "express";
import { validateRegisterUser } from "../vaildator/auth.validator.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/register",
  validateRegisterUser,
  authController.registerController,
);

export default router;
