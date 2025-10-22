import express from "express";
import { body } from "express-validator";
import {
  getUserProfile,
  login,
  logout,
  register,
  verifyRegistrationOtp,
} from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-otp", verifyRegistrationOtp);
authRouter.get("/profile", authUser, getUserProfile);
authRouter.get("/logout", authUser, logout);

export default authRouter;
