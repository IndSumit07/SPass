import express from "express";
import {
  createEvent,
  getAllEvents,
  getUserEvents,
} from "../controllers/event.controller.js";
import upload from "../configs/multer.config.js";
import { authUser } from "../middlewares/auth.middleware.js";
const eventRouter = express.Router();

eventRouter.post(
  "/create-event",
  authUser,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  createEvent
);

eventRouter.get("/all", getAllEvents);

eventRouter.get("/user-events", authUser, getUserEvents);

export default eventRouter;
