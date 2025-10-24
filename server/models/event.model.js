import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    description: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: {
      name: { type: String },
      address: { type: String },
    },
    venue: {
      type: String,
    },
    organisationName: {
      type: String,
      required: true,
    },

    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    capacity: { type: Number, min: 0 },
    isRegistrationOpen: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ["upcoming", "draft", "published", "ongoing", "completed"],
      default: "draft",
    },
    coverImage: { type: String, default: "" },
    logo: {
      type: String,
      default: "",
    },
    ticketType: {
      type: String,
      enum: ["Free", "Paid"],
      default: "Free",
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    registrationDeadline: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
