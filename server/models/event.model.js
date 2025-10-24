import mongoose from "mongoose";

const passSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  passId: { type: String, unique: true, required: true },
  qrCodeData: { type: String, required: true },
  passImage: { type: String },
  status: {
    type: String,
    enum: ["issued", "checked-in", "cancelled", "expired"],
    default: "issued",
  },
  issuedAt: { type: Date, default: Date.now },
  checkedInAt: { type: Date },
  seatNumber: { type: String },
  additionalInfo: { type: mongoose.Schema.Types.Mixed },
});

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
    passTemplate: {
      layout: {
        type: String,
        enum: ["standard", "premium", "vip"],
        default: "standard",
      },
      primaryColor: { type: String, default: "#8B5CF6" },
      secondaryColor: { type: String, default: "#EC4899" },
      backgroundImage: { type: String },
      showQRCode: { type: Boolean, default: true },
      showUserPhoto: { type: Boolean, default: false },
      customFields: [
        {
          label: String,
          value: String,
        },
      ],
    },

    passes: [passSchema],
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
