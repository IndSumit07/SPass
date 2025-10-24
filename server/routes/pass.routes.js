import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  getUserPasses,
  issuePass,
  scanPass,
} from "../controllers/pass.controller.js";

const passRouter = express.Router();

passRouter.post("/issue", authUser, issuePass);
passRouter.post("/scan", scanPass);
passRouter.post("/user-passes", getUserPasses);

export default passRouter;
