import { Router } from "express";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../vaildator/auth.validator.js";
import {
  registerController,
  loginController,
  googleCallback,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";

const router = Router();

router.post("/register", validateRegisterUser, registerController);

router.post("/login", validateLoginUser, loginController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      config.NODE_ENV == "development"
        ? "http://localhost:5173/login"
        : "/login",
  }),

  googleCallback,
);
export default router;
